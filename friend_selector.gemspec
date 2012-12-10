# -*- encoding: utf-8 -*-
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'friend_selector/version'

Gem::Specification.new do |gem|
  gem.name          = "friend_selector"
  gem.version       = FriendSelector::VERSION
  gem.authors       = ["John Butler"]
  gem.email         = ["john.butler@betapond.com"]
  gem.description   = %q{Provides a basic facebook friend selector implemented with Backbone}
  gem.summary       = %q{Provides a basic facebook friend selector}
  gem.homepage      = ""

  gem.files         = `git ls-files`.split($/)
  gem.executables   = gem.files.grep(%r{^bin/}).map{ |f| File.basename(f) }
  gem.test_files    = gem.files.grep(%r{^(test|spec|features)/})
  gem.require_paths = ["lib"]

  gem.add_dependency 'rails', '>=3.2'
  gem.add_dependency 'ejs'
end
