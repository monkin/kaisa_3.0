
$control.register({
	name: "row",
	container: true,
	css: ".c-row { table-layout: fixed; width: 100%; }",
	create: function() {
		var node = $("<table class=\"c-row\"><tbody><tr class=\"c-row-item\"></tr></tbody></table>")
		var row = $("tr", node)
		var res = {
			node: function() {
				return node
			},
			add: function(c) {
				row.append($("<td></td>").append($control.get(c).node()))
				var rch = $(row.children()).filter("td")
				rch.css("width", Math.ceil(100.0/rch.length).toString() + "%");
			}
		}
		return res
	}
})

