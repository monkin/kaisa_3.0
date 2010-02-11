
require "rexml/document"
require "gen/gen"

options = REXML::XPath.match(REXML::Document.new(File.new("config.xml")), "/config/option").inject({}) do |r, e|
	r[e.attributes["name"]] = e.text
	r
end

Dir.mkdir("build") unless File.exist? "build"
Dir.chdir("build") do
	Dir.mkdir "db_struct" unless File.exist? "db_struct"
	Dir.chdir("db_struct") do
		StructManager.connect(options["db-conn"], options["db-user"], options["db-password"]) do |sm|
			sm.languages
		end
	end
end

