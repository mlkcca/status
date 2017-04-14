const ws = require("ws");
const settings = require('../settings');
const Req = require('./req');
const url = 'wss://pubsub1.mlkcca.com/ws/push/'+settings.milkcocoa.appId+'/'+settings.milkcocoa.apiKey+'?c=status-ws';

var isOpen = false;
var socket = null;

function start_connect() {
	socket = new ws(url);

	socket.on('open',function() {
		isOpen = true;
	});

	socket.on('close',function() {
		isOpen = false;
		setTimeout(function() { start_connect(); }, 3000); 
	});

	socket.on('message',function(data,flags) {
		var params = JSON.parse(String(data));
		var value = JSON.parse(params[0][2]);
		Req.ack(value.id);
	});

	socket.on('error', function(err) {
		console.error(err);
		isOpen = false;
		setTimeout(function() { start_connect(); }, 3000); 
	});

}

start_connect();

module.exports = function(cb, ack_callback) {
	if(isOpen) {
		var id = Req.req(cb);
		socket.send(JSON.stringify({id:id}));
	}else{
		cb(3);
	}
}