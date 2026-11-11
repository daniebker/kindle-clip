const { OpenAI } = require("openai");
const { generatePrompt } = require("../ai/prompts")

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
    const completion = await client.completions.create({
      model: "text-curie-001",
      prompt: generatePrompt(text),
      temperature: 0.6,
    });
    return completion.choices[0].text
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
