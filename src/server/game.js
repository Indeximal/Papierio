const GameState = require('../shared/gamestate');
const Player = require('./player');
const KEYS = require('../shared/keys')


class Game extends GameState {
  constructor(mapSize, speed, maxPlayers) {
    super(mapSize, speed);
    this.tick = 0;
    this.maxPlayers = maxPlayers;
    this.availiableIDs = [... Array(maxPlayers).keys()];
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
  }

  onPlayerMove(socket, info) {
    // TODO: validate
    const { x, y, dir } = info;
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
      switch (this.players[uuid].dir) {
        case KEYS.DIR.UP:
          this.players[uuid].y += 1;
          break;
        case KEYS.DIR.RIGHT:
          this.players[uuid].x += 1;
          break;
        case KEYS.DIR.LEFT:
          this.players[uuid].x -= 1;
          break;
        case KEYS.DIR.DOWN:
          this.players[uuid].y -= 1;
          break;
        default:
        // TODO: throw error
          break;
      }
    }
  }

  emitPlayerUpdates() {
    for (var uuid in this.sockets) {
      // console.log(`Player ${this.players[uuid].name} is still here!`);
      this.sockets[uuid].emit(KEYS.MSG.UPDATE, this.players);
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
    // 4. send consequences

    // consequences: death, fill, trail

  }
}

module.exports = Game;
