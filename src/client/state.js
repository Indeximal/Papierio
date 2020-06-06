const PlayerState = require('../shared/playerstate');


var validStateTick = null;
var map = null;
var gameSpeed = null;
var displayArea = null;
var t0 = null;
var players = null;
var selfUUID = null;

var initCallback = null;
var deathCallback = null;

export function setSelf(uuid) {
  selfUUID = uuid;
}

export function runOnInitialized(callback) {
  initCallback = callback;
}

export function runOnDeath(callback) {
  deathCallback = callback;
}

// return the texture string for a given ingame id
export function getTexture(ingameID) {
  for (var uuid in players) {
    if (players[uuid].id == ingameID) {
      return players[uuid].tex;
    }
  }
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

// paints the trails for the current players
function updateTrails() {
  for (var uuid in players) {
    const p = players[uuid];
    const index = p.x * map.size + p.y;
    map.trails[index] = p.id;
  }
}

function updatePlayers(playersDict) {
  // kind hacky implicit solution to paint in the trails, FIXME maybe
  updateTrails();

  players = {};
  for (var uuid in playersDict) {
    // convert data into Player-Instances
    const player = new PlayerState();
    Object.assign(player, playersDict[uuid]);
    players[uuid] = player;
  }
}

// Provoked by server, provides player position and direction data.
export function updateState(data) {
  if (map != null) {
    if (players == null) {
      // first update
      t0 = Date.now();
      updatePlayers(data.players);
      initCallback();
    } else {
      updatePlayers(data.players);
    }
  }
}

export function handleEvents(data) {
  // TODO: handle delayedEvents differently
  const { t, immediateEvents, delayedEvents } = data;
  const events = immediateEvents.concat(delayedEvents);

  events.forEach(event => {
    if (event.type === 'kill') {
      if (event.target === selfUUID) {
        // YOU DIED
        deathCallback(event);
      }
    } else if (event.type === 'fill') {
      // TODO: fill the map ()
    }
  });
}

export function getCurrentState() {
  return {
    center: {
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

export function getXYT() {
  // TODO: fix
  // not needed right now
  return { x: 1, y: 2, t: 3 };
}
