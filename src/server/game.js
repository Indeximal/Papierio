const GameState = require('../shared/gamestate');
const Player = require('./player');
const KEYS = require('../shared/keys')


class Game extends GameState {
  constructor(mapSize, speed, maxPlayers) {
    super(mapSize, speed);
    this.maxPlayers = maxPlayers;
    this.MoveUpdatePhase = true;
    this.availiableIDs = [... Array(maxPlayers).keys()];
    this.availiableTextures = ['#de6223', '#de2323', '#ded823', '#77de23',
      '#23de93', '#23a9de', '#232fde', '#8723de', '#de23c5'];
  }

  onJoinPlayer(socket, name) {
    // TODO: reject if max players reached
    const pid = this.availiableIDs.pop();
    const tex = this.availiableTextures.pop();

    // TODO: more intelligent spawns
    const x = Math.floor(Math.random() * this.mapSize);
    const y = Math.floor(Math.random() * this.mapSize);

    const player = new Player(name, socket.id, pid, tex, x, y, KEYS.DIR.RIGHT);
    this.players[socket.id] = player;
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

  tick() {
    if (this.MoveUpdatePhase) {
      this.update();
    } else {
      this.movements();
    }
    this.MoveUpdatePhase = !this.MoveUpdatePhase;
  }

  // tick
  update() {
    console.log('tick');
  }

  // tock
  movements() {
    console.log('tock');
  }
}

module.exports = Game;
