const titleMessageHistory = [];
function generateTitlePrompt(text) {
  const message = [{
    role: "system",
    content: `Suggest a concise title for a text.

Text: Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less. Marie Skłodowska-Curie
Title: Nothing in life is to be feared
Text: biological clock is of no use unless it is set to local time. For most plants and animals, including us, the most important ‘entrainment’ signal that aligns the internal day to the external world is light, especially the changes in light around sunrise and sunset.
Title: Light is the most important entrainment signal
Text: In our population, if all were affected equally by the change in the food environment, then a similar scenario would occur to the Swiss villagers.
Title: Not all environmental changes are equal
`,
  }, { role: "user", content: text }];
  titleMessageHistory.push(...message);
  return titleMessageHistory;
}

const titleAndTags = [];
function generateTitleAndTagsPrompt(text) {
  const message = [{
    role: "system",
    content:
      `Suggest tags and a title for a text. Tags should not contain spaces in the tag, each tag should be separated by a comma. Once the titles and tags have been generated I will ask you to create a summary of the text.

Text: Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less. Marie Skłodowska-Curie
Tags: NoFear,UnderstandingEmotion,Fearless
Title: Nothing in life is to be feared
Text: The results may come as a surprise to many. The study found that there was around a 75 per cent consistency in the level of obesity (BMI) between identical twins when they became adults, despite their lifelong separation. She found that there was only a 10 per cent consistency in BMI as a result of the home environment.
Tags: DifferencesInIdenticalTwins,ConsistencyInBMI
Title: The Surprising Influence of Genetics on Obesity
Text: In our population, if all were affected equally by the change in the food environment, then a similar scenario would occur to the Swiss villagers.
Tags: EnvironmentalEquality
Title: Not all environmental changes are equal
Text: ${text}
Tags:
Title:`,
  }, { role: "user", content: text }];
  // titleAndTags.push(...message);
  return message;
}
const tagMessageHistory = [];
function generateTagsPrompt(text) {
  const message = [{
    role: "system",
    content:
      `Suggest tags for a text. Tags should not contain spaces in the tag, each tag should be separated by a comma

Text: Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less. Marie Skłodowska-Curie
Tags: NoFear,UnderstandingEmotion,Fearless
Text: The results may come as a surprise to many. The study found that there was around a 75 per cent consistency in the level of obesity (BMI) between identical twins when they became adults, despite their lifelong separation. She found that there was only a 10 per cent consistency in BMI as a result of the home environment.
Tags: DifferencesInIdenticalTwins,ConsistencyInBMI
Text: In our population, if all were affected equally by the change in the food environment, then a similar scenario would occur to the Swiss villagers.
Tags: EnvironmentalEquality
Text: ${text}
Tags:`,
  }, { role: "user", content: text }];
  tagMessageHistory.push(...message);
  return tagMessageHistory;
}
function generateSummaryPrompt() {
  const message = [{
    role: "user",
    content: `Now create a summary of the book in the chat history`,
  }];
  titleAndTags.push(...message);
  console.log(titleAndTags);
  return titleAndTags;
}

function clearHistory() {
  titleMessageHistory.length = 0;
  tagMessageHistory.length = 0;
}

module.exports = {
  generateTitlePrompt,
  generateTagsPrompt,
  generateTitleAndTagsPrompt,
  generateSummaryPrompt,
  clearHistory,
};
