# Expressionui

A set of small JavaScript and SASS plugins that are designed to be reusable and enhance your UI. Ready to play with the Rails Asset Pipeline for faster and easier web development.

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'expressionui'
```

And then execute:

```
$ bundle
```

Or install it yourself as:

```
$ gem install expressionui
```


## Add to your application

To require all UI modules, add the following to your application.js:

```javascript
//= require expressionui.all.js
```

Also add the expressionui sass to your application.css.sass:

```sass
@import expressionui
```

##Require Specific Modules

If you don't need all the awesomeness just bring in what you'd like

###JavaScript

```javascript
//= require expressionui.popover.js
//= require expressionui.notify.js
//= require expressionui.modal.js
```

###SASS

```sass
@import expressionui/variables
@import expressionui/helpers
@import expressionui/notifications
@import expressionui/modals
@import expressionui/forms
@import expressionui/popover
@import expressionui/boilerplate
@import expressionui/class_helpers
@import expressionui/post_style
```

###Fix for Rails 4.0

add this line above expressionuiin your gemfile. This is a temporary fix untill the [pull request](https://github.com/MikeAski/animate.sass-rails/pull/3) is complete: 

```ruby
gem 'animate.sass-rails', :git => 'git://github.com/jasoncypret/animate.sass-rails.git'
```

####Node Support
We've starting playing around with node. We've made it so you can use this gem in your node projects. Just include the github repo and path to the sass files in you application. If there's greater interest we will make a standalone node package.
```
"expressionUI": "git://github.com/jasoncypret/expressionUI.git",
```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
