class MockApi {
    constructor(){
        this.birthdays = [
            {
                "id": "1",
                "discord_id": "280187651221487617",
                "user": "AceZ",
                "month": "2",
                "date": "19",
                "celebrated": "0"
            }
        ];
    }

    getBirthdays() {
        return this.birthdays;
    }

    updateBirthdayCelebration(discordId, hasCelebrated){
        this.birthdays[0].celebrated = hasCelebrated ? "1" : "0";
    }

    getBirthday(discordId) {
        return this.birthdays[0];
    }
}

module.exports = MockApi;
