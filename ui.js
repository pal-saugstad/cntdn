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
let is_letters = false;
let is_conudrum = false;
let conundrum_len = 0;
let conundrum_result = [];
let conundrum_clue = '';

function focusout(e) {
  ret_button(e.id);
}

function keydown(e, from) {
  if (e.key === 'Enter') ret_button(from);
  else if (from === 'suggest')
    document.getElementById("check-suggestion").innerHTML = '&nbsp;';
}

document.getElementById("seed").onfocus=function() {
  reset_conundrum();
};

function ret_button(field) {
    console.log(`You entered ${field}`);
    if (field == 'seed') {
        reset_conundrum();
        pretty_print();
    } else if (field == 'suggest') {
        checksolution();
    }
}

function gennumbers(large) {

    var largenums = [25, 50, 75, 100];
    var smallnums = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10];

    shuffle(largenums);
    shuffle(smallnums);

    let number_str = '';

    reset_conundrum();
    for (let i = 0; i < 6; i++)
        number_str += ` ${i < large ? largenums[i] : smallnums[i-large]}`;

    number_str += ` ${Math.floor(Math.random() * (899)) + 101}`;
    document.getElementById("seed").value = number_str;
    pretty_print();
}

function addletter(vowels) {
    reset_conundrum();
    console.log(vowels);
    const basevowels = "AAAAAAEEEEEEEEIIIIIOOOOOUUU";
    const basecons = "BBCCCDDDDDDFFGGGHHJKLLLLLMMMMNNNNNNNNPPPPQRRRRRRRRRSSSSSSSSSTTTTTTTTTVWXYZ";
    let letters = str_shuffle(str_shuffle(basevowels).substring(0, vowels) + str_shuffle(basecons).substring(vowels, 9));
    document.getElementById("seed").value = letters;
    pretty_print();
}

function conundrum(len) {
    is_conundrum = true;
    conundrum_len = len;
    document.getElementById("conundrum-clue").disabled = false;
    document.getElementById("show-answers-button").innerHTML = 'Conundrum list';
    document.getElementById("show-answers-button").setAttribute('title', `${conundrum_len} letter Conundrums: Show list of 40 puzzles`);
    conundrum_result  = generate_conundrum(len);
    conundrum_clue = [];
    document.getElementById("seed").value = conundrum_result[0];
    pretty_print();
}

function show_conundrum_clue() {
    reveal_idx = conundrum_clue.length;
    if (reveal_idx < conundrum_len) {
        conundrum_clue += conundrum_result[1].charAt(reveal_idx);
    }
    document.getElementById("suggest").value = conundrum_clue;
}

function reset_conundrum() {
    document.getElementById("conundrum-clue").disabled = true;
    is_conundrum = false;
    document.getElementById("show-answers-button").innerHTML = 'Show answers';
    document.getElementById("show-answers-button").setAttribute('title', "");
}

function reset(keep_conundrum) {
    document.getElementById("answer").innerHTML = '';
    document.getElementById("seed").value = '';
    document.getElementById("suggest").value = '';
    document.getElementById("check-suggestion").innerHTML = '&nbsp;'; 
    inputs_str = '';
    inputs_arr = [];
    is_letters = is_numbers = false;
    if (keep_conundrum) return;
    document.getElementById("conundrum-clue").disabled = true;
    reset_conundrum();
}

window.onload = (event) => {
  reset();
};

function pretty_print() {
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
        is_letters = is_numbers = false;
        reset_conundrum();
        return;
    }
    reset(true);
    is_numbers = numbs;
    is_letters = letts;
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
        is_letters = is_numbers = false;
        reset_conundrum();
        return;
      }
    number_str = '      ';
    for (let i = 0; i < inputs.length - 1; i++)
        number_str += `${inputs[i].toString().padStart(4)}`;
    number_str += `        | ${inputs[inputs.length - 1]} |`;
    document.getElementById("seed").value = number_str;
  } else {
      inputs_str = letts_str.substring(0, 9);
      console.log(`Letters! ${inputs_str}`)
    inputs = inputs_str.toUpperCase().split('');
    document.getElementById("seed").value = '           ' + inputs.join('  ');
  }
  inputs_arr = inputs;
  return;
}

function showcore() {
    let res = '';
    if (is_numbers) {
        let inputs = inputs_arr.slice();
        let target = inputs.pop();
        res = solve_numbers(inputs, target);
    } else if (is_conundrum) {
        for (let i = 0; i < 40; i++) {
          alt_text = conundrum_result[3].length ? ` ${conundrum_result[3].join(', ')}` : "";
          res += `${conundrum_result[0]} -> ${conundrum_result[1]} | ${conundrum_result[2]} |${alt_text}\n`;
          conundrum(conundrum_len);
        }
        res += `
- puzzle -> answer   | level | (Alternative answers)
  - where higher level indicates lower similarities between puzzle and answer
`;
    } else {
        res = solve_letters_matrix(inputs_str);
    }
    document.getElementById("answer").innerHTML = res;
}

function showanswer() {
  if (is_numbers || is_letters) {
    document.getElementById("answer").innerHTML = "Calculating ...";
    setTimeout(showcore, 0);
  }
}

function checksolution() {
    const input_line = document.getElementById("suggest").value.trim();
    if (input_line == '') return;
    const has_letters = input_line.match(/[a-z]/i) !== null;
    const has_numbers = input_line.match(/[0-9]/) !== null;
    if (has_numbers == has_letters) {
      document.getElementById("check-suggestion").innerHTML = "What is this?";
    } else if (has_numbers) {
      let inputs = inputs_arr.slice();
      let target = parseInt(inputs.pop());
      console.log(`INPUTS ${inputs} target ${target}`);
      let answer_from_calc = calculate_formula(is_numbers ? inputs : [], input_line);
      if (is_numbers) {
        if (!isNaN(answer_from_calc)) {
          diff = Math.abs(target - answer_from_calc);
          answer_from_calc += diff ?
             ' is ' + diff + ' off from target' : ' is correct, well done!';
        }
      }
      document.getElementById("check-suggestion").innerHTML = answer_from_calc;
    } else {
      let clean_input = input_line.toLowerCase().replace(/ /g,'');
      let txt = word_in_dictionary(clean_input)
        ? "" : "Word not in dictionary.";
      let [is_ok, notfound, notused] = sufficient_letters(clean_input, inputs_str.toLowerCase());
      if (is_letters && !is_ok)
          txt = `Letters not in input: '${notfound}'. ${txt}`; /* TODO: be more specific */
      if (!txt.length) txt = is_letters
         ? "Nice word" + (notused.length > 0 ? `, but try squeeze in some of these: '${notused}'` : "! You used all the letters!")
         : "Nice, the word is in the dictionary";
      document.getElementById("check-suggestion").innerHTML = txt;
    }
}
