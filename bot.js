const MockApi = require('./__mocks__/mock_api.js');
const BirthdayApi = require('./birthdayApi.js');
const Discord = require('discord.js');
require('dotenv').config();

// Environment Variables
const prefix = process.env.PREFIX;
const token = process.env.CLIENT_TOKEN;
const channelId = process.env.CHANNEL_ID;
const roleId = process.env.ROLE_ID;
const environment = process.env.ENVIRONMENT;

const client = new Discord.Client();
const api = environment == "PRODUCTION" ? new BirthdayApi() : new MockApi()

client.on('ready', () => {
    console.log('Ready!');
    var getBirthdaysPromise = api.getBirthdays();
    getBirthdaysPromise.then(function(result) {
        var birthdays = result;
        console.log(birthdays)
    }, function(err) {
        console.log(err);
    })
    // console.log(api.getBirthdays());
});

client.on('presenceUpdate', presenceUpdate => {
    var datetime = new Date();
    var birthdayChannel = presenceUpdate.guild.channels.get(channelId)

    presenceUpdate.guild.members.forEach((member) => {
        var birthday = api.getBirthday(member.id);
        console.log(birthday);
        if(birthday) {  // member's birthday info is on file
            console.log(birthday);
            if(birthday.month == datetime.getMonth()) {
                member.addRole(roleId);
                if(birthday.date == datetime.getDate() && !(!!+birthday.celebrated)) {
                    console.log("MESSAGE SENT");
                    // birthdayChannel.send(`Happy Birthday! ` + "<@" + member.id + ">");
                    api.updateBirthdayCelebration(member.id, true);
                }
            }
            else {
                member.removeRole(roleId);
                api.updateBirthdayCelebration(member.id, false);
            }
        }
    })  
});

client.on('message', message => {
    if (message.content === `${prefix}acez`) {
        message.channel.send(`WHAT DID YOU SAY?!`);
    }
});

client.login(token);