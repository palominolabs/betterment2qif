require_relative 'spec_helper'

describe FirefoxManifestBuilder do
  before :each do
    generic_manifest = {
        'name' => 'Fake ff extension',
        'description' => "It's for testing",
        'version' => 9.9,
        'author' => 'Meee',
        'content_script_matches' => 'somesite.com',
        'firefox_id' => '123',
        'cfbundleversion' => '123',
        'cfbundleidentifier' => 'com.foo.bar',
    }
    gmr = GenericManifestReader.new(generic_manifest)
    @fmb = FirefoxManifestBuilder.new(gmr)
    @ff_manifest = JSON.parse(@fmb.build, :symbolize_names => true)
  end

  describe '#build' do

    it "sets name to short name" do
      @ff_manifest[:name].should == 'fake_ff_extension'
    end

    it "sets license to MPL 2.0" do
      @ff_manifest[:license].should == 'MPL 2.0'
    end

    it "sets author" do
      @ff_manifest[:author].should == 'Meee'
    end

    it "sets version to string" do
      @ff_manifest[:version].should == '9.9'
    end

    it "sets full name" do
      @ff_manifest[:fullName].should == 'Fake ff extension'
    end

    it "sets id to firefox id" do
      @ff_manifest[:id].should == '123'
    end

    it "sets description" do
      @ff_manifest[:description].should == "It's for testing"
    end
  end

  describe '#generate_short_name' do
    before :each do
      @fmb = FirefoxManifestBuilder.new(nil)
    end

    it "lowercases text" do
      @fmb.send(:generate_short_name, 'IAMBIG').should == 'iambig'
    end

    it "removes non-letters and symbols" do
      @fmb.send(:generate_short_name, '>_letters,numb3333rsspaces      !!!?').should == '_letters_numb3333rsspaces_'
    end
  end

  describe '#build_mainjs' do
    it "returns correct JS" do
      @fmb.build_mainjs.should ==<<EOJS
const pageMod = require('page-mod');
const data = require('self').data;
pageMod.PageMod({
  include: 'somesite.com',
  contentScriptWhen: 'ready',
  contentScriptFile: data.url('firefox.js')
});
EOJS
    end
  end
end