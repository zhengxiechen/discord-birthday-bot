class MockApi {
    constructor(){
        this.birthdays = {
            235088799074484224: {
                "discord_id": "235088799074484224",
                "user": "John Smith",
                "month": "3",
                "date": "19",
                "celebrated": "0"
            }
        };
    }

    async getBirthdays() {
        return this.birthdays;
    }

    async getBirthdayByMonth(month) {
        return this.birthdays;
    }
}

module.exports = MockApi;
