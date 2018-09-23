const robot = require("robotjs");
const http = require("http");
const path = require('path');
const webSocket = require("websocket").server;
const util = require("util");
const fs = require("fs");
const getIpAdress = require('./getIpAdress.js');
const readFile = util.promisify(fs.readFile);

const host = getIpAdress();
const port = 3000;

let wsConnection;
let mouseX = 0;
let mouseY = 0;

robot.setMouseDelay(2);

const server = http.createServer((req, res) => {
    const fileName = req.url.replace('/', '') || "index.html";
    res.setHeader('Cache-Control', 'no-store');

    readFile(path.join(__dirname, fileName)).then(file => {
        res.statusCode = 200;
        res.setHeader('Content-Type', `text/${fileName.split('.')[1]}`);
        res.end(file);
    }).catch(e => {
        console.log(e);
        res.end();
    });
});

server.listen(port, host, () => console.log(`Running at http://${host}:${port}`));

const ws = new webSocket({
    httpServer: server
});

ws.on('request', request => {
    wsConnection = request.accept("teste", request.origin);
    wsConnection.sendUTF("connected");
    wsConnection.on('message', message => {
        const data = JSON.parse(message.utf8Data);
        mouseX += Math.abs(data.x) < 1 ? 0 : data.x;
        mouseY += Math.abs(data.y) < 1 ? 0 : data.y;
        robot.moveMouse(mouseX, mouseY);
    });
});