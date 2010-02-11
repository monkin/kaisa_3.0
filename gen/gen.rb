
require "lib/ojdbc6.jar"
require "rexml/document"
require "rexml/formatters/pretty"

module Resource
	class RDocument
		attr_reader :children
		def initialize(*c)
			@children = c.flatten
		end
		def to_xml
			res = REXML::Document.new("<?xml version='1.0'?><resources/>")
			(@children.sort do |a,b|
					if a.class == b.class
						a.name <=> b.name
					else
						(a.is_a? RString) ? -1 : 1
					end
				end).each { |c| res.root.add(c.to_xml) }
			res
		end
	end
	class RSet
		attr_reader :name, :children
		def initialize(name, *children)
			@name = name
			@children = children.flatten
		end
		def add(c)
			@children.push c
		end
		def to_xml
			res = REXML::Element.new("string-set")
			res.add_attribute("name", @name)
			(@children.sort do |a,b|
					if a.class == b.class
						a.name <=> b.name
					else
						(a.is_a? RString) ? -1 : 1
					end
				end).each { |c| res.add(c.to_xml) }
			res
		end
	end
	class RString
		attr_reader :name, :value
		def initialize(nm, val)
			@name = nm
			@value = val
		end
		def to_xml
			res = REXML::Element.new("string")
			res.add_attribute("name", @name)
			if @value.is_a? String
				res.add_attribute("value", @value)
			else
				@value.keys.each do |i|
					res.add_attribute("value#{i}", value[i])
				end
			end
			res
		end
	end
end

class Kaisa
	class Language < Struct.new(:id, :name, :default)
		def Language.from_node(nd)
			Language.new(nd.attributes["id"], nd.attributes["name"], false)
		end
	end
	class LanguageList < Array
		def default
			self.find{ |x| x.default }
		end
	end
	
	def resources
		Resource::RSet.new("kaisa", types.map { |b| b.resources } )
	end
	
	attr_reader :languages, :types
	
	def initialize(xm)
		@languages = LanguageList.new
		lang_doc = xm.languages
		REXML::XPath.match(lang_doc, "languageList/language").each do |nd|
			lang = Language.from_node(nd)
			lang.default = lang.id==lang_doc.root.attributes["default"]
			@languages.push lang
		end
		
		@types = REXML::XPath.match(xm.object_types(@languages.first.id), "objectTypeList/objectType").map do |nd|
			ObjectType.new(nd)
		end
		
		@languages.each do |lang|
			REXML::XPath.match(xm.object_types(lang.id), "objectTypeList/objectType").map do |nd|
				self.type(nd.attribute("id").value).update(nd, lang)
			end
		end
	end
	
	def type(id_or_name)
		types.find{ |t| (t.systemName==id_or_name) || (t.id==id_or_name) }
	end
	
	class Attribute
		attr_reader :id, :name, :system_name, :data_type, :default_value, :connected_type, :connected_attribute, :readonly, :length, :required
		def initialize(node)
			@id = node.attribute("id").value
			@systemName = node.attribute("systemName").value
			@name = {}
			@data_type = node.attribute("dataType").value.to_sym
			@connected_type = node.attributes["idConnectedType"]
			@connected_attribute = node.attributes["idConnectedAttribute"]
			@readonly = node.attributes["fReadOnly"]=="1" || node.attributes["fInput"].nil?
			@required = node.attributes["fRequired"]=="1"
			@default_value = node.attributes["defaultValue"]
			@length = node.attributes["length"]
		end
		def update(node, lang)
			@name[lang.id] = node.attributes["name"]
		end
		
		def resources
			Resource::RString.new(@systemName, @name)
		end
		
		alias :readonly? :readonly
		alias :required? :required
	end
	
	class Block
		attr_reader :id, :name, :systemName, :attributes, :groups
		def initialize(node)
			@id = node.attribute("id").value
			@systemName = node.attribute("systemName").value
			@name = {}
			@attributes = REXML::XPath.match(node, "attribute").map do |a|
				Attribute.new(a)
			end
			@groups = REXML::XPath.match(node, "group").map do |g|
				Group.new(g)
			end
		end
		def attribute(name_or_id)
			@attributes.find do |a|
				a.name==name_or_id || a.id==name_or_id
			end
		end
		def group(name_or_id)
			@groups.find do |g|
				g.name==name_or_id || g.id==name_or_id
			end
		end
		def [](name_or_id)
			attribute(name_or_id) || group(name_or_id)
		end
		def update(node, lang)
			@name[lang.id] = node.attribute("name").value
			REXML::XPath.match(node, "block/attribute").each do |a|
				attribute(a.attribute("id").value).update(a, lang)
			end
			REXML::XPath.match(node, "block/group").each do |g|
				group(g.attribute("id").value).update(g, lang)
			end
		end
		def resources
			[Resource::RString.new("block_#{@systemName}", @name),
			 @attributes.map { |a| a.resources },
			 @groups.map { |g| g.resources }]
		end
	end
	
	class ObjectType
		attr_reader :id, :systemName, :name, :blocks
		def initialize(node)
			@id = node.attribute("id").value
			@systemName = node.attribute("systemName").value
			@name = {}
			@blocks = REXML::XPath.match(node, "object/block").map do |b|
				Block.new(b)
			end
		end
		def update(node, lang)
			@name[lang.id] = node.attributes["name"]
			REXML::XPath.match(node, "object/block").each do |nd|
				block(nd.attributes["id"]).update(nd, lang)
			end
		end
		def block(name_or_id)
			@blocks.find do |b|
				b.name==name_or_id || b.id==name_or_id
			end
		end
		def attribute(n)
			@blocks.inject(nil) do |r, b|
				r || b.attribute(n)
			end
		end
		def group(n)
			@blocks.inject(nil) do |r, b|
				r || b.group(n)
			end
		end
		def [](n)
			attribute(n) || group(n)
		end
		def resources
			[Resource::RString.new("type_#{@systemName}", @name),
			 Resource::RSet.new(@systemName, @blocks.map { |b| b.resources })]
		end
	end
	
	class Group
		attr_reader :id, :name, :attributes
		def initialize(node)
			@name = {}
			@systemName = node.attribute("systemName").value
			@id = node.attribute("id").value
			@attributes = REXML::XPath.match(node, "group/groupRecord/attribute").map do |a|
				Attribute.new(a)
			end
		end
		def attribute(n)
			@attributes.find { |a| a.name==n || a.id==n }
		end
		def update(node, lang)
			@name[lang.id] = node.attribute("name").value
			REXML::XPath.match(node, "group/groupRecord/attribute").each do |nd|
				attribute(nd.attribute("id").value).update(nd, lang)
			end
		end
		def resources
			[Resource::RString.new("group_#{@name}", @name),
			 Resource::RSet.new(@systemName, @attributes.map{ |r| r.resources })]
		end
	end
end

class XMLManager
	def XMLManager.connect(conn_str, user, password)
		sm = XMLManager.new(conn_str, user, password)
		begin
			yield sm
		ensure
			sm.close
		end
	end
		
	def initialize(conn_str, user, password)
		@dir = "#{Dir.pwd}"
		Java::JavaClass.for_name("oracle.jdbc.driver.OracleDriver")
		@connection = java.sql.DriverManager.getConnection(conn_str, user, password)
	end
	
	def close
		@connection.close
	end
	
	def get_xml(clob_expr, file)
		unless File.exist? file
			begin
				puts "update #{file}"
				stmt = @connection.createStatement()
				set = stmt.executeQuery("SELECT #{clob_expr}.getclobval() as xml FROM dual")
				if set.next
					str_out = java.lang.StringBuffer.new
					br = java.io.BufferedReader.new(set.getClob("XML").getCharacterStream)
					while tmp=br.readLine() do
						str_out.append(tmp)
					end
					File.open("#{@dir}/#{file}", "w") do |f|
						REXML::Formatters::Pretty.new(2).write(REXML::Document.new("<?xml version=\"1.0\"?>#{str_out.toString}"), f)
					end
				else
					raise RuntimeError, "No clobs are returned"
				end
			ensure
				stmt.close
			end
		end
		File.open(file) do |f|
			REXML::Document.new(f.read)
		end
	end
	
	private :get_xml
	
	def object_types(lang_id)
		get_xml("userxmlfactory.getnewobjectlistxml(#{lang_id})", "types_#{lang_id}.xml")
	end
	
	def conditions(lang_id)
		xml = get_xml("userxmlfactory.getallconditionlistxml()", "conditions.xml")
		xml.delete_element("/conditionList/condition[@idLanguage!='#{lang_id}']")
		REXML::XPath.match(xml, "/conditionList/condition").each do |nd|
			nd.delete_attribute("idLanguage")
		end
		xml
	end
	
	def languages
		lang_file = "#{@dir}/language.xml"
		unless File.exist? lang_file
			puts "update: language.xml"
			begin
				lang_stmt = @connection.createStatement()
				lang_set = lang_stmt.executeQuery("SELECT id, name, fdefault FROM languages")
				lang_doc = REXML::Document.new("<?xml version='1.0'?><languageList/>")
				while lang_set.next do
					if lang_set.getInt("FDEFAULT")==1
						lang_doc.root.add_attribute("default", lang_set.getInt("ID").to_s)
					end
					lang_node = REXML::Element.new("language")
					lang_node.add_attribute("id", lang_set.getInt("ID").to_s)
					lang_node.add_attribute("name", lang_set.getString("NAME"))
					lang_doc.root.add(lang_node)
				end
				File.open(lang_file, "w") do |f|
					REXML::Formatters::Pretty.new(2).write(lang_doc, f)
				end
			ensure
				lang_stmt.close unless lang_stmt.nil?
			end
		end
		REXML::Document.new(File.new(lang_file).read)
	end
end


