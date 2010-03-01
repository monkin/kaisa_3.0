

var $kaisa = function (struct) {
	type_by_name = {}
	type_by_id = {}
	attr_by_id = {}
	struct._each(function(ot) {
		type_by_name[ot.name] = ot
		type_by_id[ot.id] = ot
		ot.attributes._each(function(a) {
			attr_by_id[a.id] = a
		})
		ot.groups._each(function(g) {
			g.attributes._each(function(a) {
				attr_by_id[a.id] = a
			})
		})
	})
	function updateObject(o, xml, lang) {
		function upd(x, nd) {
			if(x.nodeName == "object" || x.nodeName=="block" || x.nodeName=="sgroupRecord") {
				$.each($(x).children(), function() {
					updateObject(o, this, lang)
				})
			} else if(x.nodeName == "attribute") {
				var attr = attr_by_id[x.getAttribute("id")]
				var value = null
				if(attr.type=="PARENTRELATION" || attr.type=="DICTIONARY") {
					var oid = x.getAttribute("dictionaryValue")
					if(oid) {
						value = {
							ref: oid,
							text: $(x).text()
						}
					}
				} else
					value = $(x).text()
				o[attr.name] = value
			} else if(x.nodeName == "group") {
				var gval = []
				$("groupRecord", x).each(function() {
					rval = {}
					upd(rval, this)
				})
				o[nd.getAttribute("systemName")] = gval
			}
		}
	}
	function createObjectList(nd) {
	
	}
	var searchQueue = []
	function searchQuery(act, data, fn) {
		function nextQuery() {
			var q = searchQueue[0]
			$ajax({
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
			/*<filter objectType="10229" language="1" isSearchInFound="0">
			<attribute id="10441" condition="12" text-value="9" dictionary-value=""/>
			</filter>*/
			searchQuery("doSearchByXMLRequest.do",
				$xml($xml.element("filter",
					$xml.attribute("objectType", ot.id),
					$xml.attribute("language", $language.current.id))),
				function(nd) {
					if(nd) {
						var sr = $("searchReply", nd)
						var searchId = sr.attr("searchID")
						var count = sr.attr("objectsFounded")
						var page = 1
						var res = {
							getPage: function() {
								return page
							},
							setPage: function(p) {
								page = p
							},
							objects: function(fn) {
								/*<?xml version="1.0"?>
								<list objectType = "10229" page = "1" pageSize = "15" language = "1" search-id="3"/>*/
							},
							pages: function(fn) {
							
							}
						}
						fn(res)
					} else
						fn(null)
				})
		}
	}
	$kaisa = structManager
	return structManager
}