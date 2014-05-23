# * https://github.com/jasoncypret/expressionUI
# *
# * Copyright (c) 2013 Jason Cypret (http://jasoncypret.com/)
# * Licensed under the MIT License
#
((factory) ->
  "use strict"
  if typeof define is "function" and define.amd
    # Register as an anonymous AMD module:
    define [
      "jquery"
    ], factory
  else
    # Not using AMD
    factory window.jQuery
  return
) (jQuery) ->
  ((jQuery) ->
    methods =
      defaults:
        views: null
        view: null
        first_view: null
        before_push: jQuery.noop
        before_back: jQuery.noop
        after_push: jQuery.noop
        after_back: jQuery.noop

      _init: (options) ->
        options = jQuery.extend({}, methods.defaults, options)
        jQuery(this).data history: []
        options.views = jQuery(this).children() if options.views is null
        if options.first_view is null
          options.views.each( (i, e) =>
            e = jQuery(e)
            if e.is(':visible')
              e.addClass('p_active')
          )
        else
          options.first_view.addClass('p_active')


      push: (options) ->
        options = jQuery.extend({}, methods.defaults, options)
        options.before_push()
        history = jQuery(this).data().history
        history.push jQuery(this).find('.p_active')
        jQuery(this).pushview("_bind_push_events", options)
        jQuery(this).find('.p_active').addClass('pull_out')
        options.view.addClass('push_in').css('display': 'block')

      back: (options) ->
        options = jQuery.extend({}, methods.defaults, options)
        options.before_back()
        back_element = jQuery(this).data().history.pop()
        options.view = back_element
        jQuery(this).pushview("_bind_back_events", options)
        jQuery(this).find('.p_active').addClass('push_out')
        back_element.addClass('pull_in').css('display': 'block')

      _after_push_animate: (options) ->
        container = jQuery(this)
        container.find('.p_active').hide().removeClass('p_active push_out pull_out push_in pull_in')
        options.view.css('display': 'block').addClass('p_active').removeClass('push_in')
        container.pushview("_unbind_events", options)
        options.after_push()

      _after_back_animate: (options) ->
        container = jQuery(this)
        container.find('.p_active').hide().removeClass('p_active push_out pull_out push_in pull_in')
        options.view.addClass('p_active').removeClass('push_in pull_in')
        container.pushview("_unbind_events", options)
        options.after_back()

      revert: (options) ->
        # remove all history

      destroy: (options) ->
        ele = jQuery(this).find('.p_active, .push_in, .pull_in, .push_out, .pull_out')
        ele.removeClass('p_active push_in pull_in push_out pull_out')
        ele.unbind 'oanimationend animationend webkitAnimationEnd'
        jQuery(this).removeData()

      _unbind_events: (options) ->
        options.view.unbind 'oanimationend animationend webkitAnimationEnd'

      _bind_back_events: (options) ->
        options.view.bind 'oanimationend animationend webkitAnimationEnd',  =>
          jQuery(this).pushview("_after_back_animate", options)

      _bind_push_events: (options) ->
        options.view.bind 'oanimationend animationend webkitAnimationEnd',  =>
          jQuery(this).pushview("_after_push_animate", options)


    jQuery.fn.pushview = (method) ->
      if methods[method]
        methods[method].apply this, Array::slice.call(arguments, 1)
      else if typeof method is "object" or not method
        methods._init.apply this, arguments
      else
        jQuery.error "Method " + method + " does not exist on jQuery.Pushview"
  ) jQuery