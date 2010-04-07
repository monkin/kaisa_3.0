

$control.register({
	name: "drop-down",
	create: function() {
		var node = $("<select></select>").change(function() {
			res.setValue(res.getValue())
		})
		var options = []
		function updateNode() {
			$("option", node).remove()
			options._each(function(o) {
				node.append($("<option></option>").text(o.name).attr("value", o.value))
			})
		}
		var res = {
			node: function() {
				return node
			},
			getOptions: function() {
				return options
			},
			setOptions: function(op) {
				options = op || []
				updateNode()
				res.setValue(res.getValue())
				return res
			},
			getValue: function() {
				return $(node).val()
			},
			setValue: function(v) {
				$(node).val(v)
				res.changeValue(v)
				return res
			},
			changeValue: $handler()
		}
		return res
	}
})
