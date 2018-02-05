const assert = require('assert');
const deasync = require('deasync');
const pokeplanet = require('../src/pokeplanet');
const Jimp = require('jimp');

Jimp.readSync = deasync(Jimp.read);

describe('pokeplanet', function() {

    this.timeout(10000);
    
    describe('isOn*Screen tests', function() {

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

        it('should return true when game is on bag screen', function() {
            pokeplanet.refreshStatus(Jimp.readSync(__dirname + '/resources/screenshot5.png'));
            assert.equal(pokeplanet.isOnBagScreen, true);
        });
    
        it('should return false when game is not on bag screen', function() {
            pokeplanet.refreshStatus(Jimp.readSync(__dirname + '/resources/screenshot3.png'));
            assert.equal(pokeplanet.isOnBagScreen, false);
        });
    
        it('should return true when game is on fight screen', function() {
            pokeplanet.refreshStatus(Jimp.readSync(__dirname + '/resources/screenshot3.png'));
            assert.equal(pokeplanet.isOnFightScreen, true);
        });
    
        it('should return false when game is not on fight screen', function() {
            pokeplanet.refreshStatus(Jimp.readSync(__dirname + '/resources/screenshot2.png'));
            assert.equal(pokeplanet.isOnFightScreen, false);
        });

        it('should return true when game is on learn move screen', function() {
            pokeplanet.refreshStatus(Jimp.readSync(__dirname + '/resources/screenshot6.png'));
            assert.equal(pokeplanet.isOnLearnMoveScreen, true);
        });

        it('should return false when game is not on learn move screen', function() {
            pokeplanet.refreshStatus(Jimp.readSync(__dirname + '/resources/screenshot3.png'));
            assert.equal(pokeplanet.isOnLearnMoveScreen, false);
        });

        it('should return true if game is on the screen but without connection', function() {
            pokeplanet.refreshStatus(Jimp.readSync(__dirname + '/resources/screenshot7.png'));
            assert.equal(pokeplanet.gameOnScreen, false);
            assert.equal(pokeplanet.gameLostConnection, true);
        });

    });

    describe('on bag tests', function () {
        
        it('should return Great Ball when asked for selected item on bag', function() {
            pokeplanet.refreshStatus(Jimp.readSync(__dirname + '/resources/screenshot5.png'));
            assert.equal(pokeplanet.bagInfo.selectedItem, 'GreatBall');
        });

    });

    describe('on fight tests', function() {

        it('should return Spearow when asked for player\'s enemy', function() {
            pokeplanet.refreshStatus(Jimp.readSync(__dirname + '/resources/screenshot3.png'));
            assert.equal(pokeplanet.fightInfo.enemy, 'Spearow');
        });
    
        it('should return 21 when asked for player enemy\'s level', function() {
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

});