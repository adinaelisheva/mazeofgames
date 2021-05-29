const bases = ['MUSICAL','MATURATE','CORRAL','LAMINATION','IMPOUND','REFINE','WATCHABLE','BROMINE','PARAGONS','RETRACTED','PUNGENT','STARVATION','MILESTONE','FACIES','PALES','BLUDGEON','BUGLES','SUMMONED','CANDLESTICKS','PLAQUE','SCALING','LANGUAGE','TENTATIVE','QUALITY','DECEMBER','SEQUIN'];
const divines = ['ACTRESSES','CAREER','CLATTERING','COMPENDIUM','EXTENDING','COUNTRIES','DISEASED','FEVERISH','CURARE','FINERY','ELECTRODE','GRADER','EXPLOSION','HARPER','MACRAME','MONETARY','PALAVERS','TERRITORIAL','VANISHED','MOTTLING','ORIGINATION','SNAPPER','SQUINTING','UNDEAD','STRIVING','DETESTER'];
const usedDivines = []; // add used ones to remove from consideration

function testBase(base, char = '_') {
  for (let divine of divines) {
    if (usedDivines.indexOf(divine) >= 0) {
      continue;
    }
    console.log(`\n\n${base} + ${divine}:`);
    for (let i = 2; i < base.length - 1; i++) {
      const bFront = base.substring(0, i);
      const bBack = base.substring(i);
      for (let j = 2; j < divine.length - 1; j++) {
        const dFront = divine.substring(0, j);
        const dBack = divine.substring(j);
        console.log(`${bFront}${dBack} / ${dFront}${char}${bBack}`);
      }
    }
  }
}

const index = Number(process.argv[2]);
let userBase = null;
if (process.argv[2] && isNaN(index)) {
  // 2nd arg is a word
  userBase = process.argv[2];
} else if (index) {
  userBase = bases[index];
} 
const char = process.argv[3] ? process.argv[3] : '_';
if (userBase) {
  testBase(userBase, char);
} else {
  // Test all bases
  for (let base of bases) {
    testBase(base, char);
  }
}
