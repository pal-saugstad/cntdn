# Countdown Solver

In the 'Countdown game show' (found on Youtube.com),
the participants tries to solve puzzles based on letters or numbers.

This repository implements two puzzle solvers, one for the Numbers puzzle
and one for the Letters puzzle.

## Numbers solver

All possible calculations from the input numbers (1 to 6 values) are
tested. All calculations matching the target value are show.
If no solution is found, the solution(s) closest to the target are shown.
```
Example:

  If the input in the field of the first line is '1 2 3 4 20'

  Input: 1, 2, 3, 4 - Target: 20

  Found 2 equations

  (3 + 2) * 4         =  5 * 4  =  20
  (3 * 2 - 1) * 4     =  (6 - 1) * 4  =  5 * 4  =  20
```
The solutions are shown as equations which are solved one by one term.

## Letters solver

A dictionary is used to match the input letters into words.
The input can be a random sequence of letters with or without spaces
(inserted into the field in the first line).
If there are more than 9 letters, only the first 9 letters will be used.
```
Example:
  
  If the input in the field of the first line is 'bcde'

  Found 3 words from the 4 letters input

  1    2    3      4
      be   bed
           deb
```

The words are shown in columns based on how many letters the words contain.

## Conundrum

Conundrum is a special case of Letters puzzles.
A 7, 8 or 9 letter random word is found which can be split into two words.
(3+4, 4+4 or 4+5 lengths). Those two words represents the puzzle.
In some cases, more than one word can be a correct answer to the puzzle.
If so, both (all) are shown when pressing the 'Show answers' button.
In addition, a list of 40 puzzles can be generated.

## Online version 

Online version available at https://saugstad.net/countdown

## Original repository

This repository is forked from https://github.com/jes/cntdn

