const assert = require('assert');
const deasync = require('deasync');
const pokeplanet = require('../src/pokeplanet');
const Jimp = require('jimp');

Jimp.readSync = deasync(Jimp.read);

describe('pokeplanet', function() {

    this.timeout(10000);

    it('should return true when game is on the screen', function() {
        let screenshot = Jimp.readSync(__dirname + '/resources/screenshot2.png');
        let res = pokeplanet._isGameOnScreen(screenshot);
        assert.equal(res, true);
    });

    it('should return false when game is not on the screen', function() {
        let screenshot = Jimp.readSync(__dirname + '/resources/screenshot1.png');
        let res = pokeplanet._isGameOnScreen(screenshot);
        assert.equal(res, false);
    });

    it('should return true when player is fighting', function() {
        pokeplanet.refreshStatus(Jimp.readSync(__dirname + '/resources/screenshot3.png'));
        assert.equal(pokeplanet.isPlayerFighting, true);
    });

    it('should return false when player is not fighting', function() {
        pokeplanet.refreshStatus(Jimp.readSync(__dirname + '/resources/screenshot2.png'));
        assert.equal(pokeplanet.isPlayerFighting, false);
    });

});