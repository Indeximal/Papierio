import { getCurrentState, getInfo, getTexture } from './state';

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

  const { center, players, map } = getCurrentState();
  const { validArea } = getInfo();
  const tileRes = Math.sqrt(validArea / canvasArea); // 0 < x < 1

  if (!center) {
    // Theoretically shouldn't be reached, but hey, I don't really know what I'm doing.
    return;
  }

  // clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  renderTiles(center.x, center.y, map, tileRes);

  // Draw all players
  renderPlayers(center.x, center.y, tileRes, players)
}

function renderPlayers(centerX, centerY, res, players) {
  const tileSize = 1 / res;
  // width and height of the visible area in tiles
  const widthHalfT = canvas.width * res / 2
  const heightHalfT = canvas.height * res / 2

  // render every player, no edgecase for own player.
  for (let p of players) {
    // pixel coordinates
    const tx = (p.x - centerX + widthHalfT) * tileSize;
    const ty = (p.y - centerY + heightHalfT) * tileSize;
    context.fillStyle = p.tex;
    context.fillRect(tx, ty, tileSize, tileSize);
  }
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

      if (x < 0 || y < 0 || x >= map.size || y >= map.size) {
        // Out of bounds
        context.fillStyle = "#e8eaed";
        context.fillRect(tx, ty, tileSize + 1, tileSize + 1);
      } else {
        // In bounds
        const index = x * map.size + y;

        const tileOwnerID = map.tiles[index];
        const trailOwnerID = map.trails[index];
        const trailTex = getTexture(trailOwnerID);

        // draw tile
        if (tileOwnerID != 0) {
          const tileTex = getTexture(tileOwnerID);
          context.fillStyle = tileTex;
          context.fillRect(tx, ty, tileSize + 1, tileSize + 1);
        }

        // draw trail transparently
        if (trailOwnerID != 0) {
          context.fillStyle = trailTex;
          context.globalAlpha = 0.5;
          context.fillRect(tx, ty, tileSize, tileSize);
          context.globalAlpha = 1.0;
        }
      }
    }
  }
}

var animationID = null;
export function startRendering() {
  animationID = window.requestAnimationFrame(render);
}
export function stopRendering() {
  // FIXME: doesn't work!
  window.cancelAnimationFrame(animationID);
}
