

$control.register({
	name: "collapse",
	container: true,
	css: [".c-collapse { width: 100%; }",
			".c-collapse-icon * { cursor: pointer }",
			".c-collapse-icon > div { padding: 0.2em; display: inline-block; }",
			"c-collapse-control { width: 100%; }",
			".c-collapse-icon { width: 0; }"].join(";\n"),
	create: function() {
		var node = $("<table class=\"c-collapse\"><tbody><tr><td class=\"c-collapse-icon\"><div class=\"ui-corner-all ui-state-default\"><span class=\"ui-icon ui-icon-circle-plus\"></span></div></td><td class=\"c-collapse-control\"></td></tr></tbody></table>")
		var icon = $(".ui-icon", node)
		var control = null
		var collapsed = true
		icon.parent().click(function() {
				res.setCollapsed(!collapsed)
			}).hover(function() {
				$(this).addClass("ui-state-hover").removeClass("ui-state-default")
			}, function() {
				$(this).removeClass("ui-state-hover").addClass("ui-state-default")
			})
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
				res.changeCollapsed()
				if(collapsed)
					icon.addClass("ui-icon-circle-plus").removeClass("ui-icon-circle-minus")
				else
					icon.removeClass("ui-icon-circle-plus").addClass("ui-icon-circle-minus")
				return res
			},
			changeCollapsed: $handler(),
			getExpanded: function() {
				return !collapsed
			}
		}
		res.changeExpanded = res.changeCollapsed
		return res
	}
})
