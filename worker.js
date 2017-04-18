//type is sdk | ws | mqtt
var type = process.argv[2];

var protocol = require('./protocols/' + type)
var status_pool = [];

function start() {
	setInterval(function() {
		reqest(function(status) {
			//ok
			status_pool.push(status);
		}, function() {

		});
	}, 1000);
	setInterval(function() {
		var status = status_pool.reduce((acc, item) => {
			if(item == 1) acc.s++;
			else if(item == 2) acc.w++;
			else if(item == 3) acc.e++;
			return acc;
		}, {s:0, w:0, e:0});
		send_to_master({s:status});
		status_pool = [];
	}, 60 * 1000);

}

function reqest(cb, ack) {
	protocol(cb, ack);
}

function send_to_master(params) {
	process.send({t:type, p:params});
}

start();
