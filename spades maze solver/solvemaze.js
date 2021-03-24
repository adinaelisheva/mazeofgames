const paths = [5,1,2,9,3,1,1,5,5,3,6,1,2,1,3,7,1,4,5,1,4,1,5,8,11,1,6,3,5,4,6,2,1,2,3,3,9,4,6,5,4,1,4,5,2,26,5,1,4,3,1,3,2,6,11,8,2,12,24,6,6,11,6,1,4,7,3,10,2];
const crossings = [0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1,0,1,0,0,1,0,0,0];
const islands = {
  '7,15': 'A',
  '7,16': 'A',
  '19,10': 'A',
  '19,11': 'A',
  '25,19': '2',
  '25,20': '2',
  '3,4': '2',
  '3,5': '2',
  '10,2': '3',
  '10,3': '3',
  '21,11': '3',
  '21,12': '3',
  '3,18': '4',
  '4,18': '4',
  '15,19': '4',
  '16,19': '4',
  '17,4': '5',
  '18,4': '5',
  '20,18': '5',
  '21,18': '5',
  '5,6': '6',
  '5,7': '6',
  '6,18': '6',
  '6,19': '6',
  '23,16': '7',
  '24,16': '7',
  '1,20': '7',
  '2,20': '7',
  '10,10': '8',
  '10,11': '8',
  '9,21': '8',
  '9,22': '8',
  '9,13': '9',
  '9,14': '9',
  '13,18': '9',
  '13,19': '9',
  '16,2': '10',
  '17,2': '10',
  '19,25': '10',
  '20,25': '10',
  '11,5': 'J',
  '12,5': 'J',
  '20,20': 'J',
  '21,20': 'J',
  '22,23': 'Q',
  '22,24': 'Q',
  '11,7': 'Q',
  '11,8': 'Q',
}
const islandPartners = {
  // A
  '7,15': {x: 19, y: 10},
  '7,16': {x: 19, y: 11},
  '19,10': {x: 7, y: 15},
  '19,11': {x: 7, y: 16},
  // 2
  '25,19': {x: 3, y: 4},
  '25,20': {x: 3, y: 5},
  '3,4': {x: 25, y: 19},
  '3,5': {x: 25, y: 20},
  // 3
  '10,2' : {x: 21, y: 11},
  '10,3' : {x: 21, y: 12},
  '21,11' : {x: 10, y: 2},
  '21,12' : {x: 10, y: 3},
  // 4
  '3,18': {x: 15, y: 19},
  '4,18': {x: 16, y: 19},
  '15,19': {x: 3, y: 18},
  '16,19': {x: 4, y: 18},
  // 5
  '17,4': {x: 20, y: 18},
  '18,4': {x: 21, y: 18},
  '20,18': {x: 17, y: 4},
  '21,18': {x: 18, y: 4},
  // 6
  '5,6': {x: 6, y: 18},
  '5,7': {x: 6, y: 19},
  '6,18': {x: 5, y: 6},
  '6,19': {x: 5, y: 7},
  // 7
  '23,16': {x: 1, y: 20},
  '24,16': {x: 2, y: 20},
  '1,20': {x: 23, y: 16},
  '2,20': {x: 24, y: 16},
  // 8
  '10,10': {x: 9, y: 21},
  '10,11': {x: 9, y: 22},
  '9,21': {x: 10, y: 10},
  '9,22': {x: 10, y: 11},
  // 9
  '9,13': {x: 13, y: 18},
  '9,14': {x: 13, y: 19},
  '13,18': {x: 9, y: 13},
  '13,19': {x: 9, y: 14},
  // 10
  '16,2' : {x: 19, y: 25},
  '17,2' : {x: 20, y: 25},
  '19,25' : {x: 16, y: 2},
  '20,25' : {x: 17, y: 2},
  // J
  '11,5': {x: 20, y: 20},
  '12,5': {x: 21, y: 20},
  '20,20': {x: 11, y: 5},
  '21,20': {x: 12, y: 5},
  // Q
  '22,23': {x: 11, y: 7},
  '22,24': {x: 11, y: 8},
  '11,7': {x: 22, y: 23},
  '11,8': {x: 22, y: 24},
}

// given an x and y coord, return a point object
function p(x,y) {
  return {
    x, y
  };
}

function clonePos(p) {
  return {
    x: p.x,
    y: p.y,
  };
}

// given either a point object or an x and y coord, return a string 'x,y'
function s(pOrX,y) {
  if (y) {
    return `${pOrX},${y}`;
  }
  return `${pOrX.x},${pOrX.y}`;
}

const end = p(13,13);
const start = p(13,25);

/**
 * State object:
 * {
 *  pos: {x,y}
 *  dir: [0-3]
 *  step: int (step in path)
 *  seenIslands: [list of cards]
 *  seenSpots: {map from 'x,y' to bool}
 *  path: [array of dirs + distances in order]
 * }
 */
const dirs = ['N', 'E', 'S', 'W']; // for printing
const NORTH = 0;
const EAST = 1;
const SOUTH = 2;
const WEST = 3;

const stateQueue = [];
let finished = false;

function solve() {
  stateQueue.push({
    pos: clonePos(start),
    dir: WEST,
    step: 0,
    seenIslands: [],
    seenSpots: {},
    path: [],
  });
  stateQueue.push({
    pos: clonePos(start),
    dir: NORTH,
    step: 0,
    seenIslands: [],
    seenSpots: {},
    path: [],
  });
  stateQueue.push({
    pos: clonePos(start),
    dir: EAST,
    step: 0,
    seenIslands: [],
    seenSpots: {},
    path: [],
  });

  while(!finished && stateQueue.length > 0) {
    const nextState = stateQueue.pop();
    processState(nextState);
  }
  if (finished) {
    console.log(`Completed! Islands seen in this order: ${finished.seenIslands}`);
    console.log(`Total path: ${finished.path}`);
  } else {
    console.log('All states failed :(');
  }
}

function processState(state) {
  const pathLen = paths[state.step];
  const crosses = crossings[state.step];

  console.log(`at ${s(state.pos)}, going ${pathLen} steps ${dirs[state.dir]}`);
  let islandSeen;
  for (let i = 0; i < pathLen; i++) {
    switch (state.dir) {
      case NORTH:
        state.pos.y -= 1;
        break;
      case SOUTH:
        state.pos.y += 1;
        break;
      case EAST:
        state.pos.x += 1;
        break;
      case WEST:
        state.pos.x -= 1;
        break;
    }
    if (state.pos.x > 25 || state.pos.x < 1 ||
        state.pos.y > 25 || state.pos.y < 1) {
      // went off the edge of the map - abort
      console.log('went off the edge - aborting\n\n');
      return;
    }
    let posStr = s(state.pos);
    if (state.seenSpots[posStr]) {
      console.log(`Crossed path at ${posStr} - aborting\n\n`);
      return;
    }
    state.seenSpots[posStr] = true;
    if (posStr === s(end)) {
      if (state.seenIslands.length === 12) {
        finished = state;
        return;
      } else {
        console.log('Hit Olympus too early - aborting\n\n');
        return;
      }
    }
    let hitIsland = islands[posStr];
    if (hitIsland) {
      if (!crosses) {
        console.log(`hit unexpected island ${hitIsland} - aborting\n\n`);
        return;
      } else if (islandSeen) {
        if (hitIsland === islandSeen) {
          console.log(`Continuing on expected island ${islandSeen}`);
        } else {
          console.log(`hit second island (${hitIsland})! aborting\n\n`);
          return;
        }
      } else {
        console.log(`hit expected island ${hitIsland}`);
        islandSeen = hitIsland;
        state.pos = clonePos(islandPartners[s(state.pos)]);
        console.log(`teleporting to ${s(state.pos)}`);
      }
      hitIsland = null;
    }
  }
  if (crosses && !islandSeen) {
    console.log('Expected island and didn\'t hit one - aborting\n\n');
    return;
  } else if (islandSeen) {
    state.seenIslands.push(islandSeen);
  }
  // if we got this far we successfully executed our journey
  state.path.push(`${dirs[state.dir]}${pathLen}`);
  const dir1 = (state.dir + 1) % 4;
  const dir2 = ((state.dir - 1) + 4) % 4;
  console.log(`succeeded! ended at ${s(state.pos)} and pushing 2 new directions: ${dirs[dir1]}, ${dirs[dir2]}`);
  console.log('\n\n');
  stateQueue.push({
    pos: clonePos(state.pos),
    dir: dir1,
    step: state.step + 1,
    seenIslands: state.seenIslands.slice(),
    seenSpots: {... state.seenSpots},
    path: state.path.slice(),
  });
  stateQueue.push({
    pos: clonePos(state.pos),
    dir: dir2,
    step: state.step + 1,
    seenIslands: state.seenIslands.slice(),
    seenSpots: {... state.seenSpots},
    path: state.path.slice(),
  });
}

function verifyInputs() {
  if (paths.length !== crossings.length) {
    console.log(`Inputs don't match length: paths is ${paths.length} and crossings is ${crossings.length}`);
  }
  let ret = '';
  let newline = true;
  for (let i = 0; i < paths.length; i++) {
    if (!newline) {
      ret += '-';
    }
    newline = false;
    if (crossings[i]) {
      ret += "(";
    }
    ret += paths[i];
    if (crossings[i]) {
      ret += ")\n";
      newline = true;
    }
  }
  return ret;
}

// console.log(verifyInputs());
solve();