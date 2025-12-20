if (typeof process !== 'undefined') {

  // set up and run vm with the required files
  const vm = require('vm');
  const fs = require('fs');

  const context = { console: { log: (...args) => { console.log(...args); } }, input_args: process.argv };
  vm.createContext(context);
  const me = process.argv[1];
  const code =
    fs.readFileSync('../dictionary.js', 'utf-8') +
    fs.readFileSync(me,                 'utf-8');
  vm.runInContext(code, context);

} else {

  // code to run in vm as the last "included" file (see readFileSync above)
  function* give_all_words() {
    function* _give(node, answer) {
      for (c in node) {
        if (c == 0) yield answer;
        else yield * _give(node[c], answer+c);
      }
    }
    while (true) yield * _give(dictionary, '');
  }

  const w = give_all_words();
  const first = w.next().value;
  let nw = ''
  while (nw != first) {
     nw = w.next().value
     console.log(nw);
  }
}
