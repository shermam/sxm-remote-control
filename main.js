//@ts-check
const messages = document.querySelector('#messages');
const send = document.querySelector("#send");
const connectButton = document.querySelector("#connect");
const disconnectButton = document.querySelector("#disconnect");
const touchpad = document.querySelector('#touchpad');
let ws;

connectButton.addEventListener('click', connect);
disconnectButton.addEventListener('click', disconnect);


function disconnect() {
    ws.close();
}

function connect() {
    ws = new WebSocket(location.href.replace('http', 'ws'), "teste");
    ws.addEventListener('message', message => {
        messages.innerHTML = message.data;
    });
    ws.addEventListener('close', () => {
        messages.innerHTML = 'Connection closed';
        stopCapturing();
    });

    startCapturing();
}

function sendData(data) {
    if (ws.readyState !== ws.OPEN) return;
    ws.send(JSON.stringify(data));
}

let lastX;
let lastY;

function startCapturing() {
    // addEventListener('devicemotion', motionListener);
    touchpad.addEventListener('touchmove', touchListener);
    touchpad.addEventListener('touchend', () => lastX = lastY = null);
}

function stopCapturing() {
    // removeEventListener('devicemotion', motionListener);
    touchpad.removeEventListener('touchmove', touchListener);
}

function motionListener(e) {
    sendData({
        x: e.rotationRate.alpha,
        y: -e.rotationRate.beta
    });
}

function touchListener(e) {
    e.preventDefault();
    e.stopPropagation();

    const currentX = e.touches[0].screenX;
    const currentY = e.touches[0].screenY;
    sendData({
        x: (currentX - (lastX || currentX)) * 5,
        y: (currentY - (lastY || currentY)) * 5
    });

    lastX = currentX;
    lastY = currentY;
}