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

    updateBirthdayCelebration(discordId, hasCelebrated){
        // TODO
        // fs.writeFileSync(birthdayFile, JSON.stringify(birthdays, null, 2), function (err) {
        //     if (err) return console.log(err);
        // });
    }

    getBirthday(discordId) {
        // TODO
    }
}

export default MockApi;
