

$control.register({
	name: "string",
	create: function() {
		var node = $("<input type=\"text\"/>")
		var res = {
			node: function() {
				return node
			},
			setValue: function(v) {
				node.val(v)
				return res
			},
			getValue: function() {
				return node.val()
			},
			changeValue: $handler()
		}
		return res
	}
})