// import the module responsible for AI calls
const { GoogleGenerativeAI } = require("@google/generative-ai");

// import the 'dotenv' module to be able to read API key
require("dotenv").config();

// get the required information from the `.env` file
const apiKey = process.env.GEMINI_API_KEY;
const ai_model = process.env.GEMINI_MODEL;
const temperature = process.env.GEMINI_TEMPERATURE;
const prompt = process.env.GEMINI_SYSTEM_PROMPT;

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
      systemInstruction: prompt,
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
    const result = await chat.sendMessage(message);
    const response = result.response;
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
