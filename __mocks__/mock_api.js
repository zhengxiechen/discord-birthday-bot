const fs = require('fs');
const birthdayFile = require('./birthdays.json');


class MockApi {
    getBirthdays() {
        fs.readFile(birthdayFile, (err, data) => {  
            if (err) throw err;
            return JSON.parse(data);
        });
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

module.exports = MockApi;
