/* Javascript version of cntdn
 *
 * Countdown game solver
 *
 * James Stanley 2014
 */

// First part of original cntdn.js file

function _recurse_solve_letters(letters, node, used_letter, cb, answer) {
    if (node[0])
        cb(answer, node[0]);

    if (answer.length == letters.length)
        return;

    var done = {};

    for (var i = 0; i < letters.length; i++) {
        var c = letters.charAt(i);

        if (used_letter[i] || done[c])
            continue;

        if (node[c]) {
            used_letter[i] = true;
            done[c] = true;
            _recurse_solve_letters(letters, node[c], used_letter, cb, answer+c);
            used_letter[i] = false;
        }
    }
}

function solve_letters(letters, cb) {
    _recurse_solve_letters(letters, dictionary, {}, cb, '');
}

function sufficient_letters(word, letters) {
    var count = {};

    for (var i = 0; i < letters.length; i++) {
        if (!count[letters.charAt(i)])
            count[letters.charAt(i)] = 0;
        count[letters.charAt(i)]++;
    }

    for (var i = 0; i < word.length; i++) {
        if (!count[word.charAt(i)])
            return false;
        count[word.charAt(i)]--;
        if (count[word.charAt(i)] < 0)
            return false;
    }

    return true;
}

function word_in_dictionary(word) {
    var node = dictionary;
    var idx = 0;

    while (idx < word.length) {
        node = node[word.charAt(idx)];
        idx++;
        if (!node)
            return false;
    }

    if (!node[0])
        return false;
    return true;
}

function solve_letters_matrix(letters) {

  let result = [];
  let res = [];
  const noof = letters.length;
  solve_letters(letters.toLowerCase(), function(word) { result.push(word); });

  result.sort();

  let out_matrix = [[],[],[],[],[],[],[],[],[],[]];
  let no_of_words = [0,0,0,0,0 ,0,0,0,0,0];
  let max_word_length = 0;
  for (value of result) {
    no_of_words[value.length] += 1;
    out_matrix[value.length].push(value);
  }
  for (i = 9; i > 0; i--) {
    if (no_of_words[i] > 0) {
      max_word_length = i;
      break;
    }
  }

  const spaces = '                                                                 ';

  const letters_warn = noof != 9 ? ` from the ${noof} letters input`: '';
  let stats_best = `Found ${result.length} words of which ${no_of_words[max_word_length]}`
        + ` words have ${max_word_length} letters${letters_warn}\n\n`;
  delim = '';
  for (let i=0; i<noof;) {
    i++;
    stats_best += `${delim}${i}`;
    if (delim == '') delim += '  ';
    if (i & 1) delim += '  ';
  }
  res.push(stats_best);
  let row = 'init';
  for (i = 0; row.length > 0; i++) {
    row = '';
    let blanks = 0;
    for (j = 1; j <= 9; j++) {
      if (out_matrix[j].length > i) {
        row += spaces.substring(0,blanks) + out_matrix[j][i];
        blanks = 3;
      } else {
        blanks += j + 3;
      }
    }
    res.push(row);
  }
  return res.join('\n');
}
