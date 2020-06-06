import { getCurrentState, getInfo } from './state';

// CrossPlatform AnimationFrame
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.requestAnimationFrame = requestAnimationFrame;


// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

// Make the canvas fullscreen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const canvasArea = canvas.width * canvas.height;

function render() {
  window.requestAnimationFrame(render);

  const { self, players, map } = getCurrentState();
  const { validArea, speed } = getInfo();
  const tileRes = Math.sqrt(validArea / canvasArea); // 0 < x < 1

  if (!self) {
    return;
  }

  // clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  renderTiles(self.x, self.y, map, tileRes);

  // // Draw all players
  // renderPlayer(me, me);
  // others.forEach(renderPlayer.bind(null, me));
}

function renderTiles(centerX, centerY, map, res) {
  const tileSize = 1 / res;
  // width and height of the visible area in tiles
  const widthHalfT = canvas.width * res / 2
  const heightHalfT = canvas.height * res / 2

  for (var x = Math.floor(centerX - widthHalfT - 1); x < (centerX + widthHalfT + 1); x++) {
    for (var y = Math.floor(centerY - heightHalfT - 1); y < (centerY + heightHalfT + 1); y++) {
      // pixel position of tile at (x, y)
      const tx = (x - centerX + widthHalfT) * tileSize;
      const ty = (y - centerY + heightHalfT) * tileSize;

      // test tile
      if (x == 1 && y == 1) {
        context.fillStyle = "#f57676";
        context.fillRect(tx, ty, tileSize + 1, tileSize + 1);
      }

      if (x < 0 || y < 0 || x > map.size || y > map.size) {
        // Out of bounds
        context.fillStyle = "#e8eaed";
        context.fillRect(tx, ty, tileSize + 1, tileSize + 1);
      } else {
        // In bounds
        const index = x * map.size + y;
        context.fillStyle = "#374892";
      }

    }
  }

  context.fillStyle = "#2761d6";
  context.fillRect((canvas.width - tileSize) / 2, (canvas.height - tileSize) / 2, tileSize, tileSize)
}

var animationID = null;
export function startRendering() {
  animationID = window.requestAnimationFrame(render);
}
export function stopRendering() {
  window.cancelAnimationFrame(animationID);
}
