if (typeof process  !== 'undefined') {

  // set up and run vm with the required files
  const vm = require('vm');
  const fs = require('fs');

  const context = { console: { log: (...args) => { console.log(...args); } }, input_args: process.argv };
  vm.createContext(context);
  const me = process.argv[1];
  const path = me.substring(0, me.lastIndexOf('/', me.lastIndexOf('/') - 1));
  const code =
    fs.readFileSync(path + '/dictionary.js',  'utf-8') +
    fs.readFileSync(path + '/letters.js',     'utf-8') +
    fs.readFileSync(me, 'utf-8');
  vm.runInContext(code, context);

} else {

  // code to run in vm as the last "included" file (see readFileSync above)
  if (input_args[2]) {
    let letters = input_args[2].toLowerCase().substring(0,9);
    console.log(`Solve Letters for input ${letters}`);
    console.log(solve_letters_matrix(letters));
  } else {
    console.log("Give me some letters");
  }

}
