

$control.register({
	name: "button",
	css: [".c-button { padding: 0.2em; display: inline-block; text-align: left; cursor: pointer; }",
			".c-button-icon { position: relative; top: -1px; margin: auto; display: none; vertical-align: text-bottom; }",
			".c-button-text { padding: 0 0.2em 0 0.2em; display: none; }"
			].join(";\n"),
	create: function() {
		var node = $("<div class=\"c-button ui-corner-all ui-state-default\"><span class=\"c-button-icon ui-icon\"></span><span class=\"c-button-text\"></span></div>")
		var icon_node = $(".c-button-icon", node)
		var txt_node = $(".c-button-text", node)
		var hint = null
		var icon = null
		var action = null
		node.click(function() {
				if(action && res.context_eval)
					res.context_eval(action)
				else if(typeof action == "function")
					action()
			}).hover(function() {
				$(this).addClass("ui-state-hover").removeClass("ui-state-default")
			}, function() {
				$(this).removeClass("ui-state-hover").addClass("ui-state-default")
			}).mousedown(function() {
				$(this).addClass("ui-state-active")
			}).mouseup(function() {
				$(this).removeClass("ui-state-active")
			})
		var res = {
			node: function() {
				return node
			},
			getHint: function() {
				return hint
			},
			setHint: function(h) {
				node.attr("title", $resources(h))
				hint = h
				return res
			},
			getCaption: function() {
				return txt_node.text()
			},
			setCaption: function(c) {
				if(c)
					txt_node.text($resources(c)).css("display", "inline-block")
				else
					txt_node.hide().text("")
			},
			getIcon: function() {
				return icon
			},
			setIcon: function(i) {
				if(icon)
					icon_node.removeClass("ui-icon-" + icon)
				icon = i
				if(i)
					icon_node.addClass("ui-icon-" + icon).css("display", "inline-block")
				else
					icon_node.hide()
				return res
			},
			getAction: function() {
				return action
			},
			setAction: function(a) {
				action = (a && a.value) ? a.value : a
				return res
			}
		}
		return res
	}
})
