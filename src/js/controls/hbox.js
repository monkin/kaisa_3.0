
$control.register({
	name: "hbox",
	container: true,
	create: function() {
		var gap = "0"
		var node = $("<div class=\"hbox\"></div>").css("white-space", "nowrap")
		var children = []
		var res = {
			node: function() {
				return node
			},
			setGap: function(g) {
				gap = g
				node.contents().css("padding-right", g)
				node.contents().last().css("padding-right", "0")
				return res
			},
			add: function(c) {
				c = $control.get(c)
				children.push(c)
				node.contents().filter("div:last").css("padding-right", gap)
				node.append($("<div class=\"hbox_item\"></div>").css("display", "inline-block").append(c.node()))
				return res
			},
			remove: function(c) {
				children = children.filter(function(c2) {
					return c!=c2
				})
				c.node().remove()
				setGap(gap)
				return res
			},
			panel: function(i) {
				return children[i].node().parent()
			}
		}
		return res
	}
})

