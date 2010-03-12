
require "rexml/document"

module Xml
	def Xml.doc(root)
		res = REXML::Document.new()
		res.add(REXML::XMLDecl.new)
		res.add(root)
		res
	end
	def Xml.attr(name, val)
		REXML::Attribute.new(name, val)
	end
	def Xml.element(name, *args)
		args.flatten.inject(REXML::Element.new(name)) do |r, v|
			if v.is_a? REXML::Attribute
				r.add_attribute(v)
			else
				r.add(v)
			end
			r
		end
	end
	def Xml.text(txt)
		REXML::Text.new(txt)
	end
end
