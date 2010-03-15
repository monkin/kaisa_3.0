

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
				return null;
			},
			setListen: function(l) {
				actions._each(function(a) {
					a()
				})
			},
			setAction: function(act) {
				actions.push(function() {
						$log("action")
						$log(act)
						if(res.context_eval)
							res.context_eval(act)
					})
			}
		}
		return res
	}
})




