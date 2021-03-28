/* A little anagram helper I initially wrote to help with 5 of spades (One Bad Apple).
 * I figure it's not really cheating as it doesn't actually tell me the answer or even
 * pick out English words. 
 */

if (process.argv.length < 3) {
  console.log('usage: node shuffle.js [TOSHUFFLE] [CONSTRAINTS...]');
  console.log('where: \n  - TOSHUFFLE is any string');
  console.log('  - CONSTRAINTS are any number of letter-index requirements such as S6 or A0');
  return;
}

let seen = {};
const constraints = [];
for (let i = 3; i < process.argv.length; i++) {
  let constraint = process.argv[i].split('');
  constraints.push([
    constraint[0],
    Number(constraint[1]),
  ]);
}

function printPermutation(curPerm, left) {
  if (left.length === 0) {
    if (!seen[curPerm]) {
      seen[curPerm] = true;
      let allowed = true;
      for (let constraint of constraints) {
        if (curPerm[constraint[1]] !== constraint[0]) {
          allowed = false;
          break;
        }
      }
      if (allowed) {
        console.log(curPerm);
      }
    }
    return;
  }
  for (let i = 0; i < left.length; i++) {
    let nextPerm = curPerm.slice();
    let nextLeft = left.slice();
    nextPerm += left[i];
    nextLeft = nextLeft.substring(0,i) + nextLeft.substring(i+1);
    printPermutation(nextPerm, nextLeft);
  }
}

printPermutation('', process.argv[2]);