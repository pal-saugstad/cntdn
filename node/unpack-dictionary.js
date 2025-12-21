  const fs = require('fs');

  const me = process.argv[1];
  const path = me.substring(0, me.lastIndexOf('/'));

  eval(fs.readFileSync(path + '/../dictionary.js', 'utf-8'));

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
  let nw = '';
  while (nw != first) {
      nw = w.next().value;
      console.log(nw);
  }
