const GameState = require('../shared/gamestate');

export function initState() {

}

export function updateState() {

}

export function handleEvents() {

}

export function getCurrentState() {
  return {
    self: {
      x: 5,
      y: 7,
    },
    players: {},
    gamestate: {},
  };
}

export function getInfo() {
  return {
    validArea: 150,
    speed: 1 / 0.8,
  };
}

// const { self, players, gamestate } = getCurrentState();
// const { validArea, speed } = getInfo();

export function getXYT() {
  return { x: 1, y: 2, t: 3 };
}
