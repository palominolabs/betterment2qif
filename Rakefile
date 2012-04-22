require 'bundler'
require 'logger'
Bundler.require

begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  end
end

desc "Bundles all JS files into a single huge file"
task :sprockets do
  ROOT = Pathname(File.dirname(__FILE__))
  LOGGER = Logger.new(STDOUT)
  BUNDLES = %w( chrome.js firefox.js )
  BUILD_DIR = ROOT.join('build', 'intermediates')
  SOURCE_DIR = ROOT.join("src")

  sprockets = Sprockets::Environment.new(ROOT) do |env|
    env.logger = LOGGER
  end

  sprockets.append_path(SOURCE_DIR.to_s)

  BUNDLES.each do |bundle|
    assets = sprockets.find_asset(bundle)
    prefix, basename = assets.pathname.to_s.split('/')[-2..-1]

    #assets.write_to(BUILD_DIR.join(prefix, basename))
    assets.write_to(BUILD_DIR.join(basename))
  end

end

namespace :compile do
  desc "Build an unpacked chrome extension"
  task :chrome do
    extension_manifest = YAML.load(open('extension_manifest.yml'))
    extension_manifest['manifest_version'] = 2

    output_directory = 'build/chrome'

    FileUtils.rm_rf(output_directory)
    FileUtils.mkdir_p(output_directory)

    FileUtils.cp_r('src/shared', output_directory)
    FileUtils.cp_r('src/vendor', output_directory)

    js_files = Dir["#{output_directory}/vendor/**/*.js"].map { |js| js.sub("#{output_directory}/", '') }
    js_files += Dir["#{output_directory}/shared/**/*.js"].map { |js| js.sub("#{output_directory}/", '') }
    js_files += Dir["#{output_directory}/chrome/**/*.js"].map { |js| js.sub("#{output_directory}/", '') }
    extension_manifest["content_scripts"].each do |content_script|
      content_script["js"] = js_files
    end

    fh = open(File.join(output_directory, 'manifest.json'), 'w+')
    fh.write(JSON.generate(extension_manifest))
    fh.close
  end

  task :firefox do

  end
end

namespace :release do
  task firefox: [:sprockets] do
    FileUtils.rm_rf('build/release/firefox')
    FileUtils.mkdir_p('build/release/firefox/lib')
    FileUtils.mkdir_p('build/release/firefox/data')

    extension_manifest = YAML.load(open('extension_manifest.yml'))

    page_mod = <<EOS
const pageMod = require('page-mod');
const data = require('self').data;
EOS

    extension_manifest["content_scripts"].each do |content_script|
      match_rules = content_script['matches']

      raise "Only supports one match rule" unless match_rules.length == 1
      match_rule = match_rules.first

      page_mod += <<EOS
pageMod.PageMod({
	include: '#{match_rule}',
	contentScriptWhen: 'ready',
	contentScriptFile: data.url('firefox.js')
});
EOS
    end

    fh = open('build/release/firefox/lib/main.js', 'w')
    fh.write(page_mod)
    fh.close

    FileUtils.cp('build/intermediates/firefox.js', 'build/release/firefox/data/firefox.js')

    fh = open('build/release/firefox/package.json', 'w')
    fh.write(JSON.generate({
                               name: extension_manifest['name'].downcase.gsub(/[^a-z0-9]+/, '_'),
                               license: 'MPL 2.0',
                               author: extension_manifest['author'],
                               version: extension_manifest['version'],
                               fullName: extension_manifest['name'],
                               id: extension_manifest['id'],
                               description: extension_manifest['description']
                           }))
    fh.close
  end

  desc "Create zip and crx versions for Chrome"
  task chrome: [:sprockets] do
    output_directory = 'build/release/chrome'

    FileUtils.rm_rf(output_directory)
    FileUtils.mkdir_p(output_directory)

    FileUtils.cp('build/intermediates/chrome.js', 'build/release/chrome/chrome.js')

    extension_manifest = YAML.load(open('extension_manifest.yml'))
    extension_manifest['manifest_version'] = 2

    extension_manifest["content_scripts"].each do |content_script|
      content_script["js"] = %w(chrome.js)
    end

    fh = open(File.join(output_directory, 'manifest.json'), 'w+')
    fh.write(JSON.generate(extension_manifest))
    fh.close


    output_directory = 'build/release'
    FileUtils.mkdir_p(output_directory)

    defaults = {
        ex_dir: 'build/release/chrome',
        pkey: './chrome_private_key.pem',
        verbose: true,
    }

    crx_path = File.join('build/release/', 'chrome_extension.crx')
    zip_path = File.join('build/release/', 'chrome_extension.zip')
    FileUtils.rm_f([crx_path, zip_path])

    CrxMake.make(defaults.merge(
                     crx_output: crx_path,
                 ))

    CrxMake.zip(defaults.merge(
                    zip_output: zip_path,
                ))
  end
end