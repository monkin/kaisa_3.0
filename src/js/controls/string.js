

$control.register({
	name: "string",
	create: function() {
		var node = $("<input type=\"text\"/>").bind("change keyup", function(e) {
			res.changeValue()
			e.preventDefault()
			e.stopImmediatePropagation()
		})
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