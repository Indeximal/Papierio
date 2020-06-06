import { play } from './netcode';
import { startRendering, stopRendering } from './render';
import { startCapturingInput, stopCapturingInput } from './input.js';
import { runOnInitialized } from './state.js';
// import { setLeaderboardHidden } from './leaderboard';


document.getElementById('play-button').onclick = () => {
  const ip = document.getElementById('server-input').value;
  const name = document.getElementById('username-input').value;
  const menuDiv = document.getElementById('menu');
  play(ip, name);
  runOnInitialized(() => {
    menuDiv.classList.add('hidden');
    startRendering();
    startCapturingInput();
    // setLeaderboardHidden(false);
  });
};
