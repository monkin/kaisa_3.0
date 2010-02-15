
$control.register({
	name: "vbox",
	container: true,
	create: function() {
		var gap = "0"
		var node = $("<div></div>")
		var children = []
		var res = {
			node: function() {
				return node
			},
			setGap: function(g) {
				gap = g
				$log(g)
				node.contents().css("padding-bottom", g)
				node.contents().last().css("padding-bottom", "0")
				return res
			},
			add: function(c) {
				c = $control.get(c)
				children.push(c)
				$log(gap)
				node.contents().last().css("padding-bottom", gap)
				node.append($("<div></div>").append(c.node()))
				return res
			},
			remove: function(c) {
				children = children.filter(function(c2) {
					return c!=c2
				})
				c.node().remove()
				setGap(gap)
				return res
			}
		}
		return res
	}
})