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
  window.requestAnimationFrame(render);

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
  for (var i = Math.floor(x - canvas.width * res / 2 - 1); i < x + canvas.width * res / 2 + 1; i++) {
    for (var j = Math.floor(x - canvas.height * res / 2 - 1); j < x + canvas.height * res / 2 + 1; j++) {
      context.fillStyle = "#374892";
      context.fillRect(i * tileSize, j * tileSize, tileSize / 2, tileSize / 2);
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
