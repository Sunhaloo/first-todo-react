// simply import the data found in our `.env` file
require("dotenv").config();

// class that will be used to create and instance of an 'LLM'
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

// import the tools created from the 'tools' directory
const {
  createTodoTool,
  getTodosTool,
  updateTodoTool,
  deleteTodoTool,
} = require("../tools");

// get the required information from the `.env` file
const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const temperature = process.env.GEMINI_TEMPERATURE || 0.3;
const prompt = process.env.GEMINI_SYSTEM_PROMPT;

// asynchronous function that will be the whole chat function / end-point
const chat = async (req, res) => {
  try {
    // get our message from the request
    const { message } = req.body;

    // check if the message entered by use if valid
    if (!message || message.trim() === "") {
      console.log("[CHAT API](Chat) Message by user required!");

      return res.status(400).json({
        error: "[CHAT API](Chat) Message by user required!",
      });
    }

    // get the user ID from the token
    const userId = req.user.userId;

    // intialise our large language model
    const llm = new ChatGoogleGenerativeAI({
      model: model,
      apiKey: apiKey,
      temperature: temperature,
    });

    // add / bind the tools to the model --> so that it can make the actual tool call
    const modelWithTools = llm.bindTools([
      createTodoTool,
      getTodosTool,
      updateTodoTool,
      deleteTodoTool,
    ]);

    // invoke / call the actual AI model with user's message and context - tools
    const response = await modelWithTools.invoke(message, {
      userId,
    });

    // INFO: need to get a way to setup the history for the current session's ( AI + user )
    let aiResponse = "";

    if (typeof response.content === "string") {
      aiResponse = response.content;
    } else if (Array.isArray(response.content)) {
      aiResponse = response.content
        .map((item) => {
          if (typeof item === "string") return item;
          if (item.type === "text") return item.text;
          return "";
        })
        .join(" ");
    }

    console.log("[CHAT API](Chat) AI invoked successfully");

    res.json({
      message: aiResponse,
    });
  } catch (error) {
    console.log(`[CHAT API](Chat) server error: `, error);

    return res.status(400).json({
      error: "[CHAT API](Chat) Failed to invoke LLM",
    });
  }
};

module.exports = { chat };
