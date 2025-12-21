  const fs = require('fs');

  const me = process.argv[1];
  const path = me.substring(0, me.lastIndexOf('/'));
  if (process.argv[2]) {
    eval(
      fs.readFileSync(path + '/../dictionary.js',  'utf-8') +
      fs.readFileSync(path + '/../letters.js',     'utf-8'));

    let letters = process.argv[2].toLowerCase().substring(0,9);
    console.log(`Solve Letters for input ${letters}`);
    console.log(solve_letters_matrix(letters));
  } else {
    console.log("Give me letters");
  }

