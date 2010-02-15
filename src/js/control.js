
$control = function(nm) {
	return $control.classes[nm].create()
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
