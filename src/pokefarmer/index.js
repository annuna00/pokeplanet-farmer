const crypto = require('crypto');
const deasync = require('deasync');
const execSync = require('child_process').execSync;
const fs = require('fs');
const os = require('os');
const path = require('path')
const Jimp = require('jimp');

Jimp.prototype.writeSync = deasync(Jimp.prototype.write);

function pokefarmer() {
}

pokefarmer.prototype.refreshStatus = function (screenshot) {
    if (!this._isGameOnScreen(screenshot)) return;


}

pokefarmer.prototype._isGameOnScreen = function (screenshot) {
    let match = false;
    let pokeplanetFilePath = path.join(__dirname, '/resources/pokeplanet.png');
    let screenshotFilePath = path.join(os.tmpdir(), crypto.createHash('md5').update(Math.random().toString()).digest('hex') + '.png');

    screenshot.writeSync(screenshotFilePath);

    let output = execSync(path.join(__dirname, '/lib/subimage') + ' ' + screenshotFilePath + ' ' + pokeplanetFilePath + ' 0.7').toString();

    try {
        let iconLocation = JSON.parse(output.trim());
        this._inferGameLocation(iconLocation);
        return true;
    }
    catch (ex) {
        return false;
    }
}

pokefarmer.prototype._inferGameLocation = function (iconLocation) {
    console.log(iconLocation);
}

module.exports = new pokefarmer();