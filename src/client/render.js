import { getCurrentState, getInfo } from './state';

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

// Make the canvas fullscreen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const canvasArea = canvas.width * canvas.height;

(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

function render() {
  // window.requestAnimationFrame(render);

  const { self, players, gamestate } = getCurrentState();
  const { validArea, speed } = getInfo();
  const tileRes = Math.sqrt(validArea / canvasArea); // 0 < x < 1

  if (!self) {
    return;
  }

  // Draw background
  renderTiles(self.x, self.y, gamestate, tileRes);

  // // Draw all bullets
  // bullets.forEach(renderBullet.bind(null, me));
  //
  // // Draw all players
  // renderPlayer(me, me);
  // others.forEach(renderPlayer.bind(null, me));
}

function renderTiles(x, y, state, res) {
  const tileSize = 1 / res;
  const tileWidthHalf = canvas.width * res / 2
  const tileHeightHalf = canvas.height * res / 2
  for (var i = Math.floor(x - tileWidthHalf - 1); i < (x + tileWidthHalf + 1); i++) {
    for (var j = Math.floor(y - tileHeightHalf - 1); j < (y + tileHeightHalf + 1); j++) {
      const index = i * state.mapSize + j;
      const tx = (i - x + tileWidthHalf) * tileSize;
      const ty = (j - y + tileHeightHalf) * tileSize;
      const ts = tileSize;
      if (i < 0 || j < 0 || i > state.mapSize || j > state.mapSize) {
        context.fillStyle = "#e8eaed";
        context.fillRect(tx, ty, ts + 1, ts + 1);
      } else {
        context.fillStyle = "#374892";
      }

    }
  }
}

var reqid = null;
export function startRendering() {
  reqid = window.requestAnimationFrame(render);
}
export function stopRendering() {
  window.cancelAnimationFrame(reqid);
}
