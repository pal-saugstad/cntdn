  const fs = require('fs');

  const me = process.argv[1];
  const path = me.substring(0, me.lastIndexOf('/'));
  eval(
    fs.readFileSync(path + '/../dictionary.js',  'utf-8') +
    fs.readFileSync(path + '/../dictionary-stats.js','utf-8') +
    fs.readFileSync(path + '/../letters.js',     'utf-8') +
    fs.readFileSync(path + '/../conundrum.js',   'utf-8'));

  let start = new Date().getTime();
  let times = 1;
  let len = 9;
  let help = false;
  if (process.argv[2]) {
    times = process.argv[2];
    if (isNaN(times)) help = true;
  }
  if (process.argv[3]) {
    len = process.argv[3];
    if (isNaN(len)) help = true;
    if (len < 5) len = 5;
    if (len > 9) len = 9;
  }
  if (help) console.log("Nothing to do, try no argument or #solutions conundrum_len");
  else {
    console.log(`Show ${times} conundrums of length ${len}.`);
    console.log(`The 'level' value indicates how big difference there is between`);
    console.log(`the Conundrum and the solution.`);
    console.log(`The higest (hardest) value corresponds to the Conundrum length`);
    console.log(`The columns are:`);
    console.log('   Conundrum, Solution, level');
    for (let i = 0; i < times; i++) console.log(generate_conundrum(len));
    let stop = new Date().getTime();
    let duration_per_iteration = (stop - start) / times;
    console.log('Duration: ' + (stop - start) + ' ms, ' + duration_per_iteration.toFixed(1) + ' ms per iteration, ' + times + ' iterations');
  }
