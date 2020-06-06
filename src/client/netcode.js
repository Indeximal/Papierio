import io from 'socket.io-client';
import { initState, updateState, handleEvents, setSelf, getXYT } from './state';

const KEYS = require('../shared/keys.js');

var socket = undefined;

function join_game(username) {
  socket.emit(KEYS.MSG.JOIN, username);
}

export const play = (ip, username) => {
  // set up socket the first time
  if (typeof socket === 'undefined') {
    socket = io(`ws://${ip}`); // TODO: add change server option
    console.log(`connecting to ${ip} as ${username}`);

    socket.on('connect', () => {
      console.log('connected!');
      // connected
      setSelf(socket.id);
      socket.on(KEYS.MSG.UPDATE, updateState);
      socket.on(KEYS.MSG.EVENT, handleEvents);
      socket.on(KEYS.MSG.INIT, initState);
      // socket.on(KEYS.MSG.DEATH, ???);

      join_game(username);
    })
    // TODO: handle server unavailiable

  } else {
    join_game(username);
  }
};

export function sendMove(direction) {
  const { x, y, t } = getXYT();
  // console.log(`Move in dir ${direction}`);
  socket.emit(KEYS.MSG.MOVE, { t: t, x: x, y: y, dir: direction });
}
