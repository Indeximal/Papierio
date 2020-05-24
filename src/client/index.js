import { play } from './netcode';

console.log('Hello Browser!');

document.getElementById('play-button').onclick = () => {
  const ip = document.getElementById('server-input').value;
  const name = document.getElementById('username-input').value;
  play(ip, name);
};
