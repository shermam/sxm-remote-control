const os = require('os');
const interfaces = os.networkInterfaces();

module.exports = function getIpAdress() {
    for (const name in interfaces) {
        for (interface of interfaces[name]) {
            if (interface.family !== 'IPv4') continue;
            if (interface.internal) continue;
            return interface.address;
        }
    }
}