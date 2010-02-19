
class String
	def to_json
		"\"#{ self.gsub(/\\/, "\\\\").gsub(/\n/, "\\n").gsub(/\r/, "\\r").gsub(/\t/, "\\t").gsub(/"/, "\\\"") }\""
	end
end

class Symbol
	def to_json
		to_s.to_json
	end
end

class Numeric
	def to_json
		to_s
	end
end

module Enumerable
	def to_json
		"[#{ map{|x| x.to_json }.join(",") }]"
	end
end

class NilClass
	def to_json
		"null"
	end
end

class Hash
	def to_json
		"{#{keys.map{|i| "#{i.to_json}:#{self[i].to_json}" }.join(",")}}"
	end
end

class TrueClass
	def to_json
		"true"
	end
end

class FalseClass
	def to_json
		"false"
	end
end