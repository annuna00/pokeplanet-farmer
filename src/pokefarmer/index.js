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

function pokeplanet() {
}

pokeplanet.prototype.gameOnScreen = false;
pokeplanet.prototype.isPlayerFighting = false;

pokeplanet.prototype.refreshStatus = function (screenshot) {
    if (!this._isGameOnScreen(screenshot)) return;

    this.screenshot = screenshot;
    
    this._inferGameScreenBounds();
    this._inferGameScreenComponents();
    this._inferIfPlayerIsFighting();
}

pokeplanet.prototype._isGameOnScreen = function (screenshot) {
    let pokeplanetFilePath = path.join(__dirname, '/resources/icon.png');
    let screenshotFilePath = path.join(os.tmpdir(), '/pokeplanet_screenshot.png'); // crypto.createHash('md5').update(Math.random().toString()).digest('hex')

    screenshot.writeSync(screenshotFilePath);

    let output = execSync(`${SUBIMAGE_CMD} ${screenshotFilePath} ${pokeplanetFilePath} 0.5`).toString();

    try {
        this.gameIconLoc = JSON.parse(output.trim());
        this.gameOnScreen = true;
    }
    catch (ex) {
        this.gameOnScreen = false;
    }

    return this.gameOnScreen;
}

pokeplanet.prototype._inferGameScreenBounds = function () {
    if (!this.gameIconLoc) throw new Exception('Cannot infer game screen bounds if game icon location is undefined');

    this.gameScreenBounds = { x: this.gameIconLoc[0] - 76, y: this.gameIconLoc[1] - 1208, width: 2048, height: 1280 };
}

pokeplanet.prototype._inferGameScreenComponents = function () {
    if (!this.gameScreenBounds) throw new Exception('Cannot infer game screen components if game screen bounds are undefined');

    this.fightButtonBounds = { x: this.gameScreenBounds.x + 410, y: this.gameScreenBounds.y + 842, width: 287, height: 90 };
}

pokeplanet.prototype._inferIfPlayerIsFighting = function () {
    if (!this.gameScreenBounds) throw new Exception('Cannot infer if player is fighting if game screen bounds are undefined');

    let regionFilePath = path.join(os.tmpdir(), '/pokeplanet_ocr_region.png');

    this.screenshot.clone().crop(this.fightButtonBounds.x, this.fightButtonBounds.y, this.fightButtonBounds.width, this.fightButtonBounds.height).writeSync(regionFilePath);

    let output = execSync(`${TESSERACT_CMD} ${regionFilePath} stdout --psm 13`, { stdio: 'pipe' }).toString();

    this.isPlayerFighting = output.indexOf('Fight') >= 0;
}

module.exports = new pokeplanet();