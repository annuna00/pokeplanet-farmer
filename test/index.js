const assert = require('assert');
const deasync = require('deasync');
const pokefarmer = require('../src/pokefarmer');
const Jimp = require('jimp');

Jimp.readSync = deasync(Jimp.read);

describe('pokefarmer', function() {

    this.timeout(4000);

    it('should return true when screenshot contains pokemon planet window', function() {
        let screenshot = Jimp.readSync(__dirname + '/resources/screenshot1.png');
        let res = pokefarmer._isGameOnScreen(screenshot);
        assert.equal(res, true);
    });

    it('should return false when screenshot does not contains pokemon planet window', function() {
        let screenshot = Jimp.readSync(__dirname + '/resources/screenshot2.png');
        let res = pokefarmer._isGameOnScreen(screenshot);
        assert.equal(res, false);
    });

});