# time-bot
A simple node irc bot that will track time. This is very much a hacky project where I'm experimenting with node and mongodb, so it will never be a bastion of stability and perfect coding practices. 

## Configuration
Rename config-example.js to config.js and change the settings for your irc server & channel

## mongodb
Currently uses a local mongodb server, and is stuffing things into the test database. Mongo config will be moved to config.js over time.

## Commands
timebot listens to a few commands in the irc channel

`timer-start` will start a timer for the user who sent the message

`timer-stop` will stop the timer and send a message with the duration of the timer. It will also inject a record into mongodb.

### Direct Messages

`status` will report back the current duration of the active timer for the user

