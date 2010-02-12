

$language = {
	list: [],
	current: null
}

$resource = function(path) {
	
}

$resource.data = {}

$resource.load = function(onload) {
	$.ajax({
		url: "k3/lang.xml",
		dataType: "xml",
		success: function(d) {
			var def = $("languageList", d).attr("default")
			$language.list = $.makeArray($("language", d).map(function() {
				var res = {
					id: $(this).attr("id"),
					name: $(this).attr("name")
				}
				if(res.id==def)
					$language.current = res
				return res
			}))
			$.ajax({
				url: "k3/resources.xml",
				dataType: "xml",
				success: function(d2) {
					function processString(res, nd) {
						v = {}
						res[$(nd).attr("name")] = v
						$language.list.foreach(function(l) {
							v[l.id] = $(nd).attr("value" + l.id)
						})
						return res
					}
					function processStringSet(res, nd) {
						res[$(nd).attr("name")] =  $.makeArray($(nd).children().filter("string")).accumulate({}, processString).extend($.makeArray($(nd).children().filter("string-set")).accumulate({}, processStringSet))
						return res
					}
					$log($("resources > string-set", d2))
					$resource.data = $.makeArray($("resources > string", d2)).accumulate({}, processString).extend($.makeArray($("resources > string-set", d2)).accumulate({}, processStringSet))
				}
			})
		}
	})
}