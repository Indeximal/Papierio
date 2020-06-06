const PlayerState = require('../shared/playerstate');


var validStateTick = null;
var map = null;
var gameSpeed = null;
var displayArea = null;
var t0 = null;
var players = null;
var selfUUID = null;

var initCallback = null;

export function setSelf(uuid) {
  selfUUID = uuid;
}

export function runOnInitialized(callback) {
  initCallback = callback;
}

export function initState(data) {
  console.log(data);
  const { t, area, speed, mapsize, mapdata } = data;
  validStateTick = t;
  displayArea = area;
  gameSpeed = speed;
  map = {
    size: mapsize,
    tiles: mapdata.tiles,
    trails: mapdata.trails,
  }
}

export function updateState(data) {
  if (map != null) {
    if (players == null) {
      // first update
      t0 = Date.now();
      players = data.players;
      initCallback();
    } else {
      players = data.players;
    }
  }
}

export function handleEvents(data) {

}

export function getCurrentState() {
  return {
    self: {
      x: players[selfUUID].x,
      y: players[selfUUID].y,
    },
    players: players,
    map: map,
  };
}

export function getInfo() {
  return {
    validArea: displayArea,
    speed: gameSpeed,
  };
}

// const { self, players, gamestate } = getCurrentState();
// const { validArea, speed } = getInfo();

export function getXYT() {
  return { x: 1, y: 2, t: 3 };
}
