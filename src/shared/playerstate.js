const KEYS = require('./keys.js');

class PlayerState {
  constructor(name, uuid, id, tex, x, y, dir) {
    this.name = name;
    this.uuid = uuid;
    this.id = id;
    this.tex = tex;
    this.x = x;
    this.y = y;
    this.dir = dir;
  }

  nextXY() {
    switch (this.dir) {
      case KEYS.DIR.UP:
        return { x: this.x, y: this.y - 1 };
      case KEYS.DIR.RIGHT:
        return { x: this.x + 1, y: this.y };
      case KEYS.DIR.LEFT:
        return { x: this.x - 1, y: this.y };
      case KEYS.DIR.DOWN:
        // invert y because coordinates start top left
        return { x: this.x, y: this.y + 1 };
      default:
        return { x: this.x, y: this.y, error: 'Unrecognised direction' };
    }
  }

  smoothPos(t) {
    const { x, y } = this.nextXY();
    return { x: this.x * (1 - t) + x * t, y: this.y * (1 - t) + y * t };
  }
}

module.exports = PlayerState;
