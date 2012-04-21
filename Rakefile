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
  task :chrome do
    extension_manifest = YAML.load(open('extension_manifest.yml'))

    FileUtils.mkdir_p('build/chrome')

    FileUtils.cp_r('shared', 'build/chrome/shared')
    FileUtils.cp_r('vendor', 'build/chrome/vendor')
    FileUtils.cp_r('chrome', 'build/chrome/chrome')

    js_files = Dir['build/chrome/**/*.js'].map{|js| js.sub('build/chrome/', '')}
    extension_manifest["content_scripts"].each do |content_script|
      content_script["js"] = js_files
    end

    fh = open('build/chrome/manifest.json', 'w+')
    fh.write(JSON.generate(extension_manifest))
    fh.close

  end
end