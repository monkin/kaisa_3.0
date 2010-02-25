


$control.register({
	name: "window",
	container: true,
	create: function() {
		var node = $("<div title=\"untitled\"></div>").dialog({modal: true, autoOpen: false})
		var res = {
			node: function() {
				return node
			},
			setTitle: function(v) {
				node.dialog({title: $resources(v)})
			},
			getVisible: function() {
				return node.dialog("isOpen")
			},
			setVisible: function(v) {
				node.dialog((v && v!="no") ? "open" : "close")
				return res
			},
			add: function(c) {
				$log("win")
				$log(c)
				node.append(c.node())
				return res
			},
			changeVisible: $handler(),
			changeValue: $handler()
		}
		return res
	}
})