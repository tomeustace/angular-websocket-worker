/// <reference lib="webworker" />

import { WebSocketEvent } from './index';

const socket = new WebSocket('wss://echo.websocket.org');

addEventListener('message', ({ data }) => {
  if (data.event === WebSocketEvent.OPEN) {
    connectWebsocket();
  }
  if (data.event === WebSocketEvent.CLOSE) {
    socket.close();
  }
  if (data.event === WebSocketEvent.MESSAGE) {
    socket.send(data.message);
  }
});

function connectWebsocket() {
  socket.onmessage = (message: MessageEvent) => {
    postMessage({ event: WebSocketEvent.MESSAGE, message: message.data});
  }
  socket.onclose = (event) => {
    postMessage({ event: WebSocketEvent.CLOSE });
  }
  socket.onerror = (event) => {
    postMessage({ event: WebSocketEvent.ERROR });
  }
  socket.onopen = (event) => {
    postMessage({ event: WebSocketEvent.OPEN });
  }
}
