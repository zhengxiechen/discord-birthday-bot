var sheetsu = require('sheetsu-node');
require('dotenv').config();
const ApiAddress = process.env.API_ADDRESS;
const ApiKey = process.env.API_KEY;
const ApiSecret = process.env.API_SECRET;

class BirthdayApi {
    constructor (){
        var config = {
            address: ApiAddress,
            // TODO Add for better security
            // api_key: ApiKey
            // api_secret: ApiSecret
        }
        this.client = sheetsu(config)
    }

    async getBirthdays() {
        var birthdays = null;
        try {
            var response = await this.client.read().then(function(data){
                return JSON.parse(data);
            }, function(err) {
                console.log(err);
                throw err;
            });
            birthdays = this.format(response);
        } catch(error){
            console.warn(error);
        }
        return birthdays;
    }

    async getBirthdayByMonth(month) {
        var birthdays = null;
        try {
            var response = await this.client.read({search: { "month": month }}).then(function(data){
                return JSON.parse(data);
            }, function(err) {
                console.log(err)
                throw err;
            });
            birthdays = this.format(response);
        } catch(error){
            console.warn(error);
        }
        return birthdays;
    }

    format(response) {
        if(!response || !Array.isArray(response)) {
            return null;
        }  
        var result = response.reduce((map, obj) => {
            map[obj.discord_id] = { ...obj, celebrated: false };
            return map;
        }, {});
        return result;
    }
}

module.exports = BirthdayApi;