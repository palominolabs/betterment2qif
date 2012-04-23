require 'bundler'
Bundler.require

Dir['lib/**/*.rb'].each { |lib_file| require_relative "../../#{lib_file}" }