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
}

module.exports = PlayerState;
