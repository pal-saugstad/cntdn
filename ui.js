function ui_solve_letters(letters) {

    var result = [];

    solve_letters(letters.toLowerCase(), function(word) { result.push([word]); });

    result.sort(function(a, b) {
        if (b[0].length != a[0].length)
            return b[0].length - a[0].length;
        else
            return b[1] - a[1];
    });
    return result.join('\n');
}

let inputs_arr = [];
let inputs_str = '';
let is_numbers = false;

function focusout(e) {
  ret_button(e.id);
}

function keydown(e, from) {
  if (e.key === 'Enter') ret_button(from);
  else if (from === 'suggest')
    document.getElementById("check-suggestion").innerHTML = '&nbsp;';
}

function ret_button(field) {
    console.log(`You entered ${field}`);
    if (field == 'seed') {
        pretty_print();
    }
}

function clean() {
    document.getElementById("answer").innerHTML = '';
    document.getElementById("seed").value = '';
    document.getElementById("suggest").value = '';
    document.getElementById("check-suggestion").innerHTML = '&nbsp;'; 
}

function reset() {
    clean();
    inputs_str = '';
    inputs_arr = [];
}

window.onload = (event) => {
  reset();
};

function pretty_print(answer_text = '') {
    document.getElementById("answer").innerHTML = answer_text; 
    document.getElementById("check-suggestion").innerHTML = '&nbsp;'; 
    let raw_num = [];
    let inputs = [];
    let istring = document.getElementById("seed").value.toLowerCase().trim();
    let numbs = false;
    let letts = false;
    let letts_str = '';
    for (i=0; i < istring.length; i++) {
      let char = istring.charAt(i);
      if (!isNaN(char) && char != ' ') {
        numbs = true;
      } else if (/^[a-z]$/i.test(char)) {
        letts = true;
        letts_str += char;
      }
    }
    if (letts == numbs) {
        if (numbs)
          document.getElementById("answer").innerHTML= "Wrong input format - '" + istring + "'" +
            "\nEither use numbers or letters, not both, please";
        return !numbs;
    }
    is_numbers = numbs;
    if (is_numbers) {
      raw_num = istring.trim().split(' ');
      inputs = [];
      var bad_input = false;
 
      for (let val of raw_num) {
        if (isNaN(val) || val.length == 0) continue;
        inputs.push(parseInt(val));
        if (val < 1) bad_input = true;
        if (inputs.length >= 7) break; 
      }
      if (inputs.length < 2) bad_input = true;
      console.log(inputs);

      if (bad_input) {
        document.getElementById("answer").innerHTML = "Wrong input format - '" + istring + "'" +
                         "\nFormat: 2 to 7 positive numbers where the latter is the target" +
                         "\nExample: '25 75 7 11 13 3 563'";
        return false;
      }
    } else {
      inputs_str = letts_str.substring(0, 9);
      console.log(`Letters! ${inputs_str}`)
    }
  if (is_numbers) {
    number_str = '      ';
    for (let i = 0; i < inputs.length - 1; i++)
        number_str += `${inputs[i].toString().padStart(4)}`;
    number_str += `        | ${inputs[inputs.length - 1]} |`;
    document.getElementById("seed").value = number_str; 
  } else {
    inputs = inputs_str.toUpperCase().split('');
    document.getElementById("seed").value = '           ' + inputs.join('  ');
  }
  inputs_arr = inputs;
  return true;
}

function showcore() {
    let res;
    if (is_numbers) {
        let target = inputs_arr.pop();
        res = solve_numbers(inputs_arr, target);
    } else {
        res = ui_solve_letters(inputs_str);
    }
    document.getElementById("answer").innerHTML = res;
}

function showanswer() {
  if (pretty_print("Calculating ...")) setTimeout(showcore, 0);
}
