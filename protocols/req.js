function Request() {
	var callback = null;
	var time = null;
	var timer = null;
	return {
		req: function(cb) {
			callback = cb;
			time = new Date();
			timer = setTimeout(function() {
				callback(3);
			}, 10000);
		},
		ack: function() {
			if(timer) clearTimeout(timer);
			var delay = new Date().getTime() - time.getTime();
			if(callback) callback(delay < 250 ? 1 : 2);
		}
	}
}

module.exports = {
	id: 0,
	reqs: [],
	req: function(cb) {
		var id = this.id;
		var req = new Request();
		req.req(cb);
		this.reqs[id] = req;
		this.id++;
		return id;
	},
	ack: function(id) {
		if(this.reqs[id]) this.reqs[id].ack();
		delete this.reqs[id];
	}
}