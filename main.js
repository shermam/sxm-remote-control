const messages = document.querySelector('#messages');
const send = document.querySelector("#send");

const ws = new WebSocket(location.href.replace('http', 'ws'), "teste");

ws.addEventListener('message', message => {
    messages.innerHTML += message.data;
});

ws.addEventListener('close', () => {
    messages.innerHTML = 'Connection closed';
});

addEventListener('devicemotion', e => {
    if (ws.readyState !== ws.OPEN) return;
    ws.send(JSON.stringify({
        x: e.rotationRate.alpha,
        y: -e.rotationRate.beta
    }));
});