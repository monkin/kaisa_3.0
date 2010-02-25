

function $kaisa(struct) {
	type_by_name = {}
	type_by_id = {}
	struct._each(function(ot) {
		type_by_name[ot.name] = ot
		type_by_id[ot.id] = ot
	})
	function updateObject(o, xml, lang) {
		function upd(och, nd) {
		
		}
	}
	var languages = [$language.current]
	var structManager = {
		login: function(l, p, fn) {
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
	return structManager
}