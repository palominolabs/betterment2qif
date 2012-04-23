require 'bundler'
require 'logger'
Bundler.require

load 'jasmine/tasks/jasmine.rake'

Dir['lib/**/*.rb'].each { |lib_file| require_relative(lib_file) }

project_root_dir = Pathname(File.dirname(__FILE__))
source_dir = project_root_dir.join('src')

build_dir = project_root_dir.join('build')
intermediates_dir = build_dir.join('intermediates')
chrome_build_dir = build_dir.join('chrome')
firefox_build_dir = build_dir.join('firefox')

release_dir = build_dir.join('release')

logger = Logger.new(STDOUT)

desc "Bundles all JS files into a single huge file"
task :sprockets do
  logger.info("Building bundled JS files")

  sprockets = Sprockets::Environment.new(project_root_dir) { |env| env.logger = logger }

  sprockets.append_path(source_dir.to_s)

  %w( chrome.js firefox.js ).each { |bundle| sprockets.find_asset(bundle).write_to(intermediates_dir.join(bundle)) }
end

namespace :compile do
  def generic_extension_manifest
    open('extension_manifest.yml', 'r') { |fh| GenericManifestReader.new(YAML.load(fh)) }
  end

  desc "Compile all versions of the extension"
  task all: [:chrome, :firefox] do
  end

  desc "Build an unpacked chrome extension"
  task chrome: [:sprockets] do
    logger.info("Compiling chrome extension")


    FileUtils.rm_rf(chrome_build_dir)
    FileUtils.mkdir_p(chrome_build_dir)

    FileUtils.cp(File.join(intermediates_dir, 'chrome.js'), File.join(chrome_build_dir, 'chrome.js'))

    open(File.join(chrome_build_dir, 'manifest.json'), 'w+') { |fh| fh.write(ChromeManifestBuilder.new(generic_extension_manifest).build) }
  end

  desc "Build umpackaged version of FF extension for testing"
  task firefox: [:sprockets] do
    logger.info("Compiling firefox extension")

    firefox_lib_dir = File.join(firefox_build_dir, 'lib')
    firefox_data_dir = File.join(firefox_build_dir, 'data')

    FileUtils.rm_rf(firefox_build_dir)

    FileUtils.mkdir_p(firefox_lib_dir)
    FileUtils.mkdir_p(firefox_data_dir)

    firefox_manifest_builder = FirefoxManifestBuilder.new(generic_extension_manifest)

    open(File.join(firefox_lib_dir, 'main.js'), 'w') { |fh| fh.write(firefox_manifest_builder.build_mainjs) }

    FileUtils.cp(File.join(intermediates_dir, 'firefox.js'), File.join(firefox_data_dir, 'firefox.js'))

    open(File.join(firefox_build_dir, 'package.json'), 'w') do |fh|
      fh.write(firefox_manifest_builder.build)
    end
  end
end

namespace :release do

  desc "Create zip and crx versions for Chrome"
  task chrome: 'compile:chrome' do
    logger.info("Creating Chrome zip/crx archives")

    defaults = {
        ex_dir: chrome_build_dir,
        pkey: './chrome_private_key.pem',
        verbose: true,
    }

    crx_path = File.join(release_dir, 'chrome_extension.crx')
    zip_path = File.join(release_dir, 'chrome_extension.zip')
    FileUtils.rm_f([crx_path, zip_path])

    CrxMake.make(defaults.merge(crx_output: crx_path))

    CrxMake.zip(defaults.merge(zip_output: zip_path))
  end
end