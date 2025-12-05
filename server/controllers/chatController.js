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

    res.json({
      message: "[CHAT API](Chat) AI invoked successfully",
    });
  } catch (error) {
    console.log(`[CHAT API](Chat) server error: `, error);

    return res.status(400).json({
      error: "[CHAT API](Chat) Failed to invoke LLM",
    });
  }
};
