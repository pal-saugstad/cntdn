
function random_word(size) {
  let skip = Math.floor(Math.random() * dictionary_word_lengths[size]);
  let res = '';
  let start = '';
  function _next(node, answer) {
    if (res) return;
    if (answer.length < size) {
      for (c in node) _next(node[c], answer+c);
    } else if (node[0]) {
      if (skip > 0) {
        skip--;
      } else {
        res = answer;
        return;
      }
    }
  }
  let fast = dictionary_word_fast[size];
  let tot = 0;
  let use = 0;
  for (const i in fast) {
    start = i;
    use = tot;
    tot += fast[i];
    if (tot > skip) break;
  }
  skip -= use;
  let start_node = dictionary;
  for (let idx = 0; idx < start.length; idx++) start_node = start_node[start.substring(idx,idx+1)];
  _next(start_node, start);
  return res;
  //console.log(fast);
}

function generate_conundrum(len9 = 9) {
  len4 = len9 >> 1;
  len5 = len9 - len4;
  let countout = 0;
  while (countout < 1000) {
    countout++;
    const letters = random_word(len9);
    const five = [];

    let nines = [];
    solve_letters(letters, function(word) {
      if (word.length == len5) five.splice((five.length+1) * Math.random() | 0, 0, word);
      else if (word.length == len9 && word != letters) nines.push(word);
    });
//    console.log("---------- " + letters + " --------------------");
    for (const five_word of five) {
      let four_sorted = letters;
      for (let c of five_word) four_sorted = four_sorted.replace(c,'');
      let four_solve = [];
      solve_letters(four_sorted, function(word) {
        if (word.length == len4) four_solve.splice((four_solve.length+1) * Math.random() | 0, 0, word);
      });
      for (const four_word of four_solve) {
        const score1 = levenshtein(four_word + five_word, letters) + Math.random();
        const score2 = levenshtein(five_word + four_word, letters) + Math.random();
//        console.log('scores:', four_word + five_word, score1, five_word + four_word, score2);
        if (score1 > len4 && score2 > len4) {
          if (score1 > score2) return [four_word + five_word, letters, score1 | 0, nines];
          return [five_word + four_word, letters, score2 | 0, nines];
        }
      }
    }
  }
  return ["undefined", "undefined", 0, []];
}

/*
The Levenshtein distance function is:
Copyright (c) 2011 Andrei Mackenzie
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// Compute the edit distance between the two given strings
function levenshtein(a,b) {
  if(a.length == 0) return b.length;
  if(b.length == 0) return a.length;

  var matrix = [];

  // increment along the first column of each row
  var i;
  for(i = 0; i <= b.length; i++){
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for(j = 0; j <= a.length; j++){
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                Math.min(matrix[i][j-1] + 1, // insertion
                                         matrix[i-1][j] + 1)); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
}

