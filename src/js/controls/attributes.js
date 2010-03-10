

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
					nm = nm.split(/-/)._map(function(x) {
							return x.substring(0, 1).toUpperCase() + x.substring(1, x.length)
						}).join("")
					res["change" + nm] = $handler()
					res["get" + nm] = function() {
						return val
					}
					res["set" + nm] = function(v) {
						val = v
						res["change" + nm]()
						return res
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
