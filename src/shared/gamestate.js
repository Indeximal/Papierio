
class GameState {
  constructor(mapSize, speed) {
    this.players = {};
    this.playerSpeed = speed;
    this.landMap = new Array(mapSize * mapSize);
    this.trailMap = new Array(mapSize * mapSize);
  }
}

module.exports = GameState;
