
$control.register({
	name: "static-text",
	create: function() {
		var node = $("<span></span>")
		var res = {
			node: function() {
				return node;
			},
			getText: function() {
				node.text()
			},
			setText: function(t) {
				node.text(t)
				return res
			}
		}
		return res
	}
})
