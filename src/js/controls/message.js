

$control.register({
	name: "message",
	css: ".c-message-message { display: inline; };\n .c-message { margin: 0.2em 0 0.2em 0; };\n .c-message p { margin: 0.3em 0 0.3em 0; vertical-align: middle; };",
	create: function() {
		var node = $("<div class=\"ui-widget c-message\"><div class=\"c-message-box ui-corner-all\" style=\"padding: 0pt 0.4em;\">" +
			"<p><span class=\"ui-icon ui-icon-alert\" style=\"float: left; margin-right: 0.4em;\"></span><span class=\"c-message-message\"></span></p></div></div>")
		var box = $(".c-message-box", node)
		box.addClass("ui-state-error")
		var mode = "error"
		var visible = true
		var message = ""
		function getModeClass() {
			return ({
				"error": "ui-state-error",
				"info": "ui-state-highlight
			})[mode]
		}
		var res = {
			node: function() {
				return node
			},
			getVisible: function() {
				return visible
			},
			getMode: function() {
				return mode
			},
			setMode: function(md) {
				box.removeClass(getModeClass())
				mode = md
				box.addClass(getModeClass())
			},
			setVisible: function(v) {
				visible = (v=="no" || !v) ? false : true
				node.css("display", visible ? "block" : "none")
				res.changeVisible()
				return res
			},
			changeVisible: $handler(),
			getMessage: function() {
				return message
			},
			setMessage: function(msg) {
				message = msg
				$(".c-message-message", node).text($resources(msg))
				res.changeMessage()
				return res
			},
			changeMessage: $handler()
		}
		return res
	}
})



