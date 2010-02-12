
require "gen/gen"
require "rexml/document"

module Forms
	class EditForm
		def initialize(ot)
			@object_type = ot
		end
		def to_xml
			label_id = lambda do |x|
				if x.is_a? Kaisa
					"kaisa"
				elsif x.is_a? Kaisa::Block
					label_id[x.parent]
				else
					"#{label_id[x.parent]}.#{x.system_name}"
				end
			end
			form = lambda do |children|
				f = REXML::Element.new("form-control")
				(children.find_all do |c|
					if c.is_a? Kaisa::Attribute
						!c.readonly? && c.data_type!=:REFERENCE
					else
						c.attributes.any? do |a|
							!a.readonly? && a.data_type!=:REFERENCE
						end
					end
				end).map do |c|
					field = REXML::Element.new("field")
					field.add_attribute("name", c.system_name)
					if c.is_a? Kaisa::Attribute
						field.add_attribute("label", label_id[c])
						field.add_attribute("required", c.required ? "yes" : "no")
						ch_el = nil
						case c.data_type
						when :CLOB
							ch_el = REXML::Element.new("text")
						when :DATE
							ch_el = REXML::Element.new("date")
						when :RARENTRELATION, :DICTIONARY
							ch_el = REXML::Element.new("kaisa-dictionary")
							ch_el.add_attribute("type", c.kaisa.type(c.connected_type).system_name)
						else
							ch_el = REXML::Element.new("string")
							ch_el.add_attribute("max-length", c.length.to_s) unless c.length.nil?
						end
						field.add(ch_el)
					else
						field.add_attribute("label", "#{label_id[c.parent]}.group_#{c.system_name}")
						arr_el = REXML::Element.new("array")
						ch_el = REXML::Element.new("child")
						ch_el.add(form[c.attributes])
						arr_el.add(ch_el)
						field.add(arr_el)
					end
					f.add(field)
				end
				f
			end
			res = REXML::Document.new("<?xml version='1.0'?><form/>")
			if @object_type.blocks.length>1
				tabs = REXML::Element.new("tab-control")
				tabs.add_attribute("result-mode", "merged")
				@object_type.blocks.each do |b|
					tab = REXML::Element.new("tab")
					tab.add_attribute("label", "kaisa.#{b.parent.system_name}.block_#{b.system_name}")
					tab.add(form[b.attributes.concat(b.groups)])
					tabs.add(tab)
				end
				res.root.add(tabs)
			else
				res.root.add(form[@object_type.attributes.concat(@object_type.groups)])
			end
			res
		end
	end
end