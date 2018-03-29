# pokeplanet-farmer  [![Build Status](https://travis-ci.org/annuna01/pokeplanet-farmer.svg?branch=master)](https://travis-ci.org/annuna01/pokeplanet-farmer)

[![ezgif.com-video-to-gif.gif](https://s17.postimg.org/ebp43tc5r/ezgif.com-video-to-gif.gif)](https://postimg.org/image/53wvn453f/)

## Why do it exists?

I strongly believe that repetitive and boring processes should be done by machines. Humans should use their beautiful minds to create things that machines can't (yet). Farming in Pokemon Planet is such a repetitive task so I created this farming machine.

## What it does?

- It walk in circles until a pokemon appears
- If the pokemon was already caught then it will be killed (except for those in [catchAlways config](#config))
- If the pokemon wasn't caught it will start throwing pokeballs until the pokemon is caught (except for those in [killAlways config](#config))
- If after the battle your pokemon is trying to learn a new movement, it will be discarted

## How to use it?

1. Clone this repo
2. `npm install`
3. `npm start`

## Config

You can specity which pokemons this machine should always caught (Some rare, very rare+ maybe?) or which it should always kill. To do that you need to edit the config.json:

```json
{
    "catchAlways": [
        "Mewtwo",
    ],
    "killAlways": [
        "Ratata"
    ]
}
```

## Things to improve

- Do something when your pokemon gets killed (Change pokemon or left the battle)
- Do something when your pokemon is trying to evolve (Say yes/no)
- Don't use always the first movement to kill the already caught pokemons (Pick it based on the other pokemon type?)
- Improve use of pokeballs (Use cheapest first or pick the pokeball type based on pokemon's rarity)
- Make it run faster
- Reconnect to game when connection get lost
- Test it on Unix/Windows
- [Ideas?](https://github.com/annuna01/pokeplanet-farmer/issues/new)
