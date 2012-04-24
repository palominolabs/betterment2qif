class SafariManifestBuilder
  def initialize(generic_manifest_reader)
    @generic_manifest_reader = generic_manifest_reader
  end

  def build
    {
        'Builder Version' => '7534.55.3',
        'CFBundleInfoDictionaryVersion' => '6.0',
        'Chrome' => {},
        'ExtensionInfoDictionaryVersion' => '1.0',
        'Permissions' => {
            'Website Access' => {
                'Level' => 'All',
                'Include Secure Pages' => true,
            }
        },

        'CFBundleDisplayName' => @generic_manifest_reader.name,
        'Author' => @generic_manifest_reader.author,
        'Description' => @generic_manifest_reader.description,
        'CFBundleDisplayName' => @generic_manifest_reader.name,
        'CFBundleVersion' => @generic_manifest_reader.cfbundleversion.to_s,
        'CFBundleShortVersionString' => @generic_manifest_reader.version.to_s,
        'CFBundleIdentifier' => @generic_manifest_reader.cfbundleidentifier,

        'Content' => {
            'Scripts' => {
                'End' => ['safari.js']
            },
            'Whitelist' => [@generic_manifest_reader.content_script_matches]
        }
    }.to_plist
  end


end