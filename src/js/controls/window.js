


$control.register({
	name: "window",
	container: true,
	css: [".c-window { position: relative; display: block; padding: 4px; margin-top: -50%; margin-left: -50%; }",
			".c-window-pos { position: absolute; left: 50%; top: 50%; overflow: visible; }",
			".c-window-background { position: absolute; left: 0; top: 0; right: 0; bottom: 0; display: none; text-align: center; vertical-align: middle; }",
			".ui-dialog-title-dialog { cursor: default }",
			".ui-dialog-titlebar-close { cursor: pointer; }"
		].join(";\n"),
	create: function() {
		var fake = $("<div class=\"dialog\"></div>")
		if($("#windows").length==0)
			$("body").append("<div id=\"windows\"><div class=\"ui-widget-overlay c-window-background\"></div></div>")
		var overlay = $("#windows > .ui-widget-overlay")
		var node = $("<div class=\"c-window-pos\"><div class=\"ui-dialog ui-widget ui-widget-content ui-corner-all c-window\"><div class=\"ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix\">" +
					"<div class=\"ui-dialog-title\"><span class=\"ui-dialog-title-dialog\"></span><div class=\"ui-dialog-titlebar-close ui-corner-all\"><span class=\"ui-icon ui-icon-closethick\"></span></div></div>" +
					"</div><table width=\"100%\"><tbody><tr><td class=\"c-window-content\"></td></tr></tbody></table></div></div>")
		var visible = false
		var title = ""
		var dr = {
			down: false,
			px: 0,
			py: 0,
			left: 0,
			top: 0
		}
		$(".ui-dialog-titlebar", node).mousedown(function(e) {
			$log("down")
			dr.down = true
			dr.px = e.pageX - dr.left
			dr.py = e.pageY - dr.top
			e.preventDefault()
			e.stopImmediatePropagation()
		})
		$("body").mousemove(function(e) {
			$log("move")
			if(dr.down) {
				$log("move")
				dr.left = e.pageX-dr.px
				dr.top = e.pageY-dr.py
				$(".ui-dialog:first", node).css("left", dr.left.toString() + "px").css("top", dr.top.toString() + "px")
			}
			e.preventDefault()
			e.stopImmediatePropagation()
		}).mouseup(function() {
			$log("up")
			dr.down = false
			e.preventDefault()
			e.stopImmediatePropagation()
		})
		var res = {
			node: function() {
				return fake
			},
			setTitle: function(v) {
				title = v
				$(".ui-dialog-title-dialog", node).text($resources(v))
			},
			getTitle: function() {
				return title
			},
			getVisible: function() {
				return visible
			},
			setVisible: function(v) {
				var old_vis = visible
				visible = (v && v!="no")
				if(!old_vis && visible) {
					overlay.css("display", "block")
					$("#windows").append(overlay)
					$("#windows").append(node)
					$(".ui-dialog:first", node).css("left", "0").css("top", "0")
					dr.left = dr.top = 0;
				} else if(!visible) {
					node.remove()
					if($("#windows > .c-window-pos").length)
						$("#windows").append($("#windows > .c-window-pos:last"))
					else
						overlay.css("display", "none")
				}
				res.changeVisible()
				return res
			},
			add: function(c) {
				$(".c-window-content", node).append($control.get(c).node())
				return res
			},
			changeVisible: $handler(),
			changeValue: $handler()
		}
		return res
	}
})