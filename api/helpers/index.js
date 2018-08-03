module.exports.cHeaderText = (text) => {
  var texts = text.split("_");
  var returnString = "";
  
  texts.map(x=> returnString += x.substring(0, 1).toUpperCase()+x.substring(1, x.length)+" ");
  
  return  returnString;

}