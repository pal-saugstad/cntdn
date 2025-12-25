  const fs = require('fs');

  const me = process.argv[1];
  const path = me.substring(0, me.lastIndexOf('/'));
  eval(fs.readFileSync(path + '/../dictionary.js',  'utf-8') + `

  // continue eval
  function* give_words(size) {
    function* _give(node, answer) {
      if (answer.length < size) {
        for (c in node) yield * _give(node[c], answer+c);
      } else if (node[0]) {
        yield answer;
      }
    }
    while (true) yield * _give(dictionary, '');
  }
  // end eval`);
  
  function word_stats() {

    let count = [0];
    let fast = ['{}'];
    for (let i = 1; i <= 9; i++) {
      const sslen = 2;
      const words = give_words(i);
      const first = words.next(0).value;
      let cnt = 0;
      let firstcnt = 0;
      let relcnt = 0;
      let another;
      let start = first.substring(0,sslen);
      let firstletter = first.substring(0,1);
      //console.log(i + ' ' + relcnt + ' ' + cnt + ' ' + start + ' ' + first);
      let inside = {};
      let inside2 = {};
      do {
        cnt++;
        firstcnt++;
        relcnt++;
        another = words.next(0).value;
        if (another.substring(0,sslen) != start) {
          inside2[start] = relcnt;
          start = another.substring(0,sslen);
          //console.log(i + ' ' + relcnt + ' ' + cnt + ' ' + start + ' ' + another);
          relcnt= 0;
          if (another.substring(0,1) != firstletter) {
            if (firstcnt < 100)            inside[firstletter] = firstcnt;
            else for (let ltrs in inside2) inside[ltrs] = inside2[ltrs];
            firstletter = another.substring(0,1);
            inside2 = {};
            firstcnt = 0;
          }
        }
        //console.log(another);
      } while (first != another);
      //console.log("For words with " + i + " letters, we found " + cnt);
      count.push(cnt);
      fast.push('{'+Object.keys(inside).map((key) => [key, inside[key]].join(':')).join(',')+'}');
    }
    console.log("const dictionary_word_lengths = [" + count.join(',') + "];");
    console.log("const dictionary_word_fast = [" + fast.join(',') + "];");
  }

  if (process.argv[2]) {
    console.log("Generate dictionary statistics");
    console.log("Start without input parameter and redisect output to a file");
  } else {
    word_stats();
  }
