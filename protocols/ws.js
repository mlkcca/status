const ws = require("ws");
const settings = require('../settings');
const Req = require('./req');
const url = 'wss://pubsub1.mlkcca.com/ws/push/'+settings.milkcocoa.appId+'/'+settings.milkcocoa.apiKey+'?c=status-ws';

var socket = new ws(url);
var isOpen = false;

socket.on('open',function() {
	isOpen = true;
});

socket.on('close',function() {
	isOpen = false;
});

socket.on('message',function(data,flags) {
	var params = JSON.parse(String(data));
	var value = JSON.parse(params[0][2]);
	Req.ack(value.id);
});

socket.on('error', function(err) {
});

module.exports = function(cb, ack_callback) {
	if(isOpen) {
		var id = Req.req(cb);
		socket.send(JSON.stringify({id:id}));
	}else{
		cb(3);
	}
}