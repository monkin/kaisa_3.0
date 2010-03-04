
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
				f = REXML::Element.new("form")
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
					if c.is_a? Kaisa::Attribute
						field.add_attribute("label", label_id[c])
						#field.add_attribute("required", c.required ? "yes" : "no")
						ch_el = nil
# # 						case c.data_type
# # 						when :CLOB
# # 							ch_el = REXML::Element.new("text")
# # 						when :DATE
# # 							ch_el = REXML::Element.new("date")
# # 						when :RARENTRELATION, :DICTIONARY
# # 							ch_el = REXML::Element.new("kaisa-dictionary")
# # 							ch_el.add_attribute("type", c.kaisa.type(c.connected_type).system_name)
# # 						else
# # 							ch_el = REXML::Element.new("string")
# # 							#ch_el.add_attribute("max-length", c.length.to_s) unless c.length.nil?
# # 						end
						ch_el = REXML::Element.new("string") #!!!
						field.add(ch_el)
					else
						field.add_attribute("label", "#{label_id[c.parent]}.group_#{c.system_name}")
# # 						arr_el = REXML::Element.new("array")
# # 						ch_el = REXML::Element.new("child")
# # 						ch_el.add(form[c.attributes])
# # 						arr_el.add(ch_el)
# # 						field.add(arr_el)
						ch_el = form[c.attributes] #!!!
						field.add(ch_el)
					end
					f.add(field)
				end
				f
			end
			res = REXML::Document.new()
			res.add(REXML::XMLDecl.new)
			if @object_type.blocks.length>1
				tabs = REXML::Element.new("tab-control")
				@object_type.blocks.each do |b|
					tab = REXML::Element.new("tab")
					tab.add_attribute("label", "kaisa.#{b.parent.system_name}.block_#{b.system_name}")
					tab.add(form[b.attributes.concat(b.groups)])
					tabs.add(tab)
				end
				res.add(tabs)
			else
				res.add(form[@object_type.attributes.concat(@object_type.groups)])
			end
			res
		end
	end
	class ListForm
		def initialize(ot)
			@object_type = ot
		end
		def to_xml
			res = REXML::Document.new()
			res.add(REXML::XMLDecl.new)
			
			ks = REXML::Element.new("kaisa-searcher")
			ks.add_attribute("id", "searcher")
			ks.add_attribute("object-type", @object_type.system_name)
			res.add(ks)
			
			ls = REXML::Element.new("kaisa-list")
			ks.add(ls)
			ls.add_attribute("search", "\#{searcher.search}")
			
			o = REXML::Element.new("attributes")
			o.add_attribute("id", "obj")
			o.add_attribute("names", "object")
			ls.add(o)
			
			row = REXML::Element.new("row")
			o.add(row)
			
			@object_type.attributes.find_all { |a| a.privileges.member? :LIST }.each do |a|
				st = REXML::Element.new("static-text")
				if [:PARENTRELATION, :DICTIONARY].member? a.data_type
					st.add_attribute("text", "\#{obj.object.value.#{a.system_name}.text}")
				else
					st.add_attribute("text", "\#{obj.object.value.#{a.system_name}}")
				end
				row.add(st)
			end
			res
		end
	end
end