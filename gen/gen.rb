
require "lib/ojdbc6.jar"
require "rexml/document"
require "rexml/formatters/transitive"



class StructManager
	def StructManager.connect(conn_str, user, password)
		sm = StructManager.new(conn_str, user, password)
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
	
	def languages
		if @languages.nil?
			lang_file = "#{@dir}/language.xml"
			unless File.exist? lang_file
				puts "update: language.xml"
				begin
					lang_stmt = @connection.createStatement()
					lang_set = lang_stmt.executeQuery("SELECT id, name, fdefault FROM languages")
					lang_doc = REXML::Document.new("<?xml version=\"1.0\"?><languageList/>")
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
			doc = REXML::Document.new(File.new(lang_file).read)
			default_lang = doc.root.attributes["default"]
			@languages = REXML::XPath.match(doc, "/languageList/language").map do |l|
				{:id => l.attributes["id"],
				:name => l.attributes["name"],
				:default => l.attributes["id"]==default_lang}
			end
		else
			@languages
		end
	end
	
end

