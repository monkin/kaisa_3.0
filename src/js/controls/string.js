

$control.register({
	name: "string",
	css: ".c-string { width: 20em; padding: 2px; }",
	create: function() {
		var node = $("<input class=\"c-string ui-widget-content ui-corner-all\" type=\"text\"/>").bind("change keyup", function(e) {
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
				res.changeValue()
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

$control.register({
	name: "password",
	css: ".c-password { width: 20em; padding: 2px; }",
	create: function() {
		var node = $("<input class=\"c-password ui-widget-content ui-corner-all\" type=\"password\"/>").bind("change keyup", function(e) {
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
				res.changeValue()
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