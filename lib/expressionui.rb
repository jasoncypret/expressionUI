require "expressionui/version"

module Expressionui
  module Rails
    class Engine < ::Rails::Engine
      require 'animate.sass-rails'
    end
  end
end