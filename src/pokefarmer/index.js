const crypto = require('crypto');
const deasync = require('deasync');
const execSync = require('child_process').execSync;
const fs = require('fs');
const os = require('os');
const path = require('path');
const Jimp = require('jimp');

Jimp.prototype.writeSync = deasync(Jimp.prototype.write);

const SUBIMAGE_CMD = path.join(__dirname, '/lib/subimage');
const TESSERACT_CMD = 'tesseract';

function pokefarmer() {
}

pokefarmer.prototype.refreshStatus = function (screenshot) {
    if (!this._isGameOnScreen(screenshot)) return;

    this.screenshot = screenshot;
    
    this._inferGameScreenBounds();
    this._inferIfPlayerIsFighting();
}

pokefarmer.prototype._isGameOnScreen = function (screenshot) {
    let pokeplanetFilePath = path.join(__dirname, '/resources/pokeplanet.png');
    let screenshotFilePath = path.join(os.tmpdir(), '/pokefarmer_screenshot.png'); // crypto.createHash('md5').update(Math.random().toString()).digest('hex')

    screenshot.writeSync(screenshotFilePath);

    let output = execSync(`${SUBIMAGE_CMD} ${screenshotFilePath} ${pokeplanetFilePath} 0.7`).toString();

    try {
        this.gameIconLoc = JSON.parse(output.trim());
        return true;
    }
    catch (ex) {
        return false;
    }
}

pokefarmer.prototype._inferGameScreenBounds = function () {
    if (!this.gameIconLoc) throw new Exception('Cannot infer game screen bounds if game icon location is undefined');

    this.gameScreenBounds = { x: this.gameIconLoc[0] - 76, y: this.gameIconLoc[1] - 1208, width: 2048, height: 1280 };
}

pokefarmer.prototype._inferIfPlayerIsFighting = function () {
    if (!this.gameScreenBounds) throw new Exception('Cannot infer if player is fighting if game screen bounds are undefined');

    let regionFilePath = path.join(os.tmpdir(), '/pokefarmer_ocr_region.png');

    this.screenshot.clone().crop(this.gameScreenBounds.x + 410, this.gameScreenBounds.y + 842, 287, 90).writeSync(regionFilePath);

    let output = execSync(`${TESSERACT_CMD} ${regionFilePath} stdout --psm 13`, { stdio: 'pipe' }).toString();

    this.isPlayerFighting = output.indexOf('Fight') >= 0;
}

module.exports = new pokefarmer();