const mqtt = require('mqtt');
const settings = require('../settings');

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


module.exports = function(cb) {
	var timer = setTimeout(timeout_callback(cb), 10000);
	var time = new Date().getTime();
	client.publish('status-mqtt', JSON.stringify({
		time: new Date().getTime(),
		data: make_data()
	}), function() {
		if(timer) clearTimeout(timer);
		var delay = new Date().getTime() - time;
		cb( (delay < 250)?1:2 );
	}, {qos: 1});
}

function timeout_callback(cb) {
	return function() {
		cb(3);
	}
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