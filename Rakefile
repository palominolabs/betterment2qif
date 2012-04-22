require 'bundler'
Bundler.require

begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
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

    FileUtils.cp_r('shared', output_directory)
    FileUtils.cp_r('vendor', output_directory)
    FileUtils.cp_r('chrome', output_directory)

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
end

namespace :release do
  desc "Create zip and crx versions for Chrome"
  task chrome: "compile:chrome" do
    output_directory = 'build/release'
    FileUtils.mkdir_p(output_directory)

    defaults = {
        ex_dir: 'build/chrome',
        pkey: './chrome_private_key.pem',
        verbose: true,
    }

    crx_path = File.join(output_directory, 'chrome.crx')
    zip_path = File.join(output_directory, 'chrome.zip')
    FileUtils.rm([crx_path, zip_path])

    CrxMake.make(defaults.merge(
                     crx_output: crx_path,
                 ))

    CrxMake.zip(defaults.merge(
                    zip_output: zip_path,
                ))
  end
end