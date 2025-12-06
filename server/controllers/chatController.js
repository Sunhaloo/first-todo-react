// simply import the data found in our `.env` file
require("dotenv").config();

// class that will be used to create and instance of an 'LLM'
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const {
  HumanMessage,
  AIMessage,
  SystemMessage,
} = require("@langchain/core/messages");

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
    // get our message and history from the request
    const { message, history = [] } = req.body;

    // check if the message entered by user is valid
    if (!message || message.trim() === "") {
      console.log("[CHAT API](Chat) Message by user required!");

      return res.status(400).json({
        error: "[CHAT API](Chat) Message by user required!",
      });
    }

    // get the user ID from the token
    const userId = req.user.userId;

    // initialize our large language model
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

    // build the messages array for the AI
    const messages = [];

    // add system prompt if it exists
    if (prompt) {
      messages.push(new SystemMessage(prompt));
    }

    // add conversation history
    history.forEach((msg) => {
      if (msg.role === "user") {
        messages.push(new HumanMessage(msg.content));
      } else if (msg.role === "assistant") {
        messages.push(new AIMessage(msg.content));
      }
    });

    // add the current user message
    messages.push(new HumanMessage(message));

    // invoke / call the actual AI model with the full conversation history
    const response = await modelWithTools.invoke(messages, {
      userId,
    });

    // extract the AI response
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

    return res.status(500).json({
      error: "[CHAT API](Chat) Failed to invoke LLM",
    });
  }
};

module.exports = { chat };
