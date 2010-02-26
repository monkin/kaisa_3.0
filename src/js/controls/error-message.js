

$control.register({
	name: "error-message",
	css: ".c-error-message-message { display: inline; };\n .c-error-message { margin: 0.2em 0 0.2em 0; };\n .c-error-message p { margin: 0.3em 0 0.3em 0; vertical-align: middle; };",
	create: function() {
		var node = $("<div class=\"ui-widget c-error-message\"><div class=\"ui-state-error ui-corner-all\" style=\"padding: 0pt 0.4em;\">" +
			"<p><span class=\"ui-icon ui-icon-alert\" style=\"float: left; margin-right: 0.4em;\"></span><span class=\"c-error-message-message\"></span></p></div></div>")
		var visible = true
		var message = ""
		var res = {
			node: function() {
				return node
			},
			getVisible: function() {
				return visible
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
				$(".c-error-message-message", node).text($resources(msg))
				res.changeMessage()
				return res
			},
			changeMessage: $handler()
		}
		return res
	}
})