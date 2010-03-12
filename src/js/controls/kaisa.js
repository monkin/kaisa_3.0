
$control.register({
	name: "kaisa-searcher",
	container: true,
	create: function() {
		var node = $("<div class=\"c-kaisa-searcher\"></div>")
		var sr = null
		var objectType = null
		var viewMode = null
		
		var rqid = null
		function updateSearch() {
			var r = rqid = $uid()
			if(objectType) {
				$kaisa.search(objectType, [], function(s) {
						if(r==rqid) {
							sr = s
							res.changeSearch()
						}
					}, viewMode)
			}
		}
		var res = {
			node: function() {
				return node
			},
			add: function(c) {
				node.append($control.get(c).node())
			},
			setViewMode: function(vm) {
				viewMode = vm
				updateSearch()
				return res
			},
			getViewMode: function() {
				return viewMode
			},
			setObjectType: function(ot) {
				if(typeof ot == "string")
					objectType = $kaisa.objectType(ot)
				else
					objectType = ot
				updateSearch()
			},			
			getObjectType: function() {
				return objectType
			},
			getSearch: function() {
				return sr
			},
			setSearch: function(s) {
				sr = s
				res.changeSearch()
			},
			changeSearch: $handler()
		}
		return res
	}
})


$control.register({
	name: "kaisa-list",
	container: true,
	css: [
			".c-kaisa-list-pages * { " +
				"padding: 0 0.2em 0 0.2em; " +
				"margin: 1px; " +
				"float: right; " +
				"text-decoration: none;" +
				"border-style: none; }",
			".c-kaisa-list-item { padding: 0.2em; }",
			".c-kaisa-list-pages .ui-state-default { background-color: transparent; background-image: none; }",
			".c-kaisa-list-page-disabled { cursor: default; font-weight: bold; }",
			".c-kaisa-list-pages, .c-kaisa-list-item { border-width: 1px 0 0 0; background-color: transparent; background-image: none; }"
		].join(";\n"),
	create: function() {
		var node = $("<div class=\"c-kaisa-list ui-widget-content ui-corner-all\"><div class=\"c-kaisa-list-content\"></div><div class=\"c-kaisa-list-pages ui-widget-content ui-helper-clearfix\"></div></div>")
		var listCnt = $(".c-kaisa-list-content", node)
		var listPages = $(".c-kaisa-list-pages", node)
		var ksearch = null
		var childType = null
		var childPool = []
		var lastCall = $uid()
		function updateList() {
			var callId = lastCall = $uid
			if(ksearch && childType) {
				ksearch.objects(function(ol) {
					if(callId==lastCall) {
						if(ol) {
							while(ol.length>childPool.length) {
								var cnt = $control.get(childType)
								var nd = $("<div style=\"display: none;\" class=\"c-kaisa-list-item ui-widget-content\"></div>").append(cnt.node())
								listCnt.append(nd)
								if(childPool.length==0)
									nd.css("border-top", "0")
								childPool.push({
									control: cnt,
									node: nd
								})
							}
							ol._each(function(i, v) {
								childPool[i].control.setObject(v)
								childPool[i].node.show()
							})
							for(var i=ol.length; i<childPool.length; i++)
								childPool[i].node.hide()
						}
					}
				})
				ksearch.pages(function(pl) {
					if(callId==lastCall) {
						if(pl.length<2)
							listPages.hide()
						else {
							listPages.show()
							pages = pl._map(function(page) {
								var r = $("<a href=\"#\" class=\"c-kaisa-list-page ui-state-default\"></a>")
								r.css("border-width", "0")
								if(page.active)
									r.addClass("ui-state-active").removeClass("ui-state-default")
								r.text(page.name)
								r.hover(function() {
										r.addClass("ui-state-hover").removeClass("ui-state-default")
									}, function() {
										r.removeClass("ui-state-hover")
										if(!page.active)
											r.addClass("ui-state-default")
									})
								r.click(function(e) {
									if(!page.active && ksearch) {
										ksearch.setPage(page.page)
										res.changeSearch()
										updateList()
									}
									e.preventDefault()
									e.stopImmediatePropagation()
								})
								return r
							})
							$(listPages.children()).remove()
							pages.reverse()._each(function(p) {
								listPages.append(p)
							})
						}
					}
				})
			}
		}
		var res = {
			node: function() {
				return node
			},
			getSearch: function() {
				return ksearch
			},
			setSearch: function(s) {
				ksearch = s
				updateList()
				return res
			},
			changeSearch: $handler(),
			add: function(cht) {
				if(childType)
					throw new Error("Child allready added.");
				else {
					childType = cht
					updateList()
				}
			}
		}
		return res
	}
})

$control.register({
	name: "kaisa-mode-list",
	container: true,
	create: function() {
		var node = $("<div class=\"c-kaisa-mode-list\"></div>")
		var msg = $control("message").setVisible(false).setMode("info").setMessage("controls.kaisa-mode-list.empty-msg")
		node.append(msg.node())
		var obj = null
		var childPool = []
		var controlBuilder = null
		var requestId = null
		function updateModes() {
			if(controlBuilder && obj) {
				var rqId = requestId = $uid()
				obj.viewModes(function(vms) {
					if(rqId==requestId) {
						childPool._each(function(c) { $(c.node()).hide(); })
						var empty = true
						vms = vms._filter(function(vm) {
								return vm.length!="0"
							})
						vms._each(function(i, vm) {
								empty = false
								if(!childPool[i]) {
									childPool[i] = $control.get(controlBuilder)
									node.append(childPool[i].node())
								}
								if(childPool[i].setViewMode)
									childPool[i].setViewMode($.extend({ label: vm.name + " (" + vm.length + ")"  }, vm))
								$(childPool[i].node()).show()
							})
						msg.setVisible(empty)
					}
				})
			} else
				childPool._each(function(c) { $(c.node()).hide(); })
		}
		var res = {
			node: function() {
				return node
			},
			add: function(c) {
				if(controlBuilder)
					throw new Error("Child control allready added")
				else
					controlBuilder = c
				updateModes()
				return res
			},
			setObject: function(o) {
				if(o!=obj) {
					obj = o
					updateModes()
					res.changeObject()
				}
				return res
			},
			getObject: function() {
				return obj
			},
			changeObject: $handler()
		}
		return res
	}
})





