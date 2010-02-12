
Array.prototype.map = function(fn) {
	var res = new Array(this.length);
	switch(fn.length) {
	case 1:
		for(var i=0; i<this.length; i++)
			if(this[i]!=undefined)
				res[i] = fn.call(this, this[i]);
		return res;
	case 2:
		for(var i=0; i<this.length; i++)
			if(this[i]!=undefined)
				res[i] = fn.call(this, i, this[i]);
		return res;
	default:
		throw new Error("Invalid function.");
	}
}

Array.prototype.foreach = function(fn) {
	switch(fn.length) {
	case 1:
		for(var i=0; i<this.length; i++)
			if(this[i]!=undefined)
				fn(this[i]);
		break;
	case 2:
		for(var i=0; i<this.length; i++)
			if(this[i]!=undefined)
				fn(i, this[i]);
		break;
	default:
		throw new Error("Invalid function.");
	}
	return this;
}

Array.prototype.filter = function(fn) {
	var res = new Array();
	switch(fn.length) {
	case 1:
		for(var i=0; i<this.length; i++)
			if(this[i]!=undefined)
				if(fn(this[i]))
					res[res.length] = this[i];
		return res;
	case 2:
		for(var i=0; i<this.length; i++)
			if(this[i]!=undefined)
				if(fn(i, this[i]))
					res[res.length] = this[i];
		return res;
	default:
		throw new Error("Invalid function.");
	}
}

Array.prototype.last = function() {
	return this.length ? this[this.length-1] : undefined;
}

Array.prototype.first = function() {
	return this.length ? this[0] : undefined;
}

Array.prototype.accumulate = function(start, fn) {
	var res = start;
	for(var i=0; i<this.length; i++)
		if(this[i]!=undefined)
			res = fn(res, this[i]);
	return res;
}

Array.fromObject = function(obj) {
	if(obj instanceof Array)
		return obj;
	var res = new Array(obj.length);
	for(var i=0; i<obj.length; i++)
		res[i] = obj[i];
	return res;
}

Object.prototype.extend = function(obj) {
	for(var i in obj)
		this[i] = obj[i];
	return this;
}

Object.extend = function(o1, o2) {
	for(var i in o2)
		o1[i] = o2[i];
	return o1;
}

var $uid = function() {
	return ($uid.cnt++).toString() + "-" + Math.random() + "-" + (new Date()).getTime();
}

$uid.cnt = 0;

Array.prototype.group = function(fn) {
	var res = [];
	if(fn.length==2) {
		this.foreach(function(i, el) {
			var group = fn(i, el);
			if((typeof group)=='number' || (typeof group)=='string') {
				if(res[group]==undefined)
					res[group] = [el];
				else
					res[group].push(el);
			}
		});
	} else {
		this.foreach(function(el) {
			var group = fn(el);
			if((typeof group)=='number' || (typeof group)=='string') {
				if(res[group]==undefined)
					res[group] = [el];
				else
					res[group].push(el);
			}
		});
	}
	return res;
}

Array.prototype.indexOf = function(p) {
	if(typeof p == 'function') {
		if(p.length==1) {
			for(var i=0; i<this.length; i++) {
				if(this[i]!=undefined && p(this[i]))
					return i;
			}
		} else {
			for(var i=0; i<this.length; i++) {
				if(this[i]!=undefined && p(i, this[i]))
					return i;
			}
		}
	} else {
		for(var i=0; i<this.length; i++)
			if(this[i]==p)
				return i;
	}
	return null;
}

Array.prototype.removeEmpty = function() {
	return this.filter(function(v) {
		return true;
	});
}

Array.prototype.empty = function() {
	return this.length==0;
}

Array.generate = function(first, getNext, n) {
	var res = [first];
 	for(var i = 1; i<n || n==-1; i++) {
		var tmp = getNext(res[i-1]);
		if(tmp==undefined && n==-1)
			return res;
		else
			res[i] = tmp;
 	}
	return res;
}

Array.prototype.randomElement = function() {
	return this[Math.floor(Math.random()*this.length)];
}

Array.prototype.shuffle = function() {
	var res = Array.fromObject(this);
	function swap(x1, x2) {
		var tmp = res[x1];
		res[x1] = res[x2]
		res[x2] = tmp;
	}
	for(var i=0; i<res.length; i++)
		swap(i, Math.floor(Math.random()*res.length));
	return res;
}

var $range = function(start, end /*, step*/) {
	var res = [];
	var inc = start>end ? -1 : 1;
	if(arguments.length==3)
		inc = arguments[2];
	for(var i=start; i<end; i+=inc)
		res.push(i);
	return res;
}

Array.prototype.timerMap = function(fn, cnt) {
	if(cnt<=0)
		cnt = 5;
	var i=-1;
	var arr = this;
	var res_fn = $handler();
	var res = [];
	var tm = window.setInterval(function() {
		var j = cnt;
		while(j--) {
			do { i++; } while(i<arr.length && arr[i]==undefined);
			if(i<arr.length)
				res[i] = fn.length==1 ? fn(arr[i]) : fn(i, arr[i]);
			else {
				res_fn(res);
				if(tm!=null) {
					window.clearInterval(tm);
					tm = null;
				}
			}
		}
	}, 10);
	return {
		position: function() {
			return i;
		},
		finished: function() {
			return tm==null;
		},
		cancel: function() {
			window.clearInterval(tm);
			tm = null;
		},
		onfinish: res_fn
	}
}


function $handler() {
	var res = Object.extend(function() {
			var args = Array.fromObject(arguments);
			var obj = this;
			arguments.callee.handlers_once.foreach(function(v) {
				v.apply(obj, args)
			})
			arguments.callee.handlers_once = []
			arguments.callee.handlers.foreach(function(v) {
				v.apply(obj, args)
			})
		}, {
			handlers: [],
			handlers_once: [],
			once: function(fn) {
				this.handlers_once = this.handlers_once.filter(function(v) {
					return v!=fn
				})
				this.handlers_once.push(fn)
				return res;
			},
			add: function(fn) {
				this.remove(fn)
				this.handlers.push(fn)
				return res
			},
			remove: function(fn) {
				this.handlers = this.handlers.filter(function(v) {
					return v!=fn
				})
				return res
			},
			clear: function() {
				this.handlers = []
				this.handlers_once = []
				return res
			}
		});
	return res;
}

function $afterAll(fn) {
	window.setTimeout(fn, 1);
}

var $log = function(msg) {
	if(window.console)
		console.log(msg)
}

$log.error = function(msg) {
	if(window.console)
		console.error(msg)
}

$log.warn = function(msg) {
	if(window.console)
		console.warn(msg)
}

$log.info = function(msg) {
	if(window.console)
		console.info(msg)
}

$log.trace = function() {
	if(window.console)
		console.trace()
}

$log.dir = function(obj) {
	if(window.console)
		console.dir(obj)
}

$log.group = function(name) {
	if(window.console)
		console.group(name)
}

$log.groupEnd = function() {
	if(window.console)
		console.groupEnd()
}






