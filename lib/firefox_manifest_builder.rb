class FirefoxManifestBuilder
  def initialize(generic_manifest)
    @generic_manifest = generic_manifest
  end

  def build
    JSON.generate({
                      license: 'MPL 2.0',
                      name: generate_short_name(@generic_manifest.name),
                      fullName: @generic_manifest.name,
                      author: @generic_manifest.author,
                      version: @generic_manifest.version.to_s,
                      id: @generic_manifest.firefox_id,
                      description: @generic_manifest.description,
                  })
  end

  def build_mainjs
    return <<EOJS
const pageMod = require('page-mod');
const data = require('self').data;
pageMod.PageMod({
  include: '#{@generic_manifest.content_script_matches}',
  contentScriptWhen: 'ready',
  contentScriptFile: data.url('firefox.js')
});
EOJS
  end

  private

  def generate_short_name(long_name)
    long_name.downcase.gsub(/[^a-z0-9]+/, '_')
  end
end