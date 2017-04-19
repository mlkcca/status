const mqtt = require('mqtt');
const settings = require('../settings');
const Req = require('./req');

function create_mqtt_option() {
    return {
        username: 'k' + settings.milkcocoa.apiKey,
        clientId: 'status-mqtt',
        password: settings.milkcocoa.appId,
        protocolId : 'MQTT',
        protocolVersion: 4,
        reconnectPeriod: 7000
    }
}

var client = mqtt.connect(
    'mqtts://pubsub1.mlkcca.com:8883',
    create_mqtt_option()
);

client.on('open', function(e) {
	console.log('open', e, new Date().toLocaleString());
})

client.on('close', function(e) {
	console.log('close', e, new Date().toLocaleString());
})

client.on('error', function(e) {
	console.log('error', e, new Date().toLocaleString());
})

module.exports = function(cb) {
	var id = Req.req(cb);
	client.publish(settings.milkcocoa.appId + '/status-mqtt', JSON.stringify({
		time: new Date().getTime(),
		data: make_data()
	}), function(e) {
		//console.log('ack', id);
		Req.ack(id);
	}, {qos: 1});
}

function make_data() {
	function str() {
		var str = '';
		for(var i=0;i < 500;i++) {
			str += String(i%10);
		}
		return str;
	}
	function num() {
		return Math.random() * 100000;
	}
	return {
		value_1: str(),
		value_2: num(),
		value_3: str(),
		value_4: num(),
		value_5: num(),
		value_6: num()
	}
}