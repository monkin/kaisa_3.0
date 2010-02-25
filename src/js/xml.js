
function $xml() {
	return '<?xml version="1.0"?>' + Array.fromObject(arguments).join("");
}

$xml.element = function(name) {
	var res = {
		type: "element",
		attributes: [],
		children: [],
		toString: function() {
			return "<" + name + (res.attributes.length ? " " : "") + res.attributes.join(" ")
				+ (res.children.length
					?  (">" + res.children.join("") + "</" + name + ">")
					: "/>");
		}
	}
	function processArgument(arg) {
		if(!arg)
			return;
		if(arg instanceof Array)
			arg._each(processArgument);
		else if(arg.type=="attribute")
			res.attributes.push(arg);
		else if(arg.type!=undefined)
			res.children.push(arg);
	}
	Array.fromObject(arguments)._filter(function(i, v) {
		return i!=0 && (v.type || (v instanceof Array))
	})._map(processArgument)
	return res;
}

$xml.text = function(t) {
	if(t==undefined || t==null || t=="")
		return [];
	return {
		type: "text",
		toString: function() {
			t = (t==undefined || t==null) ? "" : t.toString();
			return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
		}
	}
}

$xml.attribute = function(name, value) {
	value = new String(value)
	return {
		type: "attribute",
		toString: function() {
			return name + "=\"" + value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;") + "\"";
		}
	}
}
