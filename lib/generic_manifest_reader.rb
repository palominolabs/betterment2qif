class GenericManifestReader
  ATTRIBUTES = [:name, :version, :author, :content_script_matches, :firefox_id, :description].freeze

  ATTRIBUTES.each { |attr| attr_reader(attr) }

  def initialize(generic_manifest_hash)
    ATTRIBUTES.each do |required_key|
      raise "#{required_key} required" unless generic_manifest_hash.key?(required_key.to_s)
    end

    raise "content_script_matches must be a string" unless generic_manifest_hash['content_script_matches'].is_a?(String)
    raise "content_script_matches must not contain single quotes" if generic_manifest_hash['content_script_matches'].include?("'")

    @name = generic_manifest_hash['name']
    @version = generic_manifest_hash['version']
    @author = generic_manifest_hash['author']
    @content_script_matches = generic_manifest_hash['content_script_matches']
    @firefox_id = generic_manifest_hash['firefox_id']
    @description = generic_manifest_hash['description']
  end

end