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
          'firefox_id' => '123',
          'cfbundleversion' => '123',
          'cfbundleidentifier' => 'com.foo.bar',
      }
      gmr = GenericManifestReader.new(generic_manifest)
      @cmb = ChromeManifestBuilder.new(gmr)
      @chrome_manifest = JSON.parse(@cmb.build, :symbolize_names => true)
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
          js: %w(chrome.js),
          run_at: 'document_end'
      ]
    end

    describe '#web_accessible_resources' do
      it "manifest web_accessible_resources is empty array if web_accessible_resources never set" do
        @chrome_manifest[:web_accessible_resources].should == []
      end

      it "includes web_accessible_resources in manifest if specified" do
        @cmb.web_accessible_resources = %w(thing1.txt images/foo.png css/bar.png)

        @chrome_manifest = JSON.parse(@cmb.build, :symbolize_names => true)

        @chrome_manifest[:web_accessible_resources].should == %w(css/bar.png images/foo.png thing1.txt)
      end
    end
  end
end