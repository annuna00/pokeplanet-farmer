const pokefarmer = require('./pokefarmer');
const robot = require('robotjs');
const Jimp = require('jimp');

while (1) {

    let capture = robot.screen.capture();
    let i = 0;
    let screenshot = new Jimp(capture.width, capture.height);
    
    screenshot.scan(0, 0, screenshot.bitmap.width, screenshot.bitmap.height, (x, y, idx) => {
        screenshot.bitmap.data[idx + 2] = screenshot.image.readUInt8(i++);
        screenshot.bitmap.data[idx + 1] = screenshot.image.readUInt8(i++);
        screenshot.bitmap.data[idx + 0] = screenshot.image.readUInt8(i++);
        screenshot.bitmap.data[idx + 3] = screenshot.image.readUInt8(i++);
    });
    
    pokefarmer.refreshStatus(screenshot);

}
