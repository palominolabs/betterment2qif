require_relative './spec_helper'

describe GenericManifestReader do
  describe "#new" do
    before :each do
      @all_options = {
          'author' => 'phred',
          'version' => 123,
          'name' => 'name',
          'content_script_matches' => 'site.com',
          'firefox_id' => 'numbers and letters',
          'description' => 'just for testing',
          'cfbundleversion' => '123',
          'cfbundleidentifier' => 'com.foo.bar',
      }
    end

    it "throws if no name" do
      @all_options.delete('name')
      lambda { GenericManifestReader.new(@all_options) }.should raise_error "name required"
    end

    it "throws if no version" do
      @all_options.delete('version')
      lambda { GenericManifestReader.new(@all_options) }.should raise_error "version required"
    end

    it "throws if no author" do
      @all_options.delete('author')
      lambda { GenericManifestReader.new(@all_options) }.should raise_error "author required"
    end

    it "throws if no content script matches" do
      @all_options.delete('content_script_matches')
      lambda { GenericManifestReader.new(@all_options) }.should raise_error "content_script_matches required"
    end

    it "throws if content script is an array" do
      @all_options['content_script_matches'] = %w(sitea.com siteb.com)
      lambda { GenericManifestReader.new(@all_options) }.should raise_error "content_script_matches must be a string"
    end

    it "throws if content script contains single quote" do
      @all_options['content_script_matches'] = "www.evil'domain.com"
      lambda { GenericManifestReader.new(@all_options) }.should raise_error "content_script_matches must not contain single quotes"
    end

    it "throws if no description" do
      @all_options.delete('description')
      lambda { GenericManifestReader.new(@all_options) }.should raise_error "description required"
    end

    it "throws if no firefox_id" do
      @all_options.delete('firefox_id')
      lambda { GenericManifestReader.new(@all_options) }.should raise_error "firefox_id required"
    end

    it "throws if no cfbundleidentifier" do
      @all_options.delete('cfbundleidentifier')
      lambda { GenericManifestReader.new(@all_options) }.should raise_error "cfbundleidentifier required"
    end

    it "throws if no cfbundleversion" do
      @all_options.delete('cfbundleversion')
      lambda { GenericManifestReader.new(@all_options) }.should raise_error "cfbundleversion required"
    end
  end

  describe "accessors " do
    before :each do
      @gmr = GenericManifestReader.new(
          'name' => 'Dummy Manifest',
          'version' => 3,
          'author' => 'Jake Jake',
          'content_script_matches' => 'foo.com/*',
          'firefox_id' => 'ffid',
          'description' => 'description yo',
          'cfbundleversion' => '123',
          'cfbundleidentifier' => 'com.foo.bar',
      )
    end

    it "returns name" do
      @gmr.name.should == 'Dummy Manifest'
    end

    it "returns version" do
      @gmr.version.should == 3
    end

    it "returns author" do
      @gmr.author.should == 'Jake Jake'
    end

    it "returns content_script_matches" do
      @gmr.content_script_matches.should == 'foo.com/*'
    end

    it "returns description" do
      @gmr.description.should == 'description yo'
    end

    it "returns firefox_id" do
      @gmr.firefox_id.should == 'ffid'
    end

    it "returns cfbundleidentifier" do
      @gmr.cfbundleidentifier.should == 'com.foo.bar'
    end

    it "returns cfbundleversion" do
      @gmr.cfbundleversion.should == '123'
    end
  end
end
