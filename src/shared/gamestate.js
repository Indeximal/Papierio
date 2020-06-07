
class GameState {
  constructor(mapSize, speed) {
    this.players = {};
    this.speed = speed;
    this.mapSize = mapSize;
    this.landMap = new Uint8Array(mapSize * mapSize);
    this.trailMap = new Uint8Array(mapSize * mapSize);

  }
}

module.exports = GameState;
