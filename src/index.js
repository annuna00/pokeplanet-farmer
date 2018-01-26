const pokefarmer = require('./pokefarmer');
const robot = require('robotjs');
const sleep = require('sleep');
const Jimp = require('jimp');

let changeMovementDirection = true;
let direction = 'right';
let loop = 0;

while (1) {

    let capture = robot.screen.capture();
    let i = 0;
    let screenshot = new Jimp(capture.width, capture.height);
    
    screenshot.scan(0, 0, screenshot.bitmap.width, screenshot.bitmap.height, (x, y, idx) => {
        screenshot.bitmap.data[idx + 2] = capture.image.readUInt8(i++);
        screenshot.bitmap.data[idx + 1] = capture.image.readUInt8(i++);
        screenshot.bitmap.data[idx + 0] = capture.image.readUInt8(i++);
        screenshot.bitmap.data[idx + 3] = capture.image.readUInt8(i++);
    });
    
    pokefarmer.refreshStatus(screenshot);

    if (!pokefarmer.gameOnScreen) {
        console.log('no game on screen');
        
        robot.keyToggle('a', 'up');
        robot.keyToggle('s', 'up');
        robot.keyToggle('d', 'up');
        robot.keyToggle('w', 'up');
    }
    else {
        if (!pokefarmer.isPlayerFighting) {
            if (changeMovementDirection) {
                changeMovementDirection = false;
                if (direction == 'left') {
                    console.log('going right');
                    direction = 'right';
                    robot.keyToggle('a', 'up');
                    robot.keyToggle('d', 'down');
                }
                else if (direction == 'right') {
                    console.log('going left');
                    direction = 'left';
                    robot.keyToggle('a', 'down');
                    robot.keyToggle('d', 'up');
                }
            }

            if (loop % 2 == 0) {
                changeMovementDirection = true;
            }
        }
        else {
            console.log('player fighting');

            robot.keyToggle('a', 'up');
            robot.keyToggle('s', 'up');
            robot.keyToggle('d', 'up');
            robot.keyToggle('w', 'up');

            let x = pokefarmer.fightButtonBounds.x / 2 + Math.floor(Math.random() * pokefarmer.fightButtonBounds.width / 2);
            let y = pokefarmer.fightButtonBounds.y / 2 + Math.floor(Math.random() * pokefarmer.fightButtonBounds.height / 2);
            
            robot.moveMouseSmooth(x, y);
            robot.mouseClick('left', false);

            sleep.msleep(1500);

            robot.mouseClick('left', false);
        }
    }

    loop++;
 
}
