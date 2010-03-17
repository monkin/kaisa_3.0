
require "gen/gen"
require "gen/xml"
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
			res = Xml.doc(Xml.element("attributes",
					Xml.attr("id", "params"),
					Xml.attr("names", "view-mode"),
					Xml.element("kaisa-searcher",
						Xml.attr("id", "searcher"),
						Xml.attr("view-mode", "\#{params.viewMode}"),
						Xml.attr("object-type", @object_type.system_name),
						Xml.element("kaisa-list",
							Xml.attr("id", "list"),
							Xml.attr("search", "\#{searcher.search}"),
							Xml.element("attributes",
								Xml.attr("id", "obj"),
								Xml.attr("names", "object"),
								Xml.element("vbox",
									Xml.element("collapse",
										Xml.attr("id", "collapse"),
											Xml.element("row",
												@object_type.attributes.find_all { |a| a.privileges.member? :LIST }.map do |a|
													Xml.element("static-text",
														if [:PARENTRELATION, :DICTIONARY].member? a.data_type
															Xml.attr("text", "\#{obj.object.value.#{a.system_name}.text}")
														else
															Xml.attr("text", "\#{obj.object.value.#{a.system_name}}")
														end)
												end)),
									Xml.element("lazy",
										Xml.attr("visible", "\#{collapse.expanded}"),
										Xml.element("vbox",
											Xml.attr("indent", "0 0 0 2em"),
											Xml.element("change",
												Xml.attr("listen", "\#{obj.object}"),
												Xml.attr("action", "collapse.setCollapsed(true)")),
											Xml.element("kaisa-mode-list",
												Xml.attr("object", "\#{obj.object}"),
												Xml.element("attributes",
													Xml.attr("id", "mode"),
													Xml.attr("names", "view-mode"),
													Xml.element("vbox",
														Xml.element("collapse",
															Xml.attr("id", "vmc"),
															Xml.element("static-text",
																Xml.attr("text", "\#{mode.viewMode.label}"))),
														Xml.element("lazy",
															Xml.attr("visible", "\#{vmc.expanded}"),
															Xml.element("vbox",
																Xml.attr("indent", "0 0 0 2em"),
																Xml.element("kaisa-list-form",
																	Xml.attr("view-mode", "\#{mode.viewMode}")))))))))))))))
				res
#			res = REXML::Document.new()
#			res.add(REXML::XMLDecl.new)
#			
#			ks = REXML::Element.new("kaisa-searcher")
#			ks.add_attribute("id", "searcher")
#			ks.add_attribute("object-type", @object_type.system_name)
#			res.add(ks)
#			
#			ls = REXML::Element.new("kaisa-list")
#			ks.add(ls)
#			ls.add_attribute("search", "\#{searcher.search}")
#			
#			o = REXML::Element.new("attributes")
#			o.add_attribute("id", "obj")
#			o.add_attribute("names", "object")
#			ls.add(o)
#			
#			vbox = REXML::Element.new("vbox")
#			o.add(vbox)
#	
#			collapse = REXML::Element.new("collapse")
#			collapse.add_attribute("id", "collapse")
#			vbox.add(collapse)
#			
#			
#			row = REXML::Element.new("row")
#			collapse.add(row)
#			
#			@object_type.attributes.find_all { |a| a.privileges.member? :LIST }.each do |a|
#				st = REXML::Element.new("static-text")
#				if [:PARENTRELATION, :DICTIONARY].member? a.data_type
#					st.add_attribute("text", "\#{obj.object.value.#{a.system_name}.text}")
#				else
#					st.add_attribute("text", "\#{obj.object.value.#{a.system_name}}")
#				end
#				row.add(st)
#			end
#			
#			lazy = REXML::Element.new("lazy")
#			lazy.add_attribute("visible", "\#{collapse.expanded}")
#			vbox.add(lazy)
#			mode_list = REXML::Element.new("kaisa-mode-list")
#			mode_list.add_attribute("object", "\#{obj.object}")
#			
#			indent = REXML::Element.new("vbox")
#			indent.add_attribute("indent", "0 0 0 2em")
#			lazy.add(indent)
#			
#			indent.add(mode_list)
#			
#			attrb = REXML::Element.new("attributes")
#			attrb.add_attribute("id", "mode")
#			attrb.add_attribute("names", "view-mode")
#			mode_list.add(attrb)
#			
#			collapse2 = REXML::Element.new("collapse")
#			attrb.add(collapse2)
#			st = REXML::Element.new("static-text")
#			st.add_attribute("text", "\#{mode.viewMode.label}")
#			collapse2.add(st)
#			res
		end
	end
end
