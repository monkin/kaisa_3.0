

var $kaisa = function (struct) {
	type_by_name = {}
	type_by_id = {}
	attr_by_id = {}
	struct._each(function(ot) {
		type_by_name[ot.name] = ot
		type_by_id[ot.id] = ot
		ot.attr_by_name = {}
		ot.attributes._each(function(a) {
			a.objectType = ot
			attr_by_id[a.id] = a
			ot.attr_by_name[a.name] = a
		})
		ot.groups._each(function(g) {
			g.objectType = ot
			g.attributes._each(function(a) {
				a.objectType = ot
				attr_by_id[a.id] = a
				ot.attr_by_name[a.name] = a
			})
		})
	})
	function updateObject(o, xml, lang) {
		var ot = type_by_name[$(xml).attr("objectTypeName")]
		function upd(x, nd) {
			if(nd.nodeName == "object" || nd.nodeName=="block" || nd.nodeName=="sgroupRecord") {
				$.each($(nd).children(), function() {
					upd(x, this)
				})
			} else if(nd.nodeName == "attribute") {
				var attr = ot.attr_by_name[nd.getAttribute("systemName")]
				var value = null
				if(attr.type=="PARENTRELATION" || attr.type=="DICTIONARY") {
					var oid = nd.getAttribute("dictionaryValue")
					if(oid) {
						value = {
							ref: oid,
							text: $(nd).text()
						}
					}
				} else
					value = $(nd).text()
				x[attr.name] = value
			} else if(nd.nodeName == "group") {
				var gval = []
				$("groupRecord", nd).each(function() {
					rval = {}
					upd(rval, this)
					gval.push(rval)
				})
				x[nd.getAttribute("systemName")] = gval
			}
		}
		o.id = xml.getAttribute("id")
		o.type = ot
		upd(o.value, xml)
		upd(o.old_value, xml)
	}
	var searchQueue = []
	function searchQuery(act, data, fn) {
		function nextQuery() {
			var q = searchQueue[0]
			$.ajax({
				type: "post",
				url: q.action,
				data: { XMLReq: q.data },
				dataType: "xml",
				success: function(nd) {
					searchQueue.shift()
					if(searchQueue.length)
						nextQuery()
					q.callback(nd)
				},
				error: function() {
					searchQueue.shift()
					q.callback(null)
				}
			})
		}
		searchQueue.push({
			action: act,
			data: data,
			callback: fn
		})
		if(searchQueue.length==1)
			nextQuery();
	}
	var languages = [$language.current]
	var structManager = {
		login: function(l, p, fn) {
			document.cookie = "JSESSIONID=; expires=Thu, 01-Jan-90 00:00:01 GMT; path=" + location.href.replace(/http:\/\/[^\/]+/, "").replace(/\/[^\/]*$/, "")
			$.ajax({
				type: "post",
				url: "plainLogin.do",
				data: { XMLReq: $xml($xml.element("login", $xml.attribute("userName", l), $xml.attribute("password", p))) },
				dataType: "xml",
				success: function(xml) {
					fn(xml && $("Login", xml).length)
					fn = null
				},
				error: function() {
					fn(false)
					fn = null
				}
			})
		},
		languages: function() {
			return languages
		},
		addLanguage: function(lang) {
			if(!languages.accumulate(false, function(r,v) { return r || v==lang }))
				languages.push(lang)
		},
		removeLanguage: function(lang) {
			languages = languages.filter(function(l) {
					return l!=lang
				})
		},
		objectTypes: function() {
			return struct
		},
		objectType: function(nm_or_id) {
			return type_by_name[nm_or_id] || type_by_id[nm_or_id]
		},
		createObject: function(ot) {
			var viewModes = null
			var loaded = false
			var obj = {
				id: null,
				type: ot,
				value: {},
				old_value: {},
				save: function(fn) {
					
				},
				loaded: function() {
					return loaded
				},
				load: function(fn) {
					var cnt = $language.list.length
					$language.list._each(function(l) {
						$ajax({
							type: "post",
							url: "getFullObjectXML.do",
							data: { XMLReq: $xml($xml.element("object", $xml.attribute("id", obj.id), $xml.attribute("language", l.id))) },
							dataType: "xml",
							success: function(nd) {
								cnt--
								$("object", nd).each(function() {
									if(!obj.type)
										obj.type = type_by_id[this.getAttribute("objectType")]
									updateObject(obj, this, l)
								})
								if(cnt==0)
									fn(true)
							},
							error: function() {
								if(cnt>0) {
									cnt = -1
									fn(false)
								}
							}
						})
					})
					loaded = true
				},
				viewModes: function(fn) {
					if(obj.id) {
						searchQuery("getModeListXML.do", 
							$xml($xml.element("object", $xml.attribute("id", obj.id), $xml.attribute("language", $language.current.id))),
							function(nd) {
								var res = []
								$("modeCell", nd).each(function() {
									var mc = $(this)
									if(/^[HD]/.test(mc.attr("viewMode")))
										res.push({
											name: mc.attr("name"),
											length: mc.attr("numRecords"),
											objectType: attr_by_id[mc.attr("idAttribute")].objectType,
											getSearchId: function(fnx) {
												searchQuery("getViewModeXML.do",
													$xml($xml.element("object",
														$xml.attribute("id", obj.id),
														$xml.attribute("language", $language.current.id),
														$xml.attribute("viewMode", mc.attr("viewMode")),
														$xml.attribute("pageSize", "1"))),
													function(vmnd) {
														fnx($("objectList", vmnd).attr("searchID"))
													})
											}
										})
								})
								fn(res)
							})
					} else
						fn([])
				},
				remove: function(fn) {
					
				}
			}
			return obj
		},
		load: function(id, fn) {
			var obj = structManager.createObject(null)
			obj.id = id
			obj.load(function(r) {
				return r ? obj : null
			})
		},
		search: function(ot, params, fn) {
			var parentSearchId = null
			function doSearch() {
				searchQuery("doSearchByXMLRequest.do",
					$xml($xml.element("filter",
						$xml.attribute("objectType", ot.id),
						$xml.attribute("language", $language.current.id),
						parentSearchId ? $xml.attribute("searchID", parentSearchId) : [])),
					function(nd) {
						if(nd) {
							var sr = $("searchReply", nd)
							var searchId = sr.attr("searchID")
							var count = sr.attr("objectsFounded")
							var page = 1
							var pageSize = 20
							var res = {
								getPage: function() {
									return page
								},
								setPage: function(p) {
									page = p
								},
								getPageSize: function() {
									return pageSize
								},
								setPageSize: function(ps) {
									pageSize = ps
									return res
								},
								objects: function(fn) {
									searchQuery("getObjectListXML.do",
										$xml($xml.element("list",
											$xml.attribute("objectType", ot.id),
											$xml.attribute("page", page),
											$xml.attribute("pageSize", pageSize),
											$xml.attribute("language", $language.current.id),
											$xml.attribute("searchID", searchId))), function(nd) {
												if(nd) {
													var r = []
													$("objectList > object", nd).each(function() {
														var o = structManager.createObject(ot)
														updateObject(o, this, $language.current)
														r.push(o)
													})
													fn(r)
												} else
													fn(null)
											})
								},
								pages: function(fn) {
									searchQuery("getObjectPageListXML.do",
										$xml($xml.element("pageList",
											$xml.attribute("objectType", ot.id),
											$xml.attribute("page", page),
											$xml.attribute("pageSize", pageSize),
											$xml.attribute("language", $language.current.id),
											$xml.attribute("searchID", searchId))),
										function(nd) {
											if(nd) {
												var res = []
												$("page", nd).each(function() {
													res.push({
														active: $(this).attr("link")!="1",
														name: $(this).text(),
														page: $(this).attr("pageNumber")
													})
												})
												fn(res)
											} else
												fn(null)
										});
								}
							}
							fn(res)
						} else
							fn(null)
					})
			}
			if(arguments.length>3 && arguments[3]) {
				if(arguments[3].getSearchId) {
					arguments[3].getSearchId(function(sid) {
						parentSearchId = sid
						doSearch()
					})
				} else {
					parentSearchId = arguments[3]
					doSearch()
				}
			} else
				doSearch()
		}
	}
	$kaisa = structManager
	return structManager
}
