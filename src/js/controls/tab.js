

$control.register({
	name: "tab-control",
	css: ".ui-tabs-panel { padding: 0.3em !important; }",
	create: function() {
		var tabs = []
		var node = $('<div id="tabs" class="ui-tabs ui-widget ui-widget-content ui-corner-all"><ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all ui-sortable"></ul></div>')
		var activeTab = null
		function updateClasses(t) {
			if(activeTab==t) {
				t.header.addClass("ui-tabs-selected").addClass("ui-state-active").removeClass("ui-state-default")
				t.content.removeClass("ui-tabs-hide")
			} else {
				t.header.removeClass("ui-tabs-selected").removeClass("ui-state-active").addClass("ui-state-default")
				t.content.addClass("ui-tabs-hide")
			}
		}
		function setActiveTab(t) {
			activeTab = t
			tabs._each(function(t) {
				updateClasses(t)
			})
		}
		var res = {
			node: function() {
				return node
			},
			addTab: function(t) {
				var tab = {
					label: t.label,
					control: $control.get(t.control)
				}
				function activate(e) {
					setActiveTab(tab)
					e.preventDefault()
					e.stopImmediatePropagation()
				}
				tab.header = $("<li class=\"ui-corner-top\"></li>").append($("<a href=\"#\"></a>").text($resources(tab.label)).click(activate).hover(function(e) {
							tab.header.addClass("ui-state-hover")
							e.preventDefault()
							e.stopImmediatePropagation()
						}, function(e) {
							tab.header.removeClass("ui-state-hover")
							e.preventDefault()
							e.stopImmediatePropagation()
						})).click(activate),
				tab.content = $("<div class=\"ui-tabs-panel ui-widget-content ui-corner-bottom\"></div>").append(tab.control.node())
				tabs.push(tab)
				if(activeTab==null)
					activeTab=tab
				updateClasses(tab)
				node.children().filter("ul").append(tab.header)
				node.append(tab.content)
				return res
			}
		}
		return res;
	}
})