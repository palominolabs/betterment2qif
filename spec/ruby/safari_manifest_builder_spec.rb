require_relative 'spec_helper'

describe SafariManifestBuilder do
  describe "#build" do
    before :each do
      generic_manifest = {
          'name' => 'Fake safari extension',
          'description' => "It's for testing",
          'version' => 1.2,
          'author' => 'Meee',
          'content_script_matches' => 'somesite.com',
          'firefox_id' => '123',
          'cfbundleversion' => '123',
          'cfbundleidentifier' => 'com.foo.bar',
      }
      gmr = GenericManifestReader.new(generic_manifest)
      smb = SafariManifestBuilder.new(gmr)

      @safari_manifest = Plist::parse_xml(smb.build)
    end

    it "sets boilerplate" do
      @safari_manifest['Builder Version'].should == '7534.55.3'
      @safari_manifest['CFBundleInfoDictionaryVersion'].should == '6.0'
      @safari_manifest['Chrome'].should == {}
      @safari_manifest['ExtensionInfoDictionaryVersion'].should == '1.0'
      @safari_manifest['Permissions'].should == {
          'Website Access' => {
              'Level' => 'All',
              'Include Secure Pages' => true,
          }
      }
    end

    it "sets author" do
      @safari_manifest['Author'].should == 'Meee'
    end

    it "sets description" do
      @safari_manifest['Description'].should == "It's for testing"
    end

    it "sets bundle identifier" do
      @safari_manifest['CFBundleIdentifier'].should == 'com.foo.bar'
    end

    it "sets name" do
      @safari_manifest['CFBundleDisplayName'].should == 'Fake safari extension'
    end

    it "sets version as string" do
      @safari_manifest['CFBundleShortVersionString'].should == '1.2'
    end

    it "sets cfbundleversion" do
      @safari_manifest['CFBundleVersion'].should == '123'
    end

    it "sets content scripts" do
      @safari_manifest['Content']['Scripts']['End'].should == ['safari.js']
      @safari_manifest['Content']['Whitelist'].should == ['somesite.com']
    end
  end
end