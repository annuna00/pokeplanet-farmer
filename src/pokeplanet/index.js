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

pokeplanet.prototype.gameIconLoc = false;
pokeplanet.prototype.gameOnScreen = false;
pokeplanet.prototype.isOnBagScreen = false;
pokeplanet.prototype.isOnFightScreen = false;

pokeplanet.prototype.refreshStatus = function (screenshot) {
    if (!this._isGameOnScreen(screenshot)) return;

    this._inferGameScreenBounds();
    this._inferGameScreenComponents();

    this._inferIfGameIsOnBagScreen();

    this._inferIfGameIsOnFightScreen();
    if (this.isOnFightScreen) this._inferFightInfo();
}

pokeplanet.prototype._isGameOnScreen = function (screenshot) {
    this.screenshot = screenshot;
    this.screenshotFilePath = path.join(os.tmpdir(), '/pokeplanet_screenshot.png'); // crypto.createHash('md5').update(Math.random().toString()).digest('hex')
    
    this.screenshot.writeSync(this.screenshotFilePath);

    this.gameIconLoc = this.__subimageLocationOnScreenshot(path.join(__dirname, '/resources/icon.png'), 0.4);
    this.gameOnScreen = this.gameIconLoc !== false;
    
    return this.gameOnScreen;
}

pokeplanet.prototype._inferGameScreenBounds = function () {
    if (!this.gameIconLoc) throw new Exception('Cannot infer game screen bounds if game icon location is undefined');

    this.gameScreenBounds = { x: this.gameIconLoc[0] - 76, y: this.gameIconLoc[1] - 1208, width: 2048, height: 1280 };
}

pokeplanet.prototype._inferGameScreenComponents = function () {
    if (!this.gameScreenBounds) throw new Exception('Cannot infer game screen components if game screen bounds are undefined');

    this.fightEnemyBounds = { x: this.gameScreenBounds.x + 392, y: this.gameScreenBounds.y + 268, width: 338, height: 42 };
    this.fightEnemyLvlBounds = { x: this.gameScreenBounds.x + 730, y: this.gameScreenBounds.y + 268, width: 102, height: 42 };

    this.bagButtonBounds = { x: this.gameScreenBounds.x + 705, y: this.gameScreenBounds.y + 842, width: 286, height: 90 };
    this.fightButtonBounds = { x: this.gameScreenBounds.x + 410, y: this.gameScreenBounds.y + 842, width: 286, height: 90 };
    this.useItemButtonBounds = { x: this.gameScreenBounds.x + 412, y: this.gameScreenBounds.y + 968, width: 227, height: 60 };
}

pokeplanet.prototype._inferIfGameIsOnFightScreen = function () {
    if (!this.gameScreenBounds) throw new Exception('Cannot infer if game is on fight screen if game screen bounds are undefined');

    let output = this.__ocr(this.__saveScreenshotRegion(this.fightButtonBounds));

    this.isOnFightScreen = output.indexOf('Fight') >= 0;
}

pokeplanet.prototype._inferIfGameIsOnBagScreen = function () {
    if (!this.gameScreenBounds) throw new Exception('Cannot infer if game is on bag screen if game screen bounds are undefined');
    
    this.useItemButtonLocation = this.__subimageLocationOnImage(this.__saveScreenshotRegion(this.useItemButtonBounds), path.join(__dirname, '/resources/useItemButton.png'), 0.4);
    
    this.isOnBagScreen = this.useItemButtonLocation !== false;
}

pokeplanet.prototype._inferFightInfo = function () {
    if (!this.isOnFightScreen) throw new Exception('Cannot infer fight info if game is not on fight screen');

    let enemyOutput = this.__ocr(this.__saveScreenshotRegion(this.fightEnemyBounds));
    let enemyLvlOutput = this.__ocr(this.__saveScreenshotRegion(this.fightEnemyLvlBounds));
    let enemyWasCaptured = this.__subimageLocationOnScreenshot(path.join(__dirname, 'resources/pokeball.png')) !== false;

    this.fightInfo = {
        enemy: enemyOutput.replace('[S]', ''),
        enemyLvl: enemyLvlOutput.substr(3),
        enemyWasCaptured: enemyWasCaptured
    };
}

pokeplanet.prototype.__saveScreenshotRegion = function (bounds) {
    let regionFilePath = path.join(os.tmpdir(), '/pokeplanet_ocr_region.png');

    this.screenshot.clone().crop(bounds.x, bounds.y, bounds.width, bounds.height).writeSync(regionFilePath);

    return regionFilePath;
}

pokeplanet.prototype.__subimageLocationOnImage = function (targetImageFilePath, imageFilePath, threshold) {
    let output = execSync(`${SUBIMAGE_CMD} ${targetImageFilePath} ${imageFilePath} ${threshold || 0.8}`).toString().trim();

    try {
        return JSON.parse(output);
    }
    catch (ex) {
        return false;
    }
}

pokeplanet.prototype.__subimageLocationOnScreenshot = function (imageFilePath, threshold) {
    return this.__subimageLocationOnImage(this.screenshotFilePath, imageFilePath, threshold);
}

pokeplanet.prototype.__ocr = function (filePath, psm) {
    return execSync(`${TESSERACT_CMD} ${filePath} stdout --psm ${psm || 13}`, { stdio: 'pipe' }).toString().trim();
}

module.exports = new pokeplanet();