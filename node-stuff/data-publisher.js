const { format, parse } = require("lua-json");
const fs = require('fs');

function log(str) {
  console.log('DataPublisher:',str);
}

function lvar(){
  let args = Array.prototype.slice.apply(arguments);
  let [label] = args;
  console.log(label,':');
  console.log.apply(console, args.slice(1));
  console.log();
}

function convertToJS(pathIn, pathOut) {
  if (!pathIn) {
    log('No input file given. Bailing.');
    return;
  }
  if (!pathOut) {
    log('No output file given. Bailing.');
    return;
  }
  lvar('reading',pathIn);
  let luaString = fs.readFileSync(pathIn)
    .toString('utf8')
    .trim()
    .replace('BtgBank = ','return ');
  lvar('luaString',luaString);
  let parsed = 'window.Grin = window.Grin || {}; window.Grin.bankData = ' + JSON.stringify(parse(luaString)) + ';';
  lvar('parsed',parsed);
  fs.truncate(pathOut, 0, function() {
    fs.writeFile(pathOut, parsed, function (err) {
      if (err) {
        return console.log("Error writing file: " + err);
      }
      console.log('successfully wrote file to',pathOut);
    });
  });
}

convertToJS(__dirname + '/test2.lua', '/Users/cburton/Dropbox/BTG/grinbankdata.js');