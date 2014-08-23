#!/usr/bin/env node

var irc = require('irc');
var moment = require('moment');
var mongoose = require('mongoose');
var models = require('./models')(mongoose);
var setup = require('./config');

console.log(setup.config);

var bot = new irc.Client(setup.config.server, setup.config.botName, {
    debug: true,
    port:6667,
    secure:true,
    password: setup.config.password,
    channels: setup.config.channels,
});

var dbShared;

var timers = {};

bot.addListener('registered', function(msg){
  //bot connected - setup the mongo connection
  console.log('Connected... setting up mongo connection...');

  mongoose.connect('mongodb://localhost/test');
  
  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback () {
    console.log('connected to mongo...');
    dbShared = db;
  });

});

bot.addListener('error', function(message) {
    console.error('ERROR: %s: %s', message.command, message.args.join(' '));
});

// bot.addListener('message#bothack', function (from, message) {

// });

bot.addListener('message', function (from, to, message) {
    //console.log('%s => %s: %s', from, to, message);

    //auto start a timer for user
    if(setup.config.autoTrackNicks.indexOf(from) > -1){
      if(!timers[from]){
        console.log('starting timer for ' + from);
        bot.say(to, from + ' work timer auto-started... ');
        timers[from]= new models.Timer({ user: 'dbouwman' });
        timers[from].start();
      }
    }

    if ( to.match(/^[#&]/) ) {
      // channel message
      if ( message.match(/timer-start/i) ) {
          
          if(!timers[from]){
            timers[from]= new models.Timer({ user: 'dbouwman' });
            timers[from].start();
            bot.say(to, from + ' work timer started... ');
          }else{
            bot.say(to, from + ' timer already started ' + moment.duration( timers[from].runningFor() ).humanize() + ' ago.');
          }
      }

      if ( message.match(/timer-end/i) ) {
          timers[from].stop();
          //save it
          timers[from].save(function(err,obj){
            bot.say(to, from + ' your timer stopped. You worked ' + moment.duration(timers[from].duration).humanize());
            //nuke it from the active set
            delete timers[from];
          });
      }

    } else {
        // private message
    }
});

bot.addListener('pm', function(nick, message) {
    console.log('Got private message from %s: %s', nick, message);
    if(message == 'stop'){
      //store all timers
    }
    if(message == 'status'){
      if(timers[nick]){
        bot.say(nick, 'Timer started ' + moment.duration( timers[nick].runningFor() ).humanize() + ' ago.');
      }else{
        bot.say(nick, "You don't have any timers started. Use 'timer-start' in the channel and I will start one up for you.");
      }
    }
});

bot.addListener('join', function(channel, who) {
    console.log('%s has joined %s', who, channel);
    //dont' start timers on join - too many clients connect w/o user doing anything
});

bot.addListener('part', function(channel, who, reason) {
  
    console.log('%s has left %s: %s', who, channel, reason);
});


bot.addListener('kick', function(channel, who, by, reason) {
    console.log('%s was kicked from %s by %s: %s', who, channel, by, reason);
});

// bot.disconnect('later skater', function(){
//   console.log('Left channel - close mongo connection here');
// });