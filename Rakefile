namespace :jasmine do
  require 'jasmine'

  desc "Run continuous integration tests"
  require "spec"
  require 'spec/rake/spectask'
  Spec::Rake::SpecTask.new(:ci) do |t|
    t.spec_opts = ["--color", "--format", "specdoc"]
    t.verbose = true
    t.spec_files = ['spec/javascripts/support/jasmine_runner.rb']
  end
    task :server do
      jasmine_config_overrides = 'spec/javascripts/support/jasmine_config.rb'
      require jasmine_config_overrides if File.exists?(jasmine_config_overrides)
      
      puts "your tests are here:"
      puts "  http://localhost:8888/run.html"

      Jasmine::Config.new.start_server
    end
end

desc "Run specs via server"
task :jasmine => ['jasmine:server']
