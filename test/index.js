const assert = require('assert');
const deasync = require('deasync');
const pokeplanet = require('../src/pokeplanet');
const Jimp = require('jimp');

Jimp.readSync = deasync(Jimp.read);

describe('pokeplanet', function() {

    this.timeout(10000);

    xit('should return true when game is on the screen', function() {
        let screenshot = Jimp.readSync(__dirname + '/resources/screenshot2.png');
        let res = pokeplanet._isGameOnScreen(screenshot);
        assert.equal(res, true);
    });

    xit('should return false when game is not on the screen', function() {
        let screenshot = Jimp.readSync(__dirname + '/resources/screenshot1.png');
        let res = pokeplanet._isGameOnScreen(screenshot);
        assert.equal(res, false);
    });

    xit('should return true when player is fighting', function() {
        pokeplanet.refreshStatus(Jimp.readSync(__dirname + '/resources/screenshot3.png'));
        assert.equal(pokeplanet.isOnFightScreen, true);
    });

    xit('should return false when player is not fighting', function() {
        pokeplanet.refreshStatus(Jimp.readSync(__dirname + '/resources/screenshot2.png'));
        assert.equal(pokeplanet.isOnFightScreen, false);
    });

    xit('should return Spearow when asked for player\'s enemy', function() {
        pokeplanet.refreshStatus(Jimp.readSync(__dirname + '/resources/screenshot3.png'));
        assert.equal(pokeplanet.fightInfo.enemy, 'Spearow');
    });

    xit('should return 21 when asked for player enemy\'s level', function() {
        pokeplanet.refreshStatus(Jimp.readSync(__dirname + '/resources/screenshot3.png'));
        assert.equal(pokeplanet.fightInfo.enemyLvl, '21');
    });

    it('should return true when player\'s enemy was captured', function() {
        pokeplanet.refreshStatus(Jimp.readSync(__dirname + '/resources/screenshot3.png'));
        assert.equal(pokeplanet.fightInfo.enemyWasCaptured, true);
    });

    it('should return false when player\'s enemy wasn\'t captured', function() {
        pokeplanet.refreshStatus(Jimp.readSync(__dirname + '/resources/screenshot4.png'));
        assert.equal(pokeplanet.fightInfo.enemyWasCaptured, false);
    });

});