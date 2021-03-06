

$control.register({
	name: "form",
	css: [".c-form { display: inline-table; border-color: transparent; }",
		".c-form-label { padding: 0.2em 2em 0.2em 0.2em; }",
		".c-form-control { padding: 0.2em; }"].join(";\n"),
	create: function() {
		var node = $("<table class=\"ui-widget c-form ui-widget-content ui-corner-all \"><tbody class=\"c-form-body\"></tbody></table>")
		var tbody = $("tbody", node)
		var fields = []
		var res = {
			node: function() {
				return node
			},
			addField: function(f) {
				var field = {
					label: f.label,
					control: $control.get(f.control),
					node: $("<tr class=\"c-form-row\"></tr>")
				}
				field.node.append($("<td class=\"c-form-label\"></td>").text($resources(field.label)))
				field.node.append($("<td class=\"c-form-control\"></td>").append(field.control.node()))
				fields.push(field)
				tbody.append(field.node)
				return res
			}
		}
		return res
	}
})
