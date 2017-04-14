const Milkcocoa = require('mlkcca');
const settings = require('../settings');

var milkcocoaConfig = Object.assign({}, settings.milkcocoa, {
    uuid: 'status-sdk'
})

var milkcocoa = new Milkcocoa(milkcocoaConfig);
var ds = milkcocoa.dataStore('status-sdk')
var counter = 0;
var callbacks = [];

ds.on('push', function(e) {
	var counter = e.value.counter;
	var time = e.value.time;
	var delay = new Date().getTime() - time;
	if(callbacks[counter]) {
		var cb = callbacks[counter].cb
		var timer = callbacks[counter].timer
		if(timer) clearTimeout(timer);
		if(cb) cb( (delay < 250)?1:2 );
		callbacks[counter] = null;
	}
});

module.exports = function(cb, ack_callback) {
	ds.push({
		time: new Date().getTime(),
		counter: counter,
		data: make_data()
	}, ack_callback);
	callbacks[counter] = {
		timer: setTimeout(timeout_callback(cb), 10000),
		cb: cb
	}
	counter++;
	if(counter > 60 * 60 * 2) counter = 0;
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