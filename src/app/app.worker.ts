/// <reference lib="webworker" />

import { WebSocketEvent } from './index';

addEventListener('message', ({ data }) => {
  connectWebsocket();
});

const socket = new WebSocket('wss://echo.websocket.org');

function connectWebsocket() {
  socket.onmessage = (event) => {
    postMessage(WebSocketEvent.MESSAGE);
  }
  socket.onclose = (event) => {
    postMessage(WebSocketEvent.CLOSE);
  }
  socket.onerror = (event) => {
    postMessage(WebSocketEvent.ERROR);
  }
  socket.onopen = (event) => {
    postMessage(WebSocketEvent.OPEN);
  }
}

function sentWebSocketMessage() {
  socket.send('hello');
}
