function shuffle(a) {
    var n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
}

function str_shuffle(s) {
    var a = s.split("");
    shuffle(a);
    return a.join("");
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
    } else if (field == 'suggest') {
        checksolution();
    }
}

function gennumbers(large) {
    clean();
    is_numbers = true;

    var largenums = [25, 50, 75, 100];
    var smallnums = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10];

    shuffle(largenums);
    shuffle(smallnums);

    let number_str = '';

    for (let i = 0; i < 6; i++)
        number_str += ` ${i < large ? largenums[i] : smallnums[i-large]}`;

    number_str += ` ${Math.floor(Math.random() * (899)) + 101}`;
    document.getElementById("seed").value = number_str;
    pretty_print();
}

function addletter(vowels) {
    clean();
    console.log(vowels);
    const basevowels = "AAAAAAAAAAAAAAAEEEEEEEEEEEEEEEEEEEEEIIIIIIIIIIIIIOOOOOOOOOOOOOUUUUU";
    const basecons = "BBCCCDDDDDDFFGGGHHJKLLLLLMMMMNNNNNNNNPPPPQRRRRRRRRRSSSSSSSSSTTTTTTTTTVWXYZ";
    reset();
    is_numbers = false;
    let letters = str_shuffle(str_shuffle(basevowels).substring(0, vowels) + str_shuffle(basecons).substring(vowels, 9));
    document.getElementById("seed").value = letters;
    pretty_print();
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
            "\nUse numbers OR letters please, not both at the same time";
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
        let inputs = inputs_arr.slice();
        let target = inputs.pop();
        res = solve_numbers(inputs, target);
    } else {
        res = solve_letters_matrix(inputs_str);
    }
    document.getElementById("answer").innerHTML = res;
}

function showanswer() {
  if (pretty_print("Calculating ...")) setTimeout(showcore, 0);
}

function checksolution() {
    const input_line = document.getElementById("suggest").value;
    if (input_line == '') return;
    let errors = '';
    if (is_numbers) {
      let inputs = inputs_arr.slice();
      let target = parseInt(inputs.pop());
      console.log(`INPUTS ${inputs} target ${target}`);
      answer_from_calc = calculate_formula(inputs, input_line);
      if (isNaN(answer_from_calc)) {
        document.getElementById("check-suggestion").innerHTML =
            answer_from_calc;
      } else {
        diff = target - answer_from_calc;
        if (diff) {
          if (diff < 0) diff = -diff;
          document.getElementById("check-suggestion").innerHTML = 
             answer_from_calc + ' is ' + diff + ' off from target';
        } else {
          document.getElementById("check-suggestion").innerHTML = 
              answer_from_calc + ' is correct, well done!';
        }
      }
    } else {
      if (!sufficient_letters(input_line.toLowerCase(), inputs_str.toLowerCase()))
          errors += "Wrong letters. "; /* TODO: be more specific */
      if (!word_in_dictionary(input_line.toLowerCase()))
          errors += "Word not in dictionary.";

      if (errors.length > 0) {
        document.getElementById("check-suggestion").innerHTML = errors;
      } else {
        document.getElementById("check-suggestion").innerHTML = 'Nice word!';
      }
    }
}
