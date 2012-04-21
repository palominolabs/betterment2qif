
guard 'jasmine-headless-webkit' do
  watch(%r{^app/assets/javascripts/(.*)\..*}) { |m| newest_js_file("spec/javascripts/#{m[1]}_spec") }
end

