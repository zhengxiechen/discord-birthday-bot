var sheetsu = require('sheetsu-node');
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

    getBirthdays() {
        this.client.read().then(function(data){
            return JSON.parse(data);
        }, function(err) {
            console.log(err);
            return null;
        });
    }

    updateBirthdayCelebration(discordId, hasCelebrated){
        this.client.update("discord_id", discordId, { celebrated: hasCelebrated ? "1" : "0" }
            .then(function(data){
                return true;
            }, function(err) {
                console.log(err);
                return false;
            }
        ));
    }

    getBirthday(discordId) {
        this.client.read({search: { "discord_id": discordId }}).then(function(data){
            return JSON.parse(data);
        }, function(err) {
            console.log(err);
            return null;
        });
    }
}

module.exports = BirthdayApi;