class ChromeManifestBuilder
  attr_accessor :web_accessible_resources

  def initialize(generic_manifest_reader)
    @generic_manifest_reader = generic_manifest_reader
    @web_accessible_resources = []
  end

  def build
    JSON.generate({
                      manifest_version: 2,
                      name: @generic_manifest_reader.name,
                      version: @generic_manifest_reader.version.to_s,
                      description: @generic_manifest_reader.description,
                      content_scripts: [{
                                            matches: [@generic_manifest_reader.content_script_matches],
                                            css: [],
                                            js: %w(chrome.js),
                                            run_at: 'document_end'
                                        }],
                      web_accessible_resources: @web_accessible_resources.sort,
                  })
  end


end