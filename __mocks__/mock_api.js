import fs from 'fs';
const birthdayFile = require('./birthdays.json');


class MockApi {
    birthdays = null;
    
    getBirthdays() {
        if(this.birthdays) {
            return this.birthdays;
        }
        fs.readFile(birthdayFile, (err, data) => {  
            if (err) throw err;
            this.birthdays = JSON.parse(data);
        });
        return this.birthdays;
    }

    updateBirthdays(birthdays){
        fs.writeFileSync(birthdayFile, JSON.stringify(birthdays, null, 2), function (err) {
            if (err) return console.log(err);
        });
    }

    isBirthdayMonth(discordId){
        // Search
        return true;
    }

    needsCelebration(member) {
        return true;
    }

    celebrate(){
        birthdays.members[`${member.id}`].celebrated = "1";
        updateBirthdays(birthdays);
    }

    cancelCelebration(){
        birthdays.members[`${member.id}`].celebrated = "0";
        updateBirthdays(birthdays);
    }
}

export default MockApi;
