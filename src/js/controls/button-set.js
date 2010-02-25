

$control.register({
	name: "button-set",
	create: function() {
		var node = $("<div></div>")
		var res = {
			node: function() {
				return node
			}
		}
		return res
	}
})

