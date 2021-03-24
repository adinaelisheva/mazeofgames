let leftBank, rightBank, boatContainer, boat, error, history;
let boatFullness = 0;
let tripsLeft = 5;

const personSize = {
  Kab: 1,
  Mab: 1,
  Nab: 1,
  Qab: 1,
  Xab: 1,
  Zab: 1,
  Cherrystone: 6,
  Rover: 3,
  Aggado: 3,
  Dunodi: 3,
  Lunodi: 3,
  Girdlog: 6
};

const pilots = ['Rover', 'Dunodi', 'Lunodi', 'Girdlog'];
const lilliputians = ['Kab','Mab','Nab','Qab','Xab','Zab'];

function setup() {
  leftBank = document.querySelector('.left');
  rightBank = document.querySelector('.right');
  boatContainer = document.querySelector('.boatContainer');
  boat = document.querySelector('.boat');
  error = document.querySelector('.error');
  history = document.querySelector('.history');
  tripCount = document.querySelector('.tripCount');
  document.querySelector('.sendBoat').addEventListener('click', () => {
    clearError();
    moveBoat();
  });
  document.querySelector('.emptyBoat').addEventListener('click', () => {
    clearError();
    emptyBoat();
  });
  document.querySelectorAll('.person').forEach((el) => {
    el.addEventListener('click', () => {
      clearError();
      movePerson(el);
    });
  });
}

function emptyBoat() {
  boatFullness = 0;
  const people = boat.querySelectorAll('.person');
  const bank = boatContainer.classList.contains('isLeft') ? leftBank : rightBank;
  for (let person of people) {
    bank.appendChild(person);
  }
}

function boatHasPilot() {
  let lilliputianCount = 0;
  const people = boat.querySelectorAll('.person');
  for (let person of people) {
    if (lilliputians.indexOf(person.innerText) > -1) {
      lilliputianCount++;
    }
    if (pilots.indexOf(person.innerText) > -1) {
      return true;
    }
  }
  return lilliputianCount >= 6;
}

function movePerson(el) {
  const currentLocation = el.parentElement;
  const isBoatLeft = boatContainer.classList.contains('isLeft');
  let size = personSize[el.innerText];
  if (currentLocation.classList.contains('boat')) {
    if (isBoatLeft) {
      leftBank.appendChild(el);
    } else {
      rightBank.appendChild(el);
    }
    boatFullness -= size;
  } else if ((currentLocation.classList.contains('left') && isBoatLeft) ||
      (currentLocation.classList.contains('right') && !isBoatLeft)) {
    if (boatFullness + size <= 9) {
      boat.appendChild(el);
      boatFullness += size;
    } else {
      error.innerText = "Not enough room in the boat";
    }
    
  }
}

function moveBoat() {
  if (tripsLeft === 0) {
    return;
  }
  if (!boatHasPilot()) {
    error.innerText = "Boat has no pilot";
    return;
  }
  if (!verifyBoat() || !verifyBank()) {
    return;
  }
  if (boatContainer.classList.contains('isLeft')) {
    tripsLeft--;
    tripCount.innerText = tripsLeft;
    insertHistoryRow(false);
    boatContainer.classList.add('isRight');
    boatContainer.classList.remove('isLeft');
  } else {
    insertHistoryRow(true);
    boatContainer.classList.add('isLeft');
    boatContainer.classList.remove('isRight');
  }
}

function insertHistoryRow(isLeft) {
  const leftPeople = getNamesList(leftBank);
  const boatPeople = getNamesList(boat);
  const rightPeople = getNamesList(rightBank);

  const arrow = isLeft ? '<---' : '--->';

  const historyDiv = document.createElement('div');
  historyDiv.classList.add('row');
  historyDiv.appendChild(makeDivWithPeople(leftPeople, 'left'));
  historyDiv.appendChild(makeBlankHistoryDiv(arrow));
  historyDiv.appendChild(makeDivWithPeople(boatPeople, 'middle'));
  historyDiv.appendChild(makeBlankHistoryDiv(arrow));
  historyDiv.appendChild(makeDivWithPeople(rightPeople, 'right'));

  history.appendChild(historyDiv);
}

function makeBlankHistoryDiv(text) {
  const div = document.createElement('div');
  div.classList.add('arrowContainer');
  div.innerText = text;
  return div;
}

function makeDivWithPeople(list, className) {
  const div = document.createElement('div');
  div.classList.add(className);
  div.classList.add('peopleList');
  for (let person of list) {
    const personDiv = document.createElement('div');
    personDiv.innerHTML = person;
    personDiv.classList.add('person');
    div.appendChild(personDiv);
  }
  return div;
}

function getNamesList(location) {
  const people = location.querySelectorAll('.person');
  const ret = [];
  for (let person of people) {
    ret.push(person.innerText);
  }
  return ret;
}

function verifyBoat() {
  const people = getNamesList(boat);
  if (people.indexOf('Cherrystone') > -1 && people.indexOf('Rover') === -1) {
    error.innerText = "Cherrystone won't travel without Rover";
    return false;
  }
  const cherrystoneOnRightBank = !!rightBank.querySelector('.cherrystone');
  if (people.indexOf('Rover') > -1 && people.indexOf('Cherrystone') === -1 && !cherrystoneOnRightBank) {
    error.innerText = "Cherrystone won't let Rover travel alone yet";
    return false;
  }
  if (people.indexOf('Aggado') > -1 && !cherrystoneOnRightBank) {
    error.innerText = "Cherrystone won't let Aggado cross until he does";
    return false;
  }

  let hasBalnibarbian = false;
  let hasNonBalnibarbian = false;
  for (let person of people) {
    if (person === 'Dunodi' || person === 'Lunodi') {
      hasBalnibarbian = true;
    } else if (person !== 'Aggado') {
      hasNonBalnibarbian = true;
    }
  }
  const aggadoOnRightBank = !!rightBank.querySelector('.aggado');
  if (people.indexOf('Aggado') === -1 && hasBalnibarbian && !aggadoOnRightBank) {
    error.innerText = "Aggado won't let a Balnibarbian travel til he is safe";
    return false;
  }
  if (people.indexOf('Aggado') > -1 && !(hasBalnibarbian && hasNonBalnibarbian)) {
    error.innerText = "Aggado won't travel without a Balnibarbian and a non-Balnibarbian";
    return false;
  }
  return verifyBankOrBoat(boat);
}

function verifyBank() {
  const bank = boatContainer.classList.contains('isLeft') ? leftBank : rightBank;
  const people = getNamesList(bank);
  if (people.length === 1 && people[0] === 'Rover') {
    error.innerText = "Rover cannot be left alone on the shore";
    return false;
  }
  return verifyBankOrBoat(bank);
}

function verifyBankOrBoat(location) {
  const people = getNamesList(location);
  let hasEnemy = false;
  let hasLilliputian = false;
  let hasNonLilliputian = false;
  let hasBrobVictim = false
  for (let person of people) {
    if (person === 'Girdlog' || person === 'Rover') {
      hasEnemy = true;
    } else if (person === 'Cherrystone' ||
        person === 'Aggado' ||
        lilliputians.indexOf(person) > -1) {
      hasBrobVictim = true;
    }
    hasLilliputian = hasLilliputian || lilliputians.indexOf(person) > -1;
    hasNonLilliputian = hasNonLilliputian || lilliputians.indexOf(person) === -1;
  }
  if (hasEnemy && !hasNonLilliputian) {
    error.innerText = "The Lilliputians will be killed!";
    return false;
  }

  if (people.length > 1 &&
      people.indexOf('Rover') > -1 && 
      people.indexOf('Cherrystone') === -1 && 
      people.indexOf('Girdlog') === -1) {
    error.innerText = "Rover will attack!";
    return false;
  }

  const hasBalnibarbian = people.indexOf('Dunodi') > -1 || people.indexOf('Lunodi') > -1;
  if (people.length === 2 && hasBalnibarbian && people.indexOf('Aggado') > -1) {
    error.innerText = "Aggado will be killed!";
    return false;
  }

  if (!hasBalnibarbian && hasBrobVictim && people.indexOf('Girdlog') > -1) {
    error.innerText = "Girdlog will attack!";
    return false;
  }

  return true;
}

function clearError() {
  error.innerText = "";
}

window.onload = setup;