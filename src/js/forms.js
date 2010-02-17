

$form = function(name, fn) {
	if($form.mapping[name]) {
		function processNode(nd) {
			return $control.fromDom(nd)
		}
		if($form.xmlCache[name])
			fn(processNode($form.xmlCache[name].firstChild))
		else {
			$.ajax({
				url: "k3/" + $form.mapping[name],
				dataType: "xml",
				success: function(nd) {
					$form.xmlCache[name] = nd
					fn(processNode(nd.firstChild))
				}
			})
		}
	} else
		fn(null)
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