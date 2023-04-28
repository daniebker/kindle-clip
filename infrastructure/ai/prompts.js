function generatePrompt(text) {
  return `Suggest a concise title for a text.

Text: Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less. Marie Skłodowska-Curie
Title: Nothing in life is to be feared
Text: biological clock is of no use unless it is set to local time. For most plants and animals, including us, the most important ‘entrainment’ signal that aligns the internal day to the external world is light, especially the changes in light around sunrise and sunset.
Title: Light is the most important entrainment signal
Text: In our population, if all were affected equally by the change in the food environment, then a similar scenario would occur to the Swiss villagers.
Title: Not all environmental changes are equal
Text: ${text}
Title:`;
}

module.exports = {
  generatePrompt
}
