# GroupMe NodeJS Callback Bot for Clash of Clans

## Introduction

This bot is was intended to be used in a GroupMe chat for my clan in the popular mobile game [Clash of Clans](http://supercell.com/en/games/clashofclans/). This is a fork of [batorobe's bot](https://github.com/batorobe/bot-tutorial-nodejs-rMA32), which was forked from https://github.com/groupme/bot-tutorial-nodejs.

I have modified it specifically for our clan, but includes some useful features the anyone could use. The bot can be set up using a free service called [Heroku](https://dashboard.heroku.com/apps). However there is one fatal limitation. The bot will be put to sleep after periods of inactivity. This causes one of the main functions to fail - Saving a clashcaller link and being able to recall it at a later time. However it is possible to set this bot up on a server which will allow the bot to run 24/7. I will include instructions here in the future.

I will not include general set-up and usage instructions here as they are covered well in batorobe's fork.
