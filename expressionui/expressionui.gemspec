# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'expressionui/version'

Gem::Specification.new do |spec|
  spec.name          = "expressionui"
  spec.version       = Expressionui::VERSION
  spec.authors       = ["Jason Cypret"]
  spec.email         = ["jason@jasoncypret.com"]
  spec.description   = "Some awesome SASS and JS shiz for your rails project"
  spec.summary       = "Some awesome SASS and JS shiz for your rails project"
  spec.homepage      = "http://jasoncypret.github.io/expressionUI/"
  spec.license       = "MIT"

  spec.files = Dir["{lib,vendor}/**/*"] + ["MIT-LICENSE", "README.md"]
  spec.require_paths = ["lib"]
  spec.add_development_dependency "bundler", "~> 1.3"
  spec.add_development_dependency "rake"
  spec.add_development_dependency "railties", "~> 3.1"
  spec.add_development_dependency "jquery-rails"
  spec.add_development_dependency "sass-rails", "~> 3.2.3"
  spec.add_development_dependency "compass-rails"
  spec.add_development_dependency "animate.sass-rails"
end


  
