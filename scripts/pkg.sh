#!/bin/bash

pkg src/index.js --targets node8-macos-x64 --output dist/pokeplanet-farmer
cp node_modules/deasync/bin/darwin-x64-node-8/deasync.node dist/
cp node_modules/robotjs/build/Release/robotjs.node dist/
cp node_modules/sleep/build/Release/node_sleep.node dist/