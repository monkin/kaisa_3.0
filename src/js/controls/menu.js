

$control.register({
	name: "menu",
	css: [".c-menu { width: 100%; overflow: hidden; }",
		".c-menu-item { border-right-width: 0 !important; margin: 0.6em 0 0.6em 0.6em; padding: 0.1em; padding: 0.1em 0.6em 0.2em 0.6em; white-space: nowrap; cursor: pointer; }",
		".c-menu-cell { height: 100%; vertical-align: top; }",
		".c-menu-item-active { position: relative; left: 1px; cursor: default; }",
		".c-menu-height { height: 100%; }",
		".c-menu-content { border-width: 0 !important; padding: 0.6em; min-height: 100%; }",
		".c-menu-content-cell { width: 100%; vertical-align: top; }",
		".c-menu-item-box { border-style: none solid none none !important; padding-top: 0.1em; height: 100%; background-image: none; overflow: visible; }"].join(";\n"),
	create: function() {
		var item_container = $("<div class=\"ui-widget-header c-menu-item-box\"></div>")
		var content = $("<div class=\"ui-widget-content c-menu-content\"></div>")
		var node = $("<table cellspacing=\"0\" cellpadding=\"0\" class=\"ui-widget ui-widget-content c-menu ui-corner-all\"><tbody class=\"c-menu-height\"><tr class=\"c-menu-height\"><td class=\"c-menu-cell\"></td><td class=\"c-menu-cell c-menu-content-cell\"></td></tr></tbody></table>")
		$("td:first", node).append(item_container)
		$("td:last", node).append(content)
		var items = []
		var selectedItem = null
		
		function updateItem(i) {
			if(i==selectedItem)
				i.menuNode.addClass("ui-state-active").removeClass("ui-state-default").addClass("c-menu-item-active")
			else
				i.menuNode.removeClass("ui-state-active").addClass("ui-state-default").removeClass("c-menu-item-active")
		}
		function updateItemList() {
			items._each(updateItem)
		}
		var curr = null
		function selectItem(i) {
			if(selectedItem!=i) {
				selectedItem = i
				$form(i.form, function(f) {
					if(curr)
						curr.remove()
					curr = f
					content.append(f.node())
				})
				updateItemList(updateItem)
			}
		}
		var res = {
			node: function() {
				return node
			},
			addMenuItem: function(i) {
				var item = {
					label: i.label,
					form: i.form,
					menuNode: $("<div class=\"ui-corner-left c-menu-item\"></div>").text($resources(i.label)).click(function(e) {
							selectItem(item)
							e.preventDefault()
							e.stopImmediatePropagation()
						}).hover(function(e) {
							item.menuNode.addClass("ui-state-hover")
							e.preventDefault()
							e.stopImmediatePropagation()
						}, function(e) {
							item.menuNode.removeClass("ui-state-hover")
							e.preventDefault()
							e.stopImmediatePropagation()
						})
				}
				items.push(item)
				item_container.append(item.menuNode)
				if(items.length==1)
					selectItem(item)
				else
					updateItem(item)
			}
		}
		return res
	}
})