const { Configuration, OpenAIApi } = require("openai");
const { generatePrompt } = require("../ai/prompts")

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateTitleFor(text) {
  if (!configuration.apiKey) {
    throw new Error("OpenAI API key not configured, please follow instructions in README.md")
  }

  if (!text) {
    throw new Error("Text is undefined", text)
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(text),
      temperature: 0.6,
    });
    console.log("response", completion.data.choices[0].text)
    return completion.data.choices[0].text
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
      throw new Error(error.response.status, JSON.stringify(error.response.data))
    } else {
      const message = `Error with OpenAI API request: ${error.message}`
      console.error(message);
      throw error
    }
  }
}

module.exports = {
  generateTitleFor
}
