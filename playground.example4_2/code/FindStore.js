module.exports.function = function findStore (location) {
  const fakeData = require("./data/StoreData.js");
  const console = require("console");

  let storeinfo = null;
  for(let i = 0; i < fakeData.length; i++){
    if(fakeData[i].location == String(location)){
      storeinfo = fakeData[i];
      break;
    }
  }
  console.log(storeinfo)
  return storeinfo;
}
