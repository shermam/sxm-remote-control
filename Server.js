//@ts-check
const http = require("http");
const path = require('path');
const util = require("util");
const fs = require("fs");
const webSocket = require("websocket").server;
const readFile = util.promisify(fs.readFile);
const mimes = require('./mimes.js');

module.exports = class Server {
    constructor(host, port) {
        this.bindMethods();
        this.host = host;
        this.port = port;
        this._listeners = {};
        this.httpServer = http.createServer((req, res) => {
            const fileName = req.url.replace('/', '') || "index.html";
            res.setHeader('Cache-Control', 'no-store');

            readFile(path.join(__dirname, fileName)).then(file => {
                res.statusCode = 200;
                res.setHeader('Content-Type', mimes[fileName.split('.')[1]]);
                res.end(file);
            }).catch(e => {
                console.log(e);
                res.end();
            });
        });

    }

    bindMethods() {
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.on = this.on.bind(this);
        this.off = this.off.bind(this);
        this.broadcasMessage = this.broadcasMessage.bind(this);
    }

    start() {
        this.httpServer.listen(
            this.port,
            this.host,
            () => console.log(`Running at http://${this.host}:${this.port}`)
        );

        this.wsServer = new webSocket({
            httpServer: this.httpServer
        });

        this.wsServer.on('request', request => {
            this.wsConnection = request.accept("teste", request.origin);
            this.wsConnection.sendUTF("connected");
            this.wsConnection.on('message', this.broadcasMessage);
        });
    }


    stop() {
        this.wsServer.shutDown();
        this.httpServer.close();
    }

    on(type, cb) {
        this._listeners[type] = this._listeners[type] || [];
        this._listeners[type].push(cb);
    }

    off(type, cb) {
        this._listeners[type] = this._listeners[type] || [];
        this._listeners[type].splice(this._listeners[type].indexOf(cb), 1)
    }

    broadcasMessage(message) {
        (this._listeners.message || []).forEach(cb => {
            cb(message);
        });
    }
}