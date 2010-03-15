
$control.register({
	name: "lazy",
	container: true,
	create: function() {
		var node = $("<div style=\"display: none;\"></div>")
		var visible = false
		var child_builder = null
		var child = null
		function updateNode() {
			if(visible) {
				node.show()
				if(child_builder && !child) {
					child = $control.get(child_builder)
					node.append(child.node())
				}
			} else
				node.hide()
		}
		var res = {
			node: function() {
				return node
			},
			getVisible: function() {
				return visible
			},
			setVisible: function(v) {
				visible = v && v!="no"
				updateNode()
				if(!visible && child) {
					child.remove()
					child = null
				}
				res.changeVisible()
			},
			changeVisible: $handler(),
			add: function(c) {
				if(child)
					throw new Error("Child allready added")
				else
					child_builder = c
				updateNode()
			}
		}
		return res
	}
})


