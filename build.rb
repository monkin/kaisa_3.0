
require "rexml/document"
require "rexml/formatters/pretty"
require "gen/gen"
require "gen/forms"

options = REXML::XPath.match(REXML::Document.new(File.new("config.xml")), "/config/option").inject({}) do |r, e|
	r[e.attributes["name"]] = e.text
	r
end

Dir.mkdir("build") unless File.exist? "build"
Dir.chdir("build") do
	Dir.mkdir "db_struct" unless File.exist? "db_struct"
	kaisa = XMLManager.connect(options["db-conn"], options["db-user"], options["db-password"]) do |xm|
		Dir.chdir("db_struct") do
			Kaisa.new(xm)
		end
	end
	unless File.exist? "resources.xml"
		puts "update: resources.xml"
		File.open("resources.xml", "w") do |f|
			REXML::Formatters::Pretty.new(2).write(Resource::RDocument.new(kaisa.resources).to_xml, f)
		end
	end
	conf = REXML::Document.new("<?xml version='1.0'?><forms-config/>")
	menu = REXML::Document.new("<?xml version='1.0'?><menu/>")
	Dir.mkdir("forms") unless File.exist?("forms")
	Dir.chdir("forms") do
		kaisa.types.each do |ot|
			conf_el = REXML::Element.new("form")
			conf_el.add_attribute("name", "#{ot.system_name}_edit")
			conf_el.add_attribute("template", "forms/#{ot.system_name}/edit.xml")
			conf.root.add(conf_el)
			
			item = REXML::Element.new("menu-item")
			item.add_attribute("label", "kaisa.type_#{ot.system_name}")
			item.add_attribute("form", "#{ot.system_name}_edit")
			menu.root.add(item)
			
			Dir.mkdir(ot.system_name) unless File.exist?(ot.system_name)
			Dir.chdir(ot.system_name) do
				File.open("edit.xml", "w") do |f|
					REXML::Formatters::Pretty.new(2).write(Forms::EditForm.new(ot).to_xml, f)
				end
			end
		end
	end
	File.open("forms.xml", "w") do |f|
		REXML::Formatters::Pretty.new(2).write(conf, f)
	end
	File.open("menu.xml", "w") do |f|
		REXML::Formatters::Pretty.new(2).write(menu, f)
	end
end

