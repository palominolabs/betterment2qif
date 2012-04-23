require_relative 'spec_helper'

describe ChromeManifestBuilder do
  describe "#build" do
    before :each do
      generic_manifest = {
          'name' => 'Fake chrome extension',
          'description' => "It's for testing",
          'version' => 1.2,
          'author' => 'Meee',
          'content_script_matches' => 'somesite.com',
          'firefox_id' => '123'
      }
      gmr = GenericManifestReader.new(generic_manifest)
      cmb = ChromeManifestBuilder.new(gmr)
      @chrome_manifest = JSON.parse(cmb.build, :symbolize_names => true)
    end

    it "sets name" do
      @chrome_manifest[:name].should == 'Fake chrome extension'
    end

    it "sets version as string" do
      @chrome_manifest[:version].should == '1.2'
    end

    it "sets manifest version 2" do
      @chrome_manifest[:manifest_version].should == 2
    end

    it "sets description" do
      @chrome_manifest[:description].should == "It's for testing"
    end

    it "sets content scripts" do
      @chrome_manifest[:content_scripts].should == [
          matches: %w(somesite.com),
          css: [],
          js: %w(chrome.js)
      ]
    end

  end
end