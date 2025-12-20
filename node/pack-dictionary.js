const fs = require('fs');
const readline = require('readline');
let di = {};

const readlines_from_file = readline.createInterface({
  input: fs.createReadStream('dictionary'),
  crlfDelay: Infinity,
});

let max_length = 50;
if (process.argv[2]) max_length = parseInt(process.argv[2]);

readlines_from_file
 .on('line', (line) => {
  let w = line.trim();
  if (w.length > 0 && w.length <= max_length) {
    let node = di;
    for (c of w) {
      if (!(c in node)) node[c] = {};
      node = node[c];
    }
    node[0] = 1;
  }
})
 .on('close', () => {
    console.log(`const x={0:1,s:{0:1}}; const z={0:1}; const dictionary=${JSON
      .stringify(di)
      .replaceAll('"','')
      .replaceAll('{0:1,s:{0:1}}','x')
      .replaceAll('{0:1}','z')};`
    );
});
