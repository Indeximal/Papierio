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

    this.emitState(socket);

    // TODO: fill start area
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
    // players remvoe
    // const pid = ??
    // this.availiableIDs.push(pid)
    // this.availiableTextures.push(tex)
  }

  updatePlayerPos() {
    for (var uuid in this.players) {
      const { x, y } = this.players[uuid].nextXY();
      this.players[uuid].x = x;
      this.players[uuid].y = y;
    }
  }

  // Done off-tick
  calcPlayerTrailUpdates() {
    for (var uuid in this.players) {

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

  // tick
  update() {
    console.log(`tick ${this.tick}`);
    this.tick += 1;
    console.log(this.players);

    // 1. calc player pos: quick
    this.updatePlayerPos();
    // 2. send player updates: quick
    this.emitPlayerUpdates();
    // 3. calc consequences
    trailEvents = this.calcPlayerTrailUpdates();
    // 4. send consequences

    // consequences: death, fill, trail

  }
}

module.exports = Game;
