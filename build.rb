
require "rexml/document"
require "rexml/formatters/pretty"
require "gen/gen"

options = REXML::XPath.match(REXML::Document.new(File.new("config.xml")), "/config/option").inject({}) do |r, e|
	r[e.attributes["name"]] = e.text
	r
end

Dir.mkdir("build") unless File.exist? "build"
Dir.chdir("build") do
	Dir.mkdir "db_struct" unless File.exist? "db_struct"
	Dir.chdir("db_struct") do
		XMLManager.connect(options["db-conn"], options["db-user"], options["db-password"]) do |xm|
			kaisa = Kaisa.new(xm)
			unless File.exist? "../resources.xml"
				puts "update: resources.xml"
				File.open("../resources.xml", "w") do |f|
					REXML::Formatters::Pretty.new(2).write(Resource::RDocument.new(kaisa.resources).to_xml, f)
				end
			end
		end
	end
end

