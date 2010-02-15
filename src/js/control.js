
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

$control.from_dom = function(node) {
	var res = null
	function processName(nm) {
		var arr = nm.toLowerCase().split("-")
		arr.each(function(i) {
			arr[i] = nm.substring(0, 1).toUpperCase() + nm.substring(1, nm.length)
		})
	}
	var c_class = $control.classes[this.nodeName] 
	var res = c_class.create()
	var attrs = this.attributes
	for(var i=0; i<attrs.length; i++)
		res["set" + processName(attrs[i].name)](attrs[i].value)
	for(var i=res.firstChild; i; i=i.nextSibling)
		if(i.nodeType==1) {
			if(c_class.container) {
				res.add($control.from_dom(i))
			} else {
				var nm = processName(i.nodeName)
				var fn = res["set" + nm] || res["add" + nm]
				if(fn) {
					var val = {}
					for(var j=i.firstChild; j; j=j.nextSibling)
						if(j.nodeType==1) {
							val.value = function() { $control.from_dom(j); }
							break
						}
					if(val==null)
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
