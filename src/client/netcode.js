import io from 'socket.io-client';
import { initState, updateState, handleEvents, getXYT } from './state';

const KEYS = require('../shared/keys.js');

var socket = undefined;

function join_game(username) {
  socket.emit(KEYS.MSG.JOIN, username);
}

export const play = (ip, username) => {
  if (typeof socket === 'undefined') {
    socket = io(`ws://${ip}`); // TODO: add change server option
    console.log(`connection to ${ip} as ${username}`);
    socket.on('connect', () => {
      console.log('connected!');
      // connected
      socket.on(KEYS.MSG.UPDATE, updateState);
      socket.on(KEYS.MSG.EVENT, handleEvents);
      socket.on(KEYS.MSG.INIT, initState);
      // socket.on(KEYS.MSG.DEATH, ???);

      join_game(username);
    })
    // .catch(() => {
    //   alert('Server not availiable'); // TODO: nicer
    //   // error
    // });
  } else {
    join_game(username);
  }
};

export function sendMove(direction) {
  const { x, y, t } = getXYT();
  socket.emit(KEYS.MSG.MOVE, { x, y, t, direction });
}
