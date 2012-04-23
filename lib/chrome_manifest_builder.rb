class ChromeManifestBuilder
  def initialize(generic_manifest_reader)
    @generic_manifest_reader = generic_manifest_reader
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
                                            js: %w(chrome.js)
                                        }],
                  })
  end


end