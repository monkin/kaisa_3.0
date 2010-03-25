

$control.register({
	name: "list-buttons",
	css: [".list-buttons { width: 100%; }",
		".list-buttons-button { padding: 0.2em; cursor: pointer; display: inline-block; }",
		".list-buttons-content { width: 100%; }"].join(";\n"),
	create: function() {
		var node = $("<table class=\"list-buttons\"><tbody><tr class=\"list-buttons-row\"><td class=\"list-buttons-content\"></td><td class=\"list-buttons-buttons\"></td></tr></tbody></table>")
		var content_box = $(".list-buttons-content", node)
		var button_box = $(".list-buttons-buttons", node)
		var res = {
			node: function() {
				return node
			},
			addControl: function(c) {
				content_box.append($control.get(c.control).node())
			},
			addButton: function(btn) {
				var nd = $("<div class=\"list-buttons-button ui-corner-all ui-state-default\"><span class=\"ui-icon\"></span></div>")
				$("span", nd).addClass("ui-icon-" + btn.icon)
				nd.click(function() {
					
				}).hover(function() {
					$(this).addClass("ui-state-hover").removeClass("ui-state-default")
				}, function() {
					$(this).removeClass("ui-state-hover").addClass("ui-state-default")
				}).mousedown(function() {
					$(this).addClass("ui-state-active")
				}).mouseup(function() {
					$(this).removeClass("ui-state-active")
				})
				button_box.append(nd)
			}
		}
		return res
	}
})
