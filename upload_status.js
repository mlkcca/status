var PubNub = require('pubnub')
var settings = require('./settings')

var pubnub = new PubNub({
    publishKey : settings.pubnub.publishKey,
    subscribeKey : settings.pubnub.subscribeKey
})

module.exports = function(channel, message) {
    var publishConfig = {
        channel : channel,
        message : message
    }
    pubnub.publish(publishConfig, function(status, response) {
    	
    });
}