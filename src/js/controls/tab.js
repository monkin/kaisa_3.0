

$control.register("tab-control", function() {
	var tabs = []
	var resultMode = "merged"
	var node = $($xml.element("div",
		$xml.element("ul", $xml.text())))
	var res = $control("base").extend({
		node: function() {
			return node
		},
		addTab: function(t) {
			tabs.push({
				label: t.label,
				name: t.name,
				control: t.value()
			})
			
		},
		setResultMode: function(v) {
			if(v=="merged" || v=="array" || v=="object")
				resultMode = v
			else
				throw new Error("Invalid argument: " + v)
		}
	})
})