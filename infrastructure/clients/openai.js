const { Configuration, OpenAIApi } = require("openai");
const {
  generateTitlePrompt,
  generateTagsPrompt,
  generateTitleAndTagsPrompt,
  generateSummaryPrompt,
} = require("../ai/prompts");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const guardParams = (text) => {
  if (!configuration.apiKey) {
    throw new Error(
      "OpenAI API key not configured, please follow instructions in README.md",
    );
  }

  if (!text) {
    throw new Error("Text is undefined", text);
  }
};

const functions = [
  {
    name: "writeTitleAndTags",
    description: "Write the title and tags for a text",
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "The title of the text",
        },
        tags: {
          type: "array",
          items: {
            type: "string",
          },
          description: "The tags for the text",
        },
      },
    },
  },
];
const getCompletion = async (
  prompt,
  temperature = 0.6,
  model = "gpt-3.5-turbo-0613",
) => {
  const completion = await openai.createChatCompletion({
    model,
    messages: prompt,
    functions,
    temperature: temperature,
  });
  if (completion.data.choices[0].message.function_call) {
    const parsed = JSON.parse(
      completion.data.choices[0].message.function_call.arguments,
    );
    console.log(parsed);
    return parsed;
  }
  return completion.data.choices[0].message.content;
};

const checkErrorState = (error) => {
  if (error.response) {
    console.error(error.response.status, error.response.data);
    throw new Error(error.response.status, JSON.stringify(error.response.data));
  } else {
    const message = `Error with OpenAI API request: ${error.message}`;
    console.error(message);
    throw error;
  }
};

async function generateTagsFor(text) {
  guardParams(text);
  try {
    const tags = await getCompletion(
      generateTagsPrompt(text),
      0.6,
    );
    return tags.split(",").map((tag) => tag.trim().replace(/\s/g, ""));
  } catch (error) {
    checkErrorState(error);
  }
}

async function generateTitleAndTagsFor(text) {
  guardParams(text);
  try {
    const titleNTages = await getCompletion(
      generateTitleAndTagsPrompt(text),
      0.6,
    );
    return titleNTages;
  } catch (error) {
    checkErrorState(error);
  }
}

async function getSummaryForBook() {
  try {
    const summary = await getCompletion(
      generateSummaryPrompt(),
      0.6,
    );
    return summary;
  } catch (error) {
    checkErrorState(error);
  }
}

async function generateTitleFor(text) {
  guardParams(text);
  try {
    return await getCompletion(generateTitlePrompt(text), 0.2);
  } catch (error) {
    checkErrorState(error);
  }
}

module.exports = {
  generateTitleFor,
  generateTagsFor,
  generateTitleAndTagsFor,
  getSummaryForBook,
};
