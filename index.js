const child_process = require("child_process");
const upload_status = require('./upload_status');

var workers = [];

var prefix_str = process.argv[2] || 'local'
var prefix = prefix_str + '-';

var num_process = Number(process.argv[3] || '1');

create_worker(1, 'worker.js', ['sdk']);
create_worker(1, 'worker.js', ['mqtt']);
create_worker(1, 'worker.js', ['ws']);

function create_worker(workerId, file, args) {
	var worker = child_process.fork(__dirname + "/" + file, args);
	worker.on('message', function(message) {
		upload_status(message.t, message.p)
	});
	worker.on('exit', function(e) {
		console.error('exit ' + file, e);
		setTimeout(function() {
			create_worker(workerId, file, args);
		}, Math.floor(Math.random()*1000));
	});
	workers.push(worker);
}

function kill_all() {
	workers.forEach(function(w) {
		w.disconnect();
		w.kill();
	});
}

process.on('uncaughtException', (err) => {
	console.error('uncaughtException', err);
});
