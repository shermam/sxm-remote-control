const messages = document.querySelector('#messages');
const send = document.querySelector("#send");

const ws = new WebSocket("ws://192.168.0.107:3000", "teste");

let isConnected = false;

ws.addEventListener('message', message => {
    isConnected = true;
    messages.innerHTML += message.data;
});

addEventListener('devicemotion', e => {
    if (!isConnected) return;
    ws.send(JSON.stringify({
        x: e.rotationRate.alpha,
        y: -e.rotationRate.beta
    }));
});