const Milkcocoa = require('mlkcca');
const settings = require('../settings');
const Req = require('./req');

var milkcocoaConfig = Object.assign({}, settings.milkcocoa, {
    uuid: 'status-sdk'
})

var milkcocoa = new Milkcocoa(milkcocoaConfig);
var ds = milkcocoa.dataStore('status-sdk');

ds.on('push', function(e) {
	var counter = e.value.counter;
	Req.ack(counter);
});

module.exports = function(cb, ack_callback) {
	var id = Req.req(cb);
	ds.push({
		time: new Date().getTime(),
		counter: id,
		data: make_data()
	}, ack_callback);
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