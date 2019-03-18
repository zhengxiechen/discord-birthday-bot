import MockApi from './__mocks__/mock_api';
import BirthdayApi from './birthdayApi';
const Discord = require('discord.js');
require('dotenv').config();

// Environment Variables
const prefix = process.env.PREFIX;
const token = process.env.CLIENT_TOKEN;
const channelID = process.env.CHANNEL_ID;
const roleID = process.env.ROLE_ID;
const environment = process.env.ENVIRONMENT;

const client = new Discord.Client();
const api = environment == "production" ? new BirthdayApi() : new MockApi()

client.on('ready', () => {
    console.log('Ready!');
});

client.on('presenceUpdate', presenceUpdate => {
    var datetime = new Date();  // return month and date
    var birthdayChannel = presenceUpdate.guild.channels.get(channelID) // get #birthday-only channel

    api.getBirthdays();

    presenceUpdate.guild.members.forEach((member) => {
        if(api.isBirthdayMonth(member)) {
            member.addRole(roleID);
            if(api.needsCelebration(member)) {
                birthdayChannel.send(`Happy Birthday! ` + "<@" + member.id + ">");
                api.celebrate();
            }
        }
        else if(member.hasRole(roleID)) {
            member.removeRole(roleID);
            api.cancelCelebration();
        }
    })  
});

client.on('message', message => {
    if (message.content === `${prefix}acez`) {
        message.channel.send(`WHAT DID YOU SAY?!`);
    }
});

client.login(token);