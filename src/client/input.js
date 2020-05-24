import { sendMove } from './netcode';

const KEYS = require('../shared/keys.js');


function onKeyDown(event) {
  var keyCode = event.keyCode;
  switch (keyCode) {
    case 68: //d
      sendMove(KEYS.DIR.RIGHT);
      break;
    case 83: //s
      sendMove(KEYS.DIR.DOWN);
      break;
    case 65: //a
      sendMove(KEYS.DIR.LEFT);
      break;
    case 87: //w
      sendMove(KEYS.DIR.UP);
      break;
  }
}

export function startCapturingInput() {
  window.addEventListener("keydown", onKeyDown, false);
}

export function stopCapturingInput() {
  window.removeEventListener("keydown", onKeyDown, false);
}
