[![Build Status](https://travis-ci.org/lightlyss/mooncell.svg?branch=master)](https://travis-ci.org/lightlyss/mooncell)
[![Coverage Status](https://coveralls.io/repos/github/lightlyss/mooncell/badge.svg?branch=master)](https://coveralls.io/github/lightlyss/mooncell?branch=master)
# Moon Cell
![icon](img/servants/servant_166.png)
> Also called the Holy Grail, Eye of God, and Divine Automatic Recording Device.
> A massive collection of photonic crystals within the Moon that comprises a giant supercomputer.

## Description
A utility for basic lookup of Fate/Grand Order servants, supporting interaction via Discord bot.
Queries are accepted via any message that mentions the bot user.
Empty queries will be treated as random single summon requests, mostly following
the standard rates of Saint Quartz banners.

## Setup
Set an access `TOKEN` inside a `.env` file.
```bash
npm install
npm start
```

## Tests
Black-box integration tests are provided using Jest.
```bash
npm test
```
