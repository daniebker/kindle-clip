const registerHelpers = (handlebars) => {
  handlebars.registerHelper('join', function (arr, on) {
    return arr.join(on);
  });

  handlebars.registerHelper('sandwich', function (text, between) {
    return `${between}${text}${between}`;
  });
}

module.exports = {
  registerHelpers
}
