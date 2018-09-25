//@ts-check
const Server = require('./Server.js');
const robot = require("robotjs");
const getIpAdress = require('./getIpAdress.js');

let mouseX = 0;
let mouseY = 0;

robot.setMouseDelay(2);

const server = new Server(getIpAdress(), 3000);

server.start();
server.on("message", message => {
    const data = JSON.parse(message.utf8Data);
    mouseX += data.x;
    mouseY += data.y;
    robot.moveMouse(mouseX, mouseY);
});