
$control.register({
	name: "kaisa-searcher",
	container: true,
	css: [
			".c-kaisa-searcher { padding: 0.4em; }"
		].join(";\n"),
	create: function() {
		var node = $("<div class=\"c-kaisa-searcher ui-widget ui-widget-content ui-corner-all\"></div>")
		var sr = null
		var objectType = null
		var res = {
			node: function() {
				return node
			},
			add: function(c) {
				node.append($control.get(c).node())
			},
			setObjectType: function(ot) {
				if(typeof ot == "string")
					objectType = $kaisa.objectType(ot)
				else
					objectType = ot
				$kaisa.search(objectType, [], function(s) {
					sr = s
					res.changeSearch()
				})
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
			".c-kaisa-list-item { border-width: 1px 0 0 0; }"
		].join(";\n"),
	create: function() {
		var node = $("<div class=\"c-kaisa-list ui-widget-content ui-corner-all\"><div class=\"c-kaisa-list-pages\"></div></div>")
		var ksearch = null
		var childType = null
		var childPool = []
		var lastCall = $uid()
		function updateList() {
			var callId = lastCall = $uid
			$($(node).children()).hide()
			if(ksearch && childType) {
				ksearch.objects(function(ol) {
					if(callId==lastCall) {
						if(ol) {
							while(ol.length>childPool.length) {
								var cnt = $control.get(childType)
								var nd = $("<div style=\"display: node;\" class=\"c-kaisa-list-item ui-widget-content\"></div>").append(cnt.node())
								node.append(nd)
								childPool.push({
									control: cnt,
									node: nd
								})
							}
							ol._each(function(i, v) {
								childPool[i].control.setObject(v)
								childPool[i].node.show()
							})
						}
					}
				})
				ksearch.pages(function(pl) {
					if(callId==lastCall) {
					
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
				$log("kaisa-list.setSearch")
				$log(s)
				ksearch = s
				updateList()
				return res
			},
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
	name: "row",
	container: true,
	create: function() {
		var node = $("<table class=\"c-row\"><tbody><tr class=\"c-row-item\"></tr></tbody></table>")
		var row = $("tr", node)
		var res = {
			node: function() {
				return node
			},
			add: function(c) {
				row.append($("<td></td>").append($control.get(c).node()))
				var rch = $(row.children()).filter("td")
			}
		}
		return res
	}
})

$control.register({
	name: "static-text",
	create: function() {
		var node = $("<span></span>")
		var res = {
			node: function() {
				return node;
			},
			getText: function() {
				node.text()
			},
			setText: function(t) {
				node.text(t)
				return res
			}
		}
		return res
	}
})
