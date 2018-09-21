module.exports.cHeaderText = (text) => {
  var texts = text.split("_");
  var returnString = "";

  texts.map(x => returnString += x.substring(0, 1).toUpperCase() + x.substring(1, x.length) + " ");

  return returnString;

}

module.exports.stringToType = (text) => {
  if (isNumeric(text)) {
    return parseFloat(text);
  }

  if (isDate(text)) {
    return new Date(text);
  }
  
  return text;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isDate(value) {
  switch (typeof value) {
    case 'number':
      return true;
    case 'string':
      return !isNaN(Date.parse(value));
    case 'object':
      if (value instanceof Date) {
        return !isNaN(value.getTime());
      }
    default:
      return false;
  }
}