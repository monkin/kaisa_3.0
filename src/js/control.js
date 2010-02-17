
$control = function(nm) {
	var bindings = {}
	var res = $control.classes[nm].create()
	var props = {}
	res.unbindAll = function() {
		for(var i in props) {
			if(props[i] && props[i].unbind)
				props[i].unbind()
		}
	}
	res.property = function(name) {
		if(props[name])
			return props[name]
		else {
			var p_name = name.substring(0,1).toUpperCase() + name.substring(1, name.length)
			var bindedTo = null
			var path = null
			var inChange = false
			function updateSelf() {
				if(inChange)
					return;
				else {
					try {
						inChange = true
						p.set(bindedTo.get())
						p.change()
					} finally {
						inChange = false
					}
				}
			}
			function updateBinded() {
				if(inChange)
					return;
				else {
					try {
						inChange = true
						if(bindedTo && bindedTo.set)
							bindedTo.set(p.get())
					} finally {
						inChange = false
					}
				}
			}
			function pathWrapper(prop, path) {
				var changeFns = null
				path = path.split(/\./)
				var inCh = false
				function propChanged() {
					if(inCh)
						return
					try {
						var v = pw.get()
						if(v!=p.get())
							p.set(v)
					} finally {
						inCh = false
					}
				}
				propChanged.add = function(fn) {
					changeFn = fn
					prop.change.add(propChanged)
				}
				propChanged.remove = function() {
					changeFn = null
					prop.change.remove(propChanged)
				}
				var pw = {
					get: function() {
						return path.accumulate(prop.get(), function(r, v) {
								return (r!=null && r!=undefined) ? r[v] : undefined
							})
					},
					set: function(val) {
						var v = prop.get()
						var v2 = v
						for(var i=0; i<(path.length-1); i++)
							v2 = v2 ? v2[path[i]] : undefined
						if(v2) {
							v2[path.last()] = val
							prop.set(v)
						}
					},
					change: propChanged
				}
				return pw;
			}
			
			var p = props[name] = {
				get: res["get" + p_name],
				set: res["set" + p_name],
				change: res["change" + p_name],
				bind: function(prop/*, path*/) {
					if(arguments.length>1)
						prop = pathWrapper(prop, arguments[1])
					if(prop==bindedTo)
						return p
					if(bindedTo)
						p.unbind()
					if(prop) {
						bindedTo = prop
						if(prop.change)
							prop.change.add(updateSelf)
					}
					return p
				},
				unbind: function() {
					if(bindedTo) {
						if(bindedTo.change)
							bindedTo.change.remove(updateSelf)
						bindedTo = null
					}
					return p
				}
			}
			if(p.change)
				p.change.add(updateBinded)
			return p.get ? p : null
		}
	}
	return res
}

$control.get = function(c) {
	return (c instanceof Function) ? c() : c
}

$control.classes = {}

$control.register = function(c) {
	if(c.css)
		$.tocssRule(c.css)
	$control.classes[c.name] = c
}

$control.processName = 

$control.fromDom = function(node) {
	var res = null
	function processName(nm) {
		return nm.toLowerCase().split("-").map(function(v) {
			return v.substring(0, 1).toUpperCase() + v.substring(1, v.length)
		}).join("")
	}
	var c_class = $control.classes[node.nodeName]
	var res = c_class.create()
	var attrs = node.attributes
	for(var i=0; i<attrs.length; i++)
		res["set" + processName(attrs[i].name)](attrs[i].value)
	for(var i=node.firstChild; i; i=i.nextSibling)
		if(i.nodeType==1) {
			if(c_class.container) {
				res.add($control.from_dom(i))
			} else {
				var nm = processName(i.nodeName)
				var fn = res["set" + nm] || res["add" + nm]
				if(fn) {
					var val = {
						value: null,
						control: null
					}
					for(var j=i.firstChild; j; j=j.nextSibling)
						if(j.nodeType==1) {
							val.control = (function(cNode) {
									return function() { return $control.fromDom(cNode); }
								})(j)
							break
						}
					if(!val.control)
						val.value = $(i).text()
					var a = i.attributes
					for(var j=0; j<a.length; j++)
						val[a[j].name] = a[j].value
					fn(val)
				}
			}
		}
	return res
}
