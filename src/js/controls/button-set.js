

$control.register({
	name: "button-set",
	css: [".ui-dialog-buttonpane { font-sizze: 12px; }",
		"div.ui-dialog-buttonpane { padding: 0.2em !important; }"].join(";\n"),
	create: function() {
		var node = $("<div class=\"ui-dialog-buttonpane ui-widget-content ui-helper-clearfix\"></div>")
		var res = {
			node: function() {
				return node
			},
			addButton: function(btn) {
				node.append($("<button class=\"ui-state-default ui-corner-all\"></button>").hover(function() {
						$(this).removeClass("ui-state-default").addClass("ui-state-hover")
					}, function() {
						$(this).addClass("ui-state-default").removeClass("ui-state-hover")
					}).text($resources(btn.label)).mousedown(function() {
						$(this).addClass("ui-state-active")
					}).mouseup(function() {
						$(this).removeClass("ui-state-active")
					}).click(function() {
						if(res.context_eval)
							res.context_eval(btn.value)
					}))
				return res
			}
		}
		return res
	}
})

