const dotenv = require('dotenv')
const tmi = require('tmi.js');
const axios = require('axios');

dotenv.config()
console.log(process.env.BOT_USERNAME)

const BOT_USERNAME = process.env.BOT_USERNAME
const CHANNEL_NAME = process.env.CHANNEL_NAME
const OAUTH_TOKEN = process.env.OAUTH_TOKEN

const opts = {
    identity: {
      username: BOT_USERNAME,
      password: OAUTH_TOKEN
    },
    channels: [
      CHANNEL_NAME
    ]
  };

const client = tmi.client(opts);

client.on('message',onMessageHandler);
client.on('connected',onConnectedHandler);


client.connect();

function onMessageHandler(target, context, msg, self){
    //if (self) { return; } 
    const commandName = msg.trim();

    // If the command is known, let's execute it
    switch(commandName){
        case "!commands":
            client.say(target,`
                Available Commands:
                !dice - Roll a dice
                !tellmeajoke - Get a special joke from Chuck Norris.
            `)
        break;            
        case "!dice":
            const num = rollDice();
            client.say(target, `You rolled a ${num}`);
        break;
        case "!tellmeajoke":
            getAJoke(target)
        break;
    }
}

function getAJoke(target){
    axios.get('https://icanhazdadjoke.com/',{
        headers:{
            'Accept': 'application/json'
        }
    }).then((response)=>{
        var data = response.data
        var joke = data.joke;
        client.say(target, joke);
    });
}

function followMyTwitchChannel(){
    client.say(CHANNEL_NAME,'Support my channel by following. Thank you!')
}

function rollDice(){
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1; 
}

function onConnectedHandler(addr, port){
    console.log(`* Connected to ${addr}:${port}`);
    setInterval(followMyTwitchChannel,60000)
}