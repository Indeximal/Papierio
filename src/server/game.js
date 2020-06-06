const GameState = require('../shared/gamestate');
const Player = require('./player');
const KEYS = require('../shared/keys')


class Game extends GameState {
  constructor(mapSize, speed, maxPlayers, visibleArea) {
    super(mapSize, speed);
    this.tick = 0;
    this.maxPlayers = maxPlayers;
    this.visibleArea = visibleArea;
    this.availiableIDs = [... Array(maxPlayers).keys()];
    this.availiableIDs.shift() // remove 0
    this.availiableTextures = ['#de6223', '#de2323', '#ded823', '#77de23',
      '#23de93', '#23a9de', '#232fde', '#8723de', '#de23c5'];

    this.sockets = {};
  }

  onPlayerJoin(socket, name) {
    // TODO: reject if max players reached
    const pid = this.availiableIDs.pop();
    const tex = this.availiableTextures.pop();

    // TODO: more intelligent spawns
    const x = Math.floor(Math.random() * this.mapSize);
    const y = Math.floor(Math.random() * this.mapSize);

    const player = new Player(name, socket.id, pid, tex, x, y, KEYS.DIR.RIGHT);
    this.players[socket.id] = player;
    this.sockets[socket.id] = socket;

    // Fill 3x3 starting Area.
    for (var dx = -1; dx <= 1; dx++) {
      for (var dy = -1; dy <= 1; dy++) {
        const index = (x + dx) * this.mapSize + (y + dy);
        this.landMap[index] = pid;
      }
    }

    this.emitState(socket);
  }

  emitState(socket) {
    const fulldata = {
      t: this.tick,
      area: this.visibleArea,
      speed: this.speed,
      mapsize: this.mapSize,
      mapdata: {
        tiles: this.landMap,
        trails: this.trailMap,
      },
    }
    socket.emit(KEYS.MSG.INIT, fulldata);
  }

  onPlayerMove(socket, info) {
    // TODO: validate
    const { t, x, y, dir } = info;
    this.players[socket.id].dir = dir;
  }

  removePlayer(socket) {
    // players remove
    // const pid = player.id
    // this.availiableIDs.push(pid)
    // this.availiableTextures.push(tex)
  }

  // Store the trail of each player before he moves.
  updateTrails() {
    for (var uuid in this.players) {
      const p = this.players[uuid];
      const index = p.x * this.mapSize + p.y;
      const tileOwnerID = this.landMap[index];
      const priorTrailOwner = this.trailMap[index];
      if (priorTrailOwner != 0) {
        console.log('Error: The prior trail is not 0!');
      }
      this.trailMap[index] = p.id;
    }
  }

  updatePlayerPos() {
    for (var uuid in this.players) {
      const { x, y } = this.players[uuid].nextXY();
      // Out of bounds is a valid state at this point
      this.players[uuid].x = x;
      this.players[uuid].y = y;
    }
  }

  emitPlayerUpdates() {
    for (var uuid in this.sockets) {
      // console.log(`Player ${this.players[uuid].name} is still here!`);
      const data = {
        t: this.tick,
        players: this.players,
      };
      this.sockets[uuid].emit(KEYS.MSG.UPDATE, data);
    }
  }

  getPlayerByID(ingameID) {
    for (var uuid in this.players) {
      if (this.players[uuid].id == ingameID) {
        return this.players[uuid];
      }
    }
  }

  // calculate collisions and fills
  calcEvents() {
    var instantEvents = [];
    var delayedEvents = [];

    for (var uuid in this.players) {
      const p = this.players[uuid];

      // Wall Collision: (x, y) is out of bounds: kill self t+0
      if (p.x < 0 || p.y < 0 || p.x >= this.mapSize || p.y >= this.mapSize) {
        instantEvents.push({
          type: 'kill',
          player: uuid,
          target: uuid,
        });
        continue;
      }

      const index = p.x * this.mapSize + p.y;
      const tileOwnerID = this.landMap[index];
      const trailOwnerID = this.trailMap[index];

      // Collision Types:
      // OwnTrail: (x,y) trail is own: kill self t+0
      // OtherTrail: (x,y) trail is other: kill other t+0
      // HeadCollision: OtherTrail as well as other has OtherTrail on self: kill both. t+0
      if (trailOwnerID !== 0) {
        // Collision with a trail
        instantEvents.push({
          type: 'kill',
          player: uuid,
          target: this.getPlayerByID(trailOwnerID).uuid,
        });
      }

      // TileCompetition: (x, y) is same as someone else's t+0.5
      // Basically they are on the same spot, so one has to die. For fairness normally both die.
      for (var otheruuid in this.players) {
        if (uuid === otheruuid) {
          continue;
        }
        if (p.x === this.players[otheruuid].x && p.y === this.players[otheruuid].y) {
          // only wierd special case: when the tile belongs to one party
          if (tileOwnerID != this.players[otheruuid]) {
            delayedEvents.push({
              type: 'kill',
              player: uuid,
              target: otheruuid,
            });
          }
        }
      }

      // Fill at t+0.5, where t is the current update
      if (tileOwnerID === p.id) {
        // Home Tile: Fill area
        // TODO: Fill algorithm
        delayedEvents.push({
          type: 'fill',
          player: uuid,
          tiles: null,
        })
      }
    }
    return [ instantEvents, delayedEvents ];
  }

  // tick
  update() {
    console.log(`tick ${this.tick}`);
    this.tick += 1;
    console.log(this.players);

    // 0. update Trails: quick
    this.updateTrails();
    // 1. calc player pos: quick
    this.updatePlayerPos();
    // 2. send player updates: quick
    this.emitPlayerUpdates();
    // 3. calc consequences
    const [ immediateEvent, delayedEvents ] = this.calcEvents();
    // 4. send consequences

    // consequences: death, fill, trail

  }
}

module.exports = Game;
