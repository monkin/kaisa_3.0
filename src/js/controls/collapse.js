

$control.register({
	name: "collapse",
	container: true,
	css: [".c-collapse { width: 100%; }",
			".c-collapse-button  { padding: 0 0.2em 0 0.2em; }",
			".c-collapse-icon > div { padding: 0.2em; display: inline-block; }",
			".c-collapse-control { width: 100%; }",
			".c-collapse-icon { width: 0; }"].join(";\n"),
	create: function() {
		var node = $("<table class=\"c-collapse\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td class=\"c-collapse-button\"></td><td class=\"c-collapse-control\"></td></tr></tbody></table>")
		var btn = $control("button").setIcon("circle-plus").setAction(function() {
			res.setCollapsed(!collapsed)
		})
		$(".c-collapse-button", node).append(btn.node())
		var control = null
		var collapsed = true
		var res = {
			node: function() {
				return node
			},
			add: function(c) {
				if(!control) {
					control = $control.get(c)
					$(".c-collapse-control", node).append(control.node())
				} else
					throw new Error("Control allready added")
			},
			getCollapsed: function() {
				return collapsed
			},
			setCollapsed: function(c) {
				collapsed = c && c!="no"
				btn.setIcon(collapsed ? "circle-plus" : "circle-minus")
				res.changeCollapsed()
				return res
			},
			changeCollapsed: $handler(),
			getExpanded: function() {
				return !collapsed
			},
			setExpanded: function(e) {
				collapsed = !e || e=="no";
			}
		}
		res.changeExpanded = res.changeCollapsed
		return res
	}
})
