import MockApi from './__mocks__/mock_api';
import BirthdayApi from './birthdayApi';
const Discord = require('discord.js');
require('dotenv').config();

// Environment Variables
const prefix = process.env.PREFIX;
const token = process.env.CLIENT_TOKEN;
const channelId = process.env.CHANNEL_ID;
const roleId = process.env.ROLE_ID;
const environment = process.env.ENVIRONMENT;

const client = new Discord.Client();
const api = environment == "production" ? new BirthdayApi() : new MockApi()

client.on('ready', () => {
    console.log('Ready!');
});

client.on('presenceUpdate', presenceUpdate => {
    var datetime = new Date();
    var birthdayChannel = presenceUpdate.guild.channels.get(channelId)

    presenceUpdate.guild.members.forEach((member) => {
        var birthday = api.getBirthday(discordId)
        if(birthday.month == datetime.getMonth()) {
            member.addRole(roleId);
            if(birthday.date == datetime.getDate() && !(!!+birthday.celebrated)) {
                birthdayChannel.send(`Happy Birthday! ` + "<@" + member.id + ">");
                api.updateBirthdayCelebration(true);
            }
        }
        else if(member.hasRole(roleId)) {
            member.removeRole(roleId);
            api.updateBirthdayCelebration(false);
        }
    })  
});

client.on('message', message => {
    if (message.content === `${prefix}acez`) {
        message.channel.send(`WHAT DID YOU SAY?!`);
    }
});

client.login(token);