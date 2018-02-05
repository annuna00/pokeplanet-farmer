const pokeplanet = require('./pokeplanet');
const robot = require('robotjs');
const sleep = require('sleep');
const Jimp = require('jimp');

let changeMovementDirection = true;
let direction = 'right';
let loop = 0;

let pokeballs = ['PokeBall', 'GreatBall', 'UltraBall'];
let pokemonsToCatch = [
    'Parasect',
    'Exeggcute',
    'Chansey',
    'Tauros',
    'Doduo',
    'Rhyhorn',
    'Scyther',
    'Pinsir',
    'Kangaskhan',
    'Dratini',
    'Dragonair',
    'Psyduck',
    'Slowpoke',
    'Grimer',
    'Koffing',
    'Growlithe',
    'Vulpix'
];

while (1) {

    let capture = robot.screen.capture();
    let i = 0;
    let screenshot = new Jimp(capture.width, capture.height);
    let screenshotScale = capture.width / robot.getScreenSize().width;
    
    screenshot.scan(0, 0, screenshot.bitmap.width, screenshot.bitmap.height, (x, y, idx) => {
        screenshot.bitmap.data[idx + 2] = capture.image.readUInt8(i++);
        screenshot.bitmap.data[idx + 1] = capture.image.readUInt8(i++);
        screenshot.bitmap.data[idx + 0] = capture.image.readUInt8(i++);
        screenshot.bitmap.data[idx + 3] = capture.image.readUInt8(i++);
    });
    
    pokeplanet.refreshStatus(screenshot);

    if (!pokeplanet.gameOnScreen) {
        console.log('no game on screen');
        
        robot.keyToggle('a', 'up');
        robot.keyToggle('s', 'up');
        robot.keyToggle('d', 'up');
        robot.keyToggle('w', 'up');

        if (pokeplanet.gameLostConnection) {
            robot.keyTap('R', 'command');
        }
    }
    else {
        if (pokeplanet.isOnFightScreen) {
            console.log('player fighting');
            console.log('enemy: ' + pokeplanet.fightInfo.enemy + ' (lv. ' + pokeplanet.fightInfo.enemyLvl + ')');

            if (!pokeplanet.fightInfo.enemyWasCaptured) {
                console.log('enemy not captured yet!');
            }

            robot.keyToggle('a', 'up');
            robot.keyToggle('s', 'up');
            robot.keyToggle('d', 'up');
            robot.keyToggle('w', 'up');

            if (!pokeplanet.fightInfo.enemyWasCaptured || pokeplanet.fightInfo.enemyIsShiny || pokemonsToCatch.indexOf(pokeplanet.fightInfo.enemy) >= 0) {
                console.log('let\'s try to capture this pokemon... we need to open the bag :P');
                
                let x = pokeplanet.bagButtonBounds.x / screenshotScale + Math.floor(Math.random() * pokeplanet.bagButtonBounds.width / screenshotScale);
                let y = pokeplanet.bagButtonBounds.y / screenshotScale + Math.floor(Math.random() * pokeplanet.bagButtonBounds.height / screenshotScale);
                
                robot.moveMouseSmooth(x, y);
                robot.mouseClick('left', false);
            }
            else {
                console.log('let\'s kill this pokemon');
                
                let x = pokeplanet.fightButtonBounds.x / screenshotScale + Math.floor(Math.random() * (pokeplanet.fightButtonBounds.width - 16) / screenshotScale);
                let y = pokeplanet.fightButtonBounds.y / screenshotScale + Math.floor(Math.random() * (pokeplanet.fightButtonBounds.height - 16) / screenshotScale);
                
                robot.moveMouseSmooth(x, y);
                robot.mouseClick('left', false);

                sleep.msleep(1500);

                robot.mouseClick('left', false);

                robot.moveMouseSmooth(x - 300, y - 300);
            }
        }
        else if (pokeplanet.isOnLearnMoveScreen) {
            console.log('learn move screen'); 
            
            // we can close the learn move screen and keeps farming cause we can learn those moves in the Two Island
            let x = pokeplanet.learnMoveWindowTitleCloseButtonBounds.x / screenshotScale + Math.floor(Math.random() * pokeplanet.learnMoveWindowTitleCloseButtonBounds.width / screenshotScale);
            let y = pokeplanet.learnMoveWindowTitleCloseButtonBounds.y / screenshotScale + Math.floor(Math.random() * pokeplanet.learnMoveWindowTitleCloseButtonBounds.height / screenshotScale);
            
            robot.moveMouseSmooth(x, y);
            robot.mouseClick('left', false);
        }
        else if (pokeplanet.isOnBagScreen) {
            if (pokeballs.indexOf(pokeplanet.bagInfo.selectedItem) >= 0) {
                console.log('try to capture using a ' + pokeplanet.bagInfo.selectedItem);
                
                let x = pokeplanet.useItemButtonBounds.x / screenshotScale + Math.floor(Math.random() * pokeplanet.useItemButtonBounds.width / screenshotScale);
                let y = pokeplanet.useItemButtonBounds.y / screenshotScale + Math.floor(Math.random() * pokeplanet.useItemButtonBounds.height / screenshotScale);
                
                robot.moveMouseSmooth(x, y);
                robot.mouseClick('left', false);

                sleep.msleep(500);
            }
            else {
                console.log('selected item is not a pokeball, let\'s see the next one');
                
                let x = pokeplanet.bagNextItemButtonBounds.x / screenshotScale + Math.floor(Math.random() * pokeplanet.bagNextItemButtonBounds.width / screenshotScale);
                let y = pokeplanet.bagNextItemButtonBounds.y / screenshotScale + Math.floor(Math.random() * pokeplanet.bagNextItemButtonBounds.height / screenshotScale);
                
                robot.moveMouseSmooth(x, y);
                robot.mouseClick('left', false);

                sleep.msleep(500);
            }
        }
        else {
            robot.keyToggle('w', 'up');
            robot.keyToggle('a', 'down');
            sleep.msleep(250);
            robot.keyToggle('a', 'up');
            robot.keyToggle('s', 'down');
            sleep.msleep(250);
            robot.keyToggle('s', 'up');
            robot.keyToggle('d', 'down');
            sleep.msleep(250);
            robot.keyToggle('d', 'up');
            robot.keyToggle('w', 'down');
            sleep.msleep(250);
        }
    }

    loop++;
 
}
