class MockApi {
    constructor(){
        this.birthdays = [
            {
                "id": "1",
                "discord_id": "235088799074484224",
                "user": "John Smith",
                "month": "3",
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
