


$control.register({
	name: "condition",
	create: function() {
		var object_type = null
		var attr_select = $control("drop-down")
		var condition_select = $control("drop-down")
		var operand_node = $("<span></span>")
		var node = $("<div class=\"c-condition\"></div>") 
		node.append(attr_select.node())
		node.append(condition_select.node())
		node.append(operand_node)
		
		var arg_type = {
			"12": "s",
			"23": "s",
			"17": "s",
			"24": "s",
			"1582": "s",
			"1335": "0",
			"2162": "0",
			"2781": "s"
		}
		
		function emptyCondition() {
			return {
				attribute: "",
				condition: "",
				dictionaryValue: "",
				textValue: ""
			}
		}
		
		var cnd = emptyCondition()
		
		condition_select.changeValue.add(function() {
			cnd.dictionaryValue = ""
			cnd.textValue = ""
		})
		
		attr_select.changeValue.add(function() {
			condition_select.setOptions(object_type.attributes._filter(function(v) {
					return v.id==attr_select.getValue()
				})[0].conditions._map(function(c) {
					return {
						name: c.name[$language.current.id],
						value: c.id
					}
				}))
		})
		
		condition_select.changeValue.add(function() {
			operand_node.children().remove()
			if(arg_type[condition_select.getValue()]=="s")
				operand_node.append($control("string").node())
		})
		
		function updateAttrList() {
			if(object_type) {
				attr_select.setOptions(object_type.attributes._map(function(a) {
					return {
						name: $resources("kaisa." + object_type.name + "." + a.name),
						value: a.id
					}
				}))
			}
		}
		
		var res = {
			node: function() {
				return node
			},
			getObjectType: function() {
				return object_type
			},
			setObjectType: function(v) {
				if(typeof v == "string")
					v = $kaisa.objectType(v)
				object_type = v
				updateAttrList()
				return res
			},
			getCondition: function() {
				return cnd
			},
			changeCondition: function() {
			
			}
		}
		return res
	}
})



