const { OpenAI } = require("openai");
const { generatePrompt } = require("../ai/prompts")

const DEFAULT_MODEL = "gpt-6-luna";

let openai;

function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured, please follow instructions in README.md")
  }
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

async function generateTitleFor(text) {
  const client = getClient();

  if (!text) {
    throw new Error("Text is undefined")
  }

  try {
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
      messages: [{ role: "user", content: generatePrompt(text) }],
      // Title generation is a simple task: skip reasoning to keep it fast and cheap.
      reasoning_effort: "none",
    });
    return (completion.choices[0].message.content || "").trim()
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(error.status, error.message);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
    throw error
  }
}

module.exports = {
  generateTitleFor
}
