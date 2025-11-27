const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// get the API key from environment variable
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY environment variable is not set");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function main() {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const result = await model.generateContent("Tell me a joke in one line");
  const response = await result.response;

  console.log("Full response:", response);
  console.log();
  console.log("Text content:", response.text());
}

main().catch(console.error);
