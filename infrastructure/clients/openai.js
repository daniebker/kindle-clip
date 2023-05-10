const { Configuration, OpenAIApi } = require("openai");
const { generateTitlePrompt, generateTagsPrompt } = require("../ai/prompts")

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const guardParams = (text) => {
  if (!configuration.apiKey) {
    throw new Error("OpenAI API key not configured, please follow instructions in README.md")
  }

  if (!text) {
    throw new Error("Text is undefined", text)
  }
}

const getCompletion = async (prompt, temperature = 0.6, model = "text-curie-001") => {
  const completion = await openai.createCompletion({
    model,
    prompt,
    temperature: temperature,
  });
  return completion.data.choices[0].text
}

const checkErrorState = (error) => {
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

async function generateTagsFor(text) {
  guardParams(text)
  try {
    const tags = await getCompletion(generateTagsPrompt(text), 0.6, "text-davinci-003")
    return tags.split(",").map(tag => tag.trim().replace(/\s/g, ''))
  } catch (error) {
    checkErrorState(error)
  }
}

async function generateTitleFor(text) {
  guardParams(text)
  try {
    return await getCompletion(generateTitlePrompt(text), 0.2)
  } catch (error) {
    checkErrorState(error)
  }
}

module.exports = {
  generateTitleFor,
  generateTagsFor
}
