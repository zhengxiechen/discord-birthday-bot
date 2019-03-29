const MockApi = require('./api/__mocks__/mock_api.js');
const BirthdayApi = require('./api/birthdayApi.js');
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

let birthdays = null;
async function updateBirthdays (){
    birthdays = await api.getBirthdays();
    console.info(`Updated birthdays.`)
}

client.on('ready', async () => {
    console.info('Bot Ready!');
    await updateBirthdays();
});

client.on('presenceUpdate', presenceUpdate => {
    if(!birthdays){
        console.warn('Birthdays is empty when updating.');
        return;
    }
    var datetime = new Date();
    var offset = -300; //Timezone offsetfor EST in minutes
    var estDateTime = new Date(datetime.getTime() + offset*60*1000);
    var birthdayChannel = presenceUpdate.guild.channels.get(channelId)

    presenceUpdate.guild.members.forEach((member) => {
        var birthday = birthdays[`${member.id}`]
        if(birthday) {
            if(birthday.month == estDateTime.getMonth()) {
                member.addRole(roleId);
                if(birthday.date == estDateTime.getDate() && !(!!+birthday.celebrated)) {
                    birthdayChannel.send(`Happy Birthday! ` + "<@" + member.id + ">");
                    birthday.celebrated = true;
                }
            }
            else {
                member.removeRole(roleId);
                birthday.celebrated = false;
            }
        }
    })  
});

client.on('message', async(message) => {
    switch(message.content){
        case `${prefix}acez`:
            message.channel.send(`WHAT DID YOU SAY?!`);
            break;
        case `${prefix}update-birthdays`:
            message.channel.send('Update Birthdays for bot');
            await updateBirthdays();
            break;
        default:
            break;
    }
});

client.login(token);