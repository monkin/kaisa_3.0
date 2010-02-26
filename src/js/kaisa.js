

var $kaisa = function (struct) {
	type_by_name = {}
	type_by_id = {}
	struct._each(function(ot) {
		type_by_name[ot.name] = ot
		type_by_id[ot.id] = ot
	})
	function updateObject(o, xml, lang) {
		function upd(x, nd) {
			if(x.nodeName == "object" || x.nodeName=="block") {
				$.each($(x).children(), function() {
					updateObject(o, this, lang)
				})
			} else if(x.nodeName == "attribute") {
			
			} else if(x.nodeName == "group") {
			
			}  else if(x.nodeName == "groupRecord") {
			
			}
		}
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
			var loaded = $language.list.accumulate({}, function(r, v) {
					r[v.id] = false
					return r
				})
			var obj = {
				id: null,
				type: ot,
				value: {},
				old_value: {},
				save: function(fn) {
					
				},
				loaded: function() {
					return languages.accumulate(true, function(r, l) {
						return r && loaded[l.id]
					})
				},
				load: function(fn) {
					
				},
				viewModes: function(fn) {
					
				},
				remove: function(fn) {
					
				}
			}
			return obj
		},
		load: function(id, fn) {
			
		},
		search: function(ot, params, fn) {
			
		}
	}
	$kaisa = structManager
	return structManager
}