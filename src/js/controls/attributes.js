

$control.register({
	name: "attributes",
	container: true,
	create: function() {
		var child = null
		var res = {
			node: function() {
				return child && child.node()
			},
			setNames: function(names) {
				names.split(";")._each(function(nm) {
					var val = null
					nm = nm.substring(0, 1).toUpperCase() + nm.substring(1, nm.length)
					res["change" + nm] = $handler()
					res["get" + nm] = function() {
						return val
					}
					res["set" + nm] = function(v) {
						val = v
						res["change" + nm]
					}
				})
			},
			add: function(c) {
				if(child)
					throw new Error("Attributes child allready added")
				child = $control.get(c)
			}
		}
		return res
	}
})