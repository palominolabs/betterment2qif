require 'bundler'
require 'logger'
Bundler.require

load 'jasmine/tasks/jasmine.rake'

project_root_dir = Pathname(File.dirname(__FILE__))
source_dir = project_root_dir.join('src')
shared_source_dir = source_dir.join('shared')
vendor_source_dir = source_dir.join('vendor')

build_dir = project_root_dir.join('build')
intermediates_dir = build_dir.join('intermediates')
chrome_build_directory = build_dir.join('chrome')

release_dir = build_dir.join('release')
firefox_release_dir = release_dir.join('firefox')
chrome_release_dir = release_dir.join('chrome')

desc "Bundles all JS files into a single huge file"
task :sprockets do
  LOGGER = Logger.new(STDOUT)
  BUNDLES = %w( chrome.js firefox.js )

  sprockets = Sprockets::Environment.new(project_root_dir) do |env|
    env.logger = LOGGER
  end

  sprockets.append_path(source_dir.to_s)

  BUNDLES.each do |bundle|
    assets = sprockets.find_asset(bundle)
    _, basename = assets.pathname.to_s.split('/')[-2..-1]

    assets.write_to(intermediates_dir.join(basename))
  end

end

namespace :compile do
  desc "Build an unpacked chrome extension"
  task :chrome do
    extension_manifest = YAML.load(open('extension_manifest.yml'))
    extension_manifest['manifest_version'] = 2

    FileUtils.rm_rf(chrome_build_directory)
    FileUtils.mkdir_p(chrome_build_directory)

    FileUtils.cp_r(shared_source_dir, chrome_build_directory)
    FileUtils.cp_r(vendor_source_dir, chrome_build_directory)

    js_files = Dir["#{chrome_build_directory}/vendor/**/*.js"].map { |js| js.sub("#{chrome_build_directory}/", '') }
    js_files += Dir["#{chrome_build_directory}/shared/**/*.js"].map { |js| js.sub("#{chrome_build_directory}/", '') }
    js_files += Dir["#{chrome_build_directory}/chrome/**/*.js"].map { |js| js.sub("#{chrome_build_directory}/", '') }
    extension_manifest["content_scripts"].each do |content_script|
      content_script["js"] = js_files
    end

    open(File.join(chrome_build_directory, 'manifest.json'), 'w+') { |fh| fh.write(JSON.generate(extension_manifest)) }
  end

  desc "Build umpackaged version of FF extension for testing"
  task firefox: [:sprockets] do
    firefox_lib_dir = File.join(firefox_release_dir, 'lib')
    firefox_data_dir = File.join(firefox_release_dir, 'data')

    FileUtils.rm_rf(firefox_release_dir)

    FileUtils.mkdir_p(firefox_lib_dir)
    FileUtils.mkdir_p(firefox_data_dir)

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

    open(File.join(firefox_lib_dir, 'main.js'), 'w') { |fh| fh.write(page_mod) }

    FileUtils.cp(File.join(intermediates_dir, 'firefox.js'), File.join(firefox_data_dir, 'firefox.js'))

    open(File.join(firefox_release_dir, 'package.json'), 'w') do |fh|
      fh.write(JSON.generate({
                                 name: extension_manifest['name'].downcase.gsub(/[^a-z0-9]+/, '_'),
                                 license: 'MPL 2.0',
                                 author: extension_manifest['author'],
                                 version: extension_manifest['version'],
                                 fullName: extension_manifest['name'],
                                 id: extension_manifest['id'],
                                 description: extension_manifest['description']
                             }))
    end
  end
end

namespace :release do


  desc "Create zip and crx versions for Chrome"
  task chrome: [:sprockets] do
    FileUtils.rm_rf(chrome_release_dir)
    FileUtils.mkdir_p(chrome_release_dir)

    FileUtils.cp(File.join(intermediates_dir, 'chrome.js'), File.join(chrome_release_dir, 'chrome.js'))

    extension_manifest = YAML.load(open('extension_manifest.yml'))
    extension_manifest['manifest_version'] = 2

    extension_manifest["content_scripts"].each do |content_script|
      content_script["js"] = %w(chrome.js)
    end

    open(File.join(chrome_release_dir, 'manifest.json'), 'w+') { |fh| fh.write(JSON.generate(extension_manifest)) }

    defaults = {
        ex_dir: chrome_release_dir,
        pkey: './chrome_private_key.pem',
        verbose: true,
    }

    crx_path = File.join(release_dir, 'chrome_extension.crx')
    zip_path = File.join(release_dir, 'chrome_extension.zip')
    FileUtils.rm_f([crx_path, zip_path])

    CrxMake.make(defaults.merge(
                     crx_output: crx_path,
                 ))

    CrxMake.zip(defaults.merge(
                    zip_output: zip_path,
                ))
  end
end