const Discord = require('discord.js');
const fs = require('fs');
const { prefix, token, channelID, roleID } = require('./config.json');
const birthdayFile = './birthday.json';
const birthday = require(birthdayFile);
const client = new Discord.Client();

client.on('ready', () => {
    console.log('Ready!');
});

client.on('presenceUpdate', presenceUpdate => {
    var datetime = new Date();  // return month and date
    var birthdayChannel = presenceUpdate.guild.channels.get(channelID) // get #birthday-only channel

    fs.readFile(birthdayFile, (err, data) => {  
        if (err) throw err;
        const birthday = JSON.parse(data);
    });

    presenceUpdate.guild.members.forEach((member) => {
        // check if the discord member is in our database
        if(birthday.members[`${member.id}`]) {
            // if is in birthday month, assign role
            if(birthday.members[`${member.id}`].month == datetime.getMonth()) {
                member.addRole(roleID);
                if(birthday.members[`${member.id}`].date == datetime.getDate()  && birthday.members[`${member.id}`].celebrated == "0") {
                    birthdayChannel.send(`Happy Birthday! ` + "<@" + member.id + ">");
                    birthday.members[`${member.id}`].celebrated = "1";
                    fs.writeFileSync(birthdayFile, JSON.stringify(birthday, null, 2), function (err) {
                        if (err) return console.log(err);
                    });
                }
          } else if( birthday.members[`${member.id}`].month == datetime.getMonth() - 1 || birthday.members[`${member.id}`].month == datetime.getMonth() + 11) {
                member.removeRole(roleID);
                birthday.members[`${member.id}`].celebrated = "0";
                fs.writeFileSync(birthdayFile, JSON.stringify(birthday, null, 2), function (err) {
                    if (err) return console.log(err);
                });
            }
        }
    })  
});

// Some of the testing commands for future uses
/*
client.on('message', message => {
    // grabbing member objects, including username, ID etc.
    if (message.content === `${prefix}member`) {
        message.guild.members.forEach((member) => {
            message.channel.send(`Channel name: ${channel.name} - ${channel.id}`);
            message.channel.send(`${member.user} - ${member.id}`)
        })
    }

    // grabbing channel info
    if (message.content === `${prefix}channel`) {
        message.guild.members.forEach((channel) => {
            message.channel.send(`Channel name: ${channel.name} - ${channel.id}`);
        })
    }

    // grabbing server roles info
    if (message.content === `${prefix}roles`) {
        message.guild.roles.forEach((role) => {
            message.channel.send(`${role.name} - ${role.id}`)
        })
    }
    
    // send message to specific channel
    if (message.content === `${prefix}birthday`) {
        var generalChannel = message.guild.channels.get(channelID) // Replace with known channel ID
        generalChannel.send("Happy Birthday!") 
        
    }
});
*/

client.login(token);