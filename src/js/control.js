
$control = function(nm) {
	$control.classes[nm]()
}

$control.classes = {}

$control.register = function(name, c) {
	$control.classes[name] = c
}

$control.from_dom = function(node) {
	var res = null
	function processName(nm) {
		var arr = nm.toLowerCase().split("-")
		arr.each(function(i) {
			arr[i] = nm.substring(0, 1).toUpperCase() + nm.substring(1, nm.length)
		})
	}
	res = $control(this.nodeName)
	attrs = this.attributes
	for(var i=0; i<attrs.length; i++)
		res["set" + processName(attrs[i].name)](attrs[i].value)
	for(var i=res.firstChild; i; i=i.nextSibling)
		if(i.nodeType==1) {
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
	return res
}

$control.register("base", function() {
	return {
		change: $handler(),
		node: function() {
			return null
		}
	}
})