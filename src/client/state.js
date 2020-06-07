const PlayerState = require('../shared/playerstate');

const DISPLAY_DELAY = 30; // ms

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
    const tileOwnerID = map.tiles[index];
    if (tileOwnerID != p.id) {
      map.trails[index] = p.id;
    }
  }
}

var nextTickPlayers;
function updatePlayers() {
  // kind hacky implicit solution to paint in the trails, FIXME maybe
  updateTrails();

  players = {};
  for (var uuid in nextTickPlayers) {
    // convert data into Player-Instances
    const player = new PlayerState();
    Object.assign(player, nextTickPlayers[uuid]);
    players[uuid] = player;
  }
}

// Provoked by server, provides player position and direction data.
export function updateState(data) {
  const serverTick = data.t;
  if (map != null) {
    if (players == null) {
      // first update
      const serverT0 = serverTick * gameSpeed;
      t0 = Date.now() - serverT0 - DISPLAY_DELAY;
      nextTickPlayers = data.players;
      initCallback();
    } else {
      nextTickPlayers = data.players;
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

// Called every frame by the render loop
var prevTick = 0;
export function getCurrentState() {

  const tick = (Date.now() - t0) / gameSpeed;
  if (Math.floor(prevTick) != Math.floor(tick)) {
    // Tick has occured!
    updatePlayers();
  }
  prevTick = tick;
  // display is behind calcucation, so subract 1
  const floatT = tick - Math.floor(tick) - 1;

  const smoothPlayers = Object.values(players).map(p => {
    const { x, y } = p.smoothPos(floatT);
    return {
      x: x,
      y: y,
      tex: p.tex,
    };
  });

  return {
    center: players[selfUUID].smoothPos(floatT),
    players: smoothPlayers,
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
