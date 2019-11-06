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
let monthBirthdays = null;
let monthCeleMessage = "";
let monthCelebrated = false;

let datetime = null;
let offset = -300; //Timezone offset for EST in minutes
let estDateTime = null;

async function updateBirthdays (){
    birthdays = await api.getBirthdays();
    console.info(`Updated birthdays.`)
}

async function updateBirthdaysByMonth(month) {
    monthBirthdays = await api.getBirthdayByMonth(month);
}

function cleanupEachMonth(guild) {
    if(birthdays) {
        Object.keys(birthdays).forEach((id) => {
            guild.member(id).removeRole(roleId);
            birthdays[`${id}`].celebrated = false;
        })
    }
}

async function sendCelebrationByMonth(guild, month, birthdayChannel) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];
    monthCeleMessage = 'Supreme Overlords for ' + `${monthNames[month]} ` + 'are ... ' + '\n';
    await updateBirthdaysByMonth(month);
    if(monthBirthdays) {
        var month = month + 1;
        Object.keys(monthBirthdays).forEach((id) => {
            var date = monthBirthdays[`${id}`].date;
            monthCeleMessage += "<@" + id + ">" + " " + "-" + " "
                +`${month}.`
                + date
                + "\n";
            guild.member(id).addRole(roleId);
        })
    } else {
        monthCeleMessage += "none :'(" + "\n";
    }
    birthdayChannel.send(monthCeleMessage);
}

async function sendCelebration(guild) {
    const birthdayChannel = guild.channels.get(channelId);
    guild.members.forEach((member) => {
        var birthday = birthdays[`${member.id}`];
        if(birthday) {
            if(birthday.month == estDateTime.getMonth()) {
                if(birthday.date == estDateTime.getDate() && !(!!+birthday.celebrated)) {
                    birthdayChannel.send(`Happy Birthday! ` + "<@" + member.id + ">");
                    birthday.celebrated = true;
                }
            }
        }
    })
}

async function getDate() {
    datetime = new Date();
    estDateTime = new Date(datetime.getTime() + offset*60*1000);
}

client.on('ready', async () => {
    console.info('Bot Ready!');
    await getDate();
    setInterval(getDate, 1000*3600);
    await updateBirthdays();
});

client.on('presenceUpdate', async(presenceUpdate) => {
    if(!birthdays){
        console.warn('Birthdays is empty when updating.');
        return;
    }
    var birthdayChannel = presenceUpdate.guild.channels.get(channelId);

    if(estDateTime.getDate() == 1 && !monthCelebrated) {
        cleanupEachMonth(presenceUpdate.guild);
        await sendCelebrationByMonth(presenceUpdate.guild, estDateTime.getMonth(), birthdayChannel);
        monthCelebrated = true;
    }

    if(estDateTime.getDate() == 2) {
        monthCelebrated = false;
    }

    await sendCelebration(presenceUpdate.guild);
});

client.on('message', async(message) => {
    switch(message.content){
        case `${prefix}acez`:
            message.channel.send(`WHAT DID YOU SAY?!`);
            break;
        case `${prefix}members`:
            let membersID = '';
            message.guild.members.forEach((member) =>{
                membersID += member.displayName + ':  ' + member.id + '\n';
            })
            message.channel.send(membersID);
            break;
        case `${prefix}channels`:
            let channelsID = '';
            message.guild.channels.forEach((channel) =>{
                channelsID += channel.name + ':  ' + channel.id + '\n';
            })
            message.channel.send(channelsID);
            break;
        case `${prefix}roles`:
            let rolesID = '';
            message.guild.roles.forEach((role) =>{
                rolesID += role.name + ':  ' + role.id + '\n';
            })
            message.channel.send(rolesID);
            break;
        case `${prefix}send-celebration`:
            await sendCelebration(message.guild);
            break;
        case `${prefix}remind-birthdays`:
            await sendCelebrationByMonth(message.guild, estDateTime.getMonth(), message.guild.channels.get(channelId));
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