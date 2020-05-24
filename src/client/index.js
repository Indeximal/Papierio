import { play } from './netcode';
import { startRendering, stopRendering } from './render';
import { startCapturingInput, stopCapturingInput } from './input.js';
// import { setLeaderboardHidden } from './leaderboard';

console.log('Hello Browser!');

document.getElementById('play-button').onclick = () => {
  const ip = document.getElementById('server-input').value;
  const name = document.getElementById('username-input').value;
  const menuDiv = document.getElementById('menu');
  // play(ip, name);
  menuDiv.classList.add('hidden');
  // initState();
  // startCapturingInput();
  startRendering();
  // setLeaderboardHidden(false);
};
