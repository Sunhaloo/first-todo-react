// simply import the data found in our `.env` file
require("dotenv").config();

// class that will be used to create and instance of an 'LLM'
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const {
  HumanMessage,
  AIMessage,
  SystemMessage,
  ToolMessage,
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

// helper function to execute tool calls
const executeToolCall = async (toolCall, userId) => {
  const { name, args } = toolCall;

  console.log(`[CHAT API](Tool) Executing tool: ${name} with args:`, args);

  try {
    let result;

    // configuration object with user ID
    const config = {
      configurable: {
        userId: userId,
      },
    };

    // need the user ID to be able to allow the tool call
    const argsWithUserId = { ...args, userId };

    switch (name) {
      case "createTodo":
        result = await createTodoTool.invoke(argsWithUserId, config);
        break;
      case "getTodos":
        result = await getTodosTool.invoke(argsWithUserId, config);
        break;
      case "updateTodo":
        result = await updateTodoTool.invoke(argsWithUserId, config);
        break;
      case "deleteTodo":
        result = await deleteTodoTool.invoke(argsWithUserId, config);
        break;
      default:
        result = { error: `Unknown tool: '${name}'` };
    }

    console.log(`[CHAT API](Tool) Tool '${name}' executed successfully`);

    return result;
  } catch (error) {
    console.error(`[CHAT API](Tool) Error executing '${name}':`, error);

    return { error: `Failed to execute ${name}: ${error.message}` };
  }
};

// asynchronous function that will be the whole chat function / end-point
const chat = async (req, res) => {
  try {
    // get the user ID from the token
    const userId = req.user.userId;

    // get our message and history from the request
    const { message, history = [] } = req.body;

    // check if the message entered by user is valid
    if (!message || message.trim() === "") {
      console.log("[CHAT API](Chat) Message by user required!");

      return res.status(400).json({
        error: "[CHAT API](Chat) Message by user required!",
      });
    }

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
    let response = await modelWithTools.invoke(messages, {
      configurable: { userId },
    });

    console.log("[CHAT API](Chat) Initial AI invocation complete");

    // tool execution loop - keep calling AI until it stops requesting tools
    let iterationCount = 0;
    const maxIterations = 5;

    while (response.tool_calls && response.tool_calls.length > 0) {
      iterationCount++;

      if (iterationCount > maxIterations) {
        console.warn(
          "[CHAT API](Chat) Max tool iterations reached, breaking loop",
        );

        break;
      }

      console.log(
        `[CHAT API](Chat) Tool calls detected (iteration ${iterationCount}):`,
        response.tool_calls.length,
      );

      // add the AI's response with tool calls to messages
      messages.push(response);

      // execute each tool call
      for (const toolCall of response.tool_calls) {
        const toolResult = await executeToolCall(toolCall, userId);

        // add the tool result to messages
        messages.push(
          new ToolMessage({
            content: JSON.stringify(toolResult),
            tool_call_id: toolCall.id,
          }),
        );
      }

      // call AI again with tool results
      response = await modelWithTools.invoke(messages, {
        configurable: { userId },
      });

      console.log(
        `[CHAT API](Chat) AI invoked again after tool execution (iteration ${iterationCount})`,
      );
    }

    // extract the final AI response
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

    // if no text response but tools were called, provide a default message
    if (!aiResponse && iterationCount > 0) {
      aiResponse = "I've completed the requested action.";
    }

    console.log("[CHAT API](Chat) Final response prepared");

    res.json({
      message: aiResponse,
      toolsUsed: iterationCount > 0,
    });
  } catch (error) {
    console.error(`[CHAT API](Chat) Server error:`, error);

    return res.status(500).json({
      error: "[CHAT API](Chat) Failed to process request",
      details: error.message,
    });
  }
};

// function to provide a greeting message to the user
const greetingMessage = async (req, res) => {
  try {
    // get the user ID from the token
    const userId = req.user.userId;

    // initialize our large language model
    const llm = new ChatGoogleGenerativeAI({
      model: model,
      apiKey: apiKey,
      temperature: temperature,
    });

    // add / bind the tools to the model --> so that it can make the actual tool call
    const modelWithTools = llm.bindTools([getTodosTool]);

    // build the messages array for the AI
    const messages = [
      new SystemMessage(
        prompt || "You are Task Whisperer, a friendly TODO assistant.",
      ),
      new HumanMessage(
        "Greet the user in a friendly manner (something along the lines of 'Hello, how can I assist you today!'), call the 'getTodos' function and display TODOs for user in a nice readable format (better if you display TODO items on a new line. If and only if NO items present, simply greet the user with something simple like 'Hello, how can I assist you?'.",
      ),
    ];

    // invoke AI
    let response = await modelWithTools.invoke(messages, {
      configurable: { userId },
    });

    // tool execution loop ( in case AI wants to call getTodos )
    let iterationCount = 0;
    const maxIterations = 3;

    while (response.tool_calls && response.tool_calls.length > 0) {
      iterationCount++;

      if (iterationCount > maxIterations) break;

      messages.push(response);

      for (const toolCall of response.tool_calls) {
        const toolResult = await executeToolCall(toolCall, userId);

        messages.push(
          new ToolMessage({
            content: JSON.stringify(toolResult),
            tool_call_id: toolCall.id,
          }),
        );
      }

      response = await modelWithTools.invoke(messages, {
        configurable: { userId },
      });
    }

    // extract greeting message
    let greeting = "";

    if (typeof response.content === "string") {
      greeting = response.content;
    } else if (Array.isArray(response.content)) {
      greeting = response.content.map((item) => item.text || "").join(" ");
    }

    console.log("[CHAT API](Greeting) Greeting generated successfully");

    res.json({
      message: greeting,
    });
  } catch (error) {
    console.error(`[CHAT API](Greeting) Server error:`, error);

    return res.status(500).json({
      error: "[CHAT API](Greeting) Failed to process request",
      details: error.message,
    });
  }
};

// export the functions that are going to be use for AI assistant
module.exports = { chat, greetingMessage };
