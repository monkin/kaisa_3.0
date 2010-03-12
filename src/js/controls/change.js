

$control.register({
	name: "change",
	create: function() {
		var node = $("<div style=\"display: none;\"></div>")
		var actions = []
		var res = {
			node: function() {
				return node
			},
			getListen: function() {
			
			},
			setListen: function(l) {
				actions._each(function(a) {
					a()
				})
			},
			addAction: function(act) {
				actions.push(function() {
						$log("action")
						if(res.context_eval)
							res.context_eval(act.value)
					})
			}
		}
		return res
	}
})




