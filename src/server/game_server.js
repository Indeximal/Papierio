const express = require('express');
const socketio = require('socket.io');

const KEYS = require('../shared/keys.js');
const Game = require('./game.js')


// Setup Server
const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

const io = socketio(server);

// Setup Game
const mapSize = process.env.GAME_MAPSIZE || 64; // width and heigth in tiles
const ticktime = process.env.GAME_TICKTIME || 800; // ms per tile
const game = new Game(mapSize, 1000 / ticktime); // TODO: rethink speed

// CALLBACK for KEYS.MSG.JOIN
function joinPlayer(username) {
  game.onPlayerJoin(this, username);
}


// Setup inbound traffic
io.on('connection', socket => {
  console.log('Player connected!', socket.id);

  // Handle: JOIN, MOVE, disconnect
  socket.on(KEYS.MSG.JOIN, joinPlayer);
  // socket.on(Constants.MSG_TYPES.INPUT, handleInput);
  // socket.on('disconnect', onDisconnect);
});

const gametickFunc = game.update.bind(game);
setInterval(gametickFunc, ticktime);
