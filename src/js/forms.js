

$form = function(name/*, fn*/) {
	var res = null
	var fn = arguments.length==2 ? arguments[1] : function(r) {
			res = r
		}
	if($form.mapping[name]) {
		function processNode(nd) {
			return $control.fromDom(nd)
		}
		if($form.xmlCache[name])
			fn(processNode($form.xmlCache[name].firstChild))
		else {
			$.ajax({
				async: arguments.length==2,
				url: "k3/" + $form.mapping[name],
				dataType: "xml",
				success: function(nd) {
					$form.xmlCache[name] = nd
					$resources.appendXml(nd)
					$("resources", nd).remove()
					fn(processNode(nd.firstChild))
				}
			})
		}
	} else
		fn(null)
	return res
}

$form.xmlCache = {}

$form.init = function(fn) {
	$.ajax({
		url: "k3/forms.xml",
		dataType: "xml",
		success: function(nd) {
			$form.mapping = {}
			$("form", nd).each(function() {
				$form.mapping[$(this).attr("name")] = $(this).attr("template")
			})
			fn()
		}
	})
}