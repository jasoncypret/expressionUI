# * https://github.com/jasoncypret/expressionUI
# *
# * Copyright (c) 2013 Jason Cypret (http://jasoncypret.com/)
# * Licensed under the MIT License
# 
(($) ->
  methods =
    defaults:
      views: null
      view: null
      before_push: $.noop
      before_back: $.noop
      after_push: $.noop
      after_back: $.noop

    _init: (options) ->
      options = $.extend({}, methods.defaults, options)
      $(this).data history: []
      if options.views is null
        $(this).children().each( (i, e) =>
          e = $(e)
          if e.is(':visible')
            e.addClass('p_active')
        )

    push: (options) ->
      options = $.extend({}, methods.defaults, options)
      options.before_push()
      history = $(this).data().history
      history.push $(this).find('.p_active')
      $(this).pushview("_bind_push_events", options)
      $(this).find('.p_active').addClass('pull_out')
      options.view.addClass('push_in').show()

    back: (options) ->
      options = $.extend({}, methods.defaults, options)
      options.before_back()
      back_element = $(this).data().history.pop()
      options.view = back_element
      $(this).pushview("_bind_back_events", options)
      $(this).find('.p_active').addClass('push_out')
      back_element.addClass('pull_in').show()
    
    _after_push_animate: (options) ->
      container = $(this)
      container.find('.p_active').hide().removeClass('p_active push_out pull_out push_in pull_in')
      options.view.show().addClass('p_active').removeClass('push_in')      
      container.pushview("_unbind_events", options)
      options.after_push()

    _after_back_animate: (options) ->
      container = $(this)
      container.find('.p_active').hide().removeClass('p_active push_out pull_out push_in pull_in')
      options.view.addClass('p_active').removeClass('push_in pull_in')      
      container.pushview("_unbind_events", options)
      options.after_back()

    revert: (options) ->
      # remove all history

    destroy: (options) ->
      ele = $(this).find('.p_active, .push_in, .pull_in, .push_out, .pull_out')
      ele.removeClass('p_active push_in pull_in push_out pull_out')
      ele.unbind 'oanimationend animationend webkitAnimationEnd'
      $(this).removeData()

    _unbind_events: (options) ->
      options.view.unbind 'oanimationend animationend webkitAnimationEnd'

    _bind_back_events: (options) ->
      options.view.bind 'oanimationend animationend webkitAnimationEnd',  =>
        $(this).pushview("_after_back_animate", options)

    _bind_push_events: (options) ->
      options.view.bind 'oanimationend animationend webkitAnimationEnd',  =>
        $(this).pushview("_after_push_animate", options)


  $.fn.pushview = (method) ->
    if methods[method]
      methods[method].apply this, Array::slice.call(arguments, 1)
    else if typeof method is "object" or not method
      methods._init.apply this, arguments
    else
      $.error "Method " + method + " does not exist on jQuery.Pushview"
) jQuery