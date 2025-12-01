// import the module responsible for AI calls
const { GoogleGenerativeAI } = require("@google/generative-ai");

// import the required function / end-points from the 'todoController.js' file
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getCategories,
} = require("./todoController");

// import the 'dotenv' module to be able to read API key
require("dotenv").config();

// get the required information from the `.env` file
const apiKey = process.env.GEMINI_API_KEY;
const ai_model = process.env.GEMINI_MODEL;
const temperature = process.env.GEMINI_TEMPERATURE;
const prompt = process.env.GEMINI_SYSTEM_PROMPT;

// define the tools that the AI is going to have access to
const ai_tools = [
  {
    functionDeclarations: [
      {
        name: "getTodos",
        description:
          "Get all the TODO items / tasks for the current logged in user; use this to see what 'TODO' items / tasks the user currently has!",
        parameters: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "createTodo",
        description: "Create a new TODO item / task for the user.",
        parameters: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description:
                "The title ( TODO item itself ) / description of the TODO item / task.",
            },
            category: {
              type: "string",
              description:
                "The category in which the TODO item / tasks falls into ( e.g: Coding, Planning, Refactoring, etc )... If not defined; defaults to 'Miscellaneous' category!!!",
            },
          },
          // NOTE: no need to add 'category' has required as it defaults to 'Miscellaneous'
          required: ["title"],
        },
      },
      {
        name: "updateTodo",
        description: "Update an already existing TODO item / task",
        parameters: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The id of the TODO item / task.",
            },
            title: {
              type: "string",
              description:
                "The title ( TODO item itself ) / description of the new TODO item / task [ OPTIONAL ].",
            },
            completed: {
              type: "boolean",
              description:
                "Whether the TODO item / task is completed or not [ OPTIONAL ].",
            },
          },
          required: ["id"],
        },
      },
      {
        name: "deleteTodo",
        description: "Delete a TODO item / task permanently from the database.",
        parameters: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The id of the TODO item / task.",
            },
          },
          required: ["id"],
        },
      },
      {
        name: "getCategories",
        description: "Get all available categories for a TODO item / task.",
        parameters: {
          type: "object",
          properties: {},
          required: [],
        },
      },
    ],
  },
];

// wrapper function to execute TODO 'CRUD' operations
const executeTodoFunction = async (functionName, args, userId) => {
  console.log(`AI calling function: ${functionName}`, args);

  // create mock req and res objects to receive whatever controller is sending in 'JSON'
  const createMockReqRes = (body = {}, params = {}) => {
    const req = {
      body,
      params,
      user: { userId: userId },
    };

    let responseData = null;

    const res = {
      status: (code) => res,
      json: (data) => {
        responseData = data;
        return res;
      },
    };

    return { req, res, getResponse: () => responseData };
  };

  try {
    // `switch` statement to decide what function to call based on controller
    switch (functionName) {
      case "getTodos": {
        const { req, res, getResponse } = createMockReqRes();
        await getTodos(req, res);
        return getResponse();
      }

      default:
        return { error: `Unknown function: ${functionName}` };
    }
  } catch (error) {
    console.error(`Error executing ${functionName}:`, error);
    return { error: error.message || "Function execution failed" };
  }
};

// check if the API key is present ( or not )
if (!apiKey) {
  console.error("GEMINI_API_KEY environment variable is not set");

  process.exit(1);
}

// create a new Google Gemini AI object
const genAI = new GoogleGenerativeAI(apiKey);

// function to be able to send chat requests
const sendMessage = async (req, res) => {
  try {
    // get the message from the requests --> user input + past chat history ( / input )
    const { message, history = [] } = req.body;

    // check if the request actually has a message
    if (!message) {
      return res.status(400).json({ error: "Message is required!" });
    }

    // define the model and configuration
    const model = genAI.getGenerativeModel({
      model: ai_model,
      systemInstruction: prompt + `${new Date()}`,
      tools: ai_tools,
      generationConfig: {
        temperature: temperature,
      },
    });

    // start a chat session with history
    const chat = model.startChat({
      history: history.map((msg) => ({
        // gemini is the "model"
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
    });

    // generate response based on the message from the chat ( sent )
    let result = await chat.sendMessage(message);
    let response = result.response;

    // check if AI wants to call a function
    const functionCalls = response.functionCalls();

    if (functionCalls && functionCalls.length > 0) {
      console.log("AI wants to call functions:", functionCalls);

      // get user ID from authentication
      const userId = req.user.userId;

      // execute the required function
      const functionResponses = await Promise.all(
        functionCalls.map(async (call) => {
          const result = await executeTodoFunction(
            call.name,
            call.args,
            userId,
          );

          return {
            functionResponse: {
              name: call.name,
              response: result,
            },
          };
        }),
      );

      // send function results back to AI assistant
      result = await chat.sendMessage(functionResponses);
      response = result.response;
    }

    // create the AI assistant's response
    const text = response.text();

    // send response back to frontend
    res.status(200).json({
      success: true,
      message: text,
    });

    // if message could not be send to "server"
    // NOTE: status code = '500' ==> internal server error
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get response from AI",
    });
  }
};

// export the functions that are going to handle the 'POST' requests for AI calls
module.exports = {
  sendMessage,
};
