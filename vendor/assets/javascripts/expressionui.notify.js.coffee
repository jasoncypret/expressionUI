# * https://github.com/jasoncypret/expressionUI
# *
# * Copyright (c) 2013 Jason Cypret (http://jasoncypret.com/)
# * Licensed under the MIT License
# 
(($) ->
  methods =
    defaults:
      selector: ""
      message: null
      sticky: false
      width: "full"
      style: "success"
      append_type: "prepend"
      allow_multiple: false
      invert: false
      icon: true
      icon_character: null
      loading: null
      position: "top"
      duration: "7000"
      content: "visible"
      text_align: "bottom"
      beforeOpen: $.noop
      afterOpen: $.noop
      beforeClose: $.noop
      afterClose: $.noop

    init: (options) ->
      options = $.extend({}, methods.defaults, options)
      unless options.allow_multiple
        selector = ""
        switch options.append_type
          when "prepend", "append"
            selector = $(this).find(".notify")
          when "after"
            selector = $(this).next(".notify")
          when "before"
            selector = $(this).prev(".notify")
        $(selector).notify "close", options, false  if selector.length > 0
        $(this).notify "_add_markup", options
      else
        $(this).notify "_add_markup", options

    _add_markup: (options) ->
      markup = undefined
      if options.icon_character == null
        options.icon_character = "X"  if options.style is "error"
        options.icon_character = "R"  if options.style is "success"
        options.icon_character = "!"  if options.style is "tip"
        options.icon_character = '"'  if options.style is "info"
      options.message = ""  unless options.message
      markup = "<div style='display:none;' class='notify" + options.selector + " text_align_" + options.text_align + " style_" + options.style + " position_" + options.position + " width_" + options.width + " invert_" + options.invert + " loading_" + options.loading + " icon_" + options.icon + "'>"
      markup += "<div class='notify_wrap'>"
      markup += "<div class='icon'>" + options.icon_character + "</div>" if not options.loading? and options.icon
      switch options.loading
        when "dots"
          markup += "<div class='indicator'>"
          markup += "<div class='dot1'></div>"
          markup += "<div class='dot2'></div>"
          markup += "<div class='dot3'></div>"
          markup += "<div class='dot4'></div>"
          markup += "<div class='dot5'></div>"
          markup += "<div class='dot6'></div>"
          markup += "<div class='dot7'></div>"
          markup += "<div class='dot8'></div>"
          markup += "</div>"
          markup += "<div class='msg'>" + options.message + "</div>"
        when "spinner"
          markup += "<div class='indicator'></div>"
          markup += "<div class='msg'>" + options.message + "</div>"
        when "bars"
          markup += "<div class='indicator'><div class='progress'></div></div>"
          markup += "<div class='msg'>" + options.message + "</div>"
        when "circles"
          markup += "<div class='indicator'>"
          markup += "<div class='circle1'></div>"
          markup += "<div class='circle2'></div>"
          markup += "<div class='circle3'></div>"
          markup += "</div>"
          markup += "<div class='msg'>" + options.message + "</div>"
        else
          (if (options.style is "loading") then markup += "<div class='progress'></div><div class='msg'>" + options.message + "</div>" else markup += "<div class='msg'>" + options.message + "</div>")
          markup += "<a class='notify_close' href='javascript:;'><span>x</span></a>"
          markup += "</div>"
      markup += "</div>"
      $(this).notify "_open", options, markup

    _open: (options, markup) ->
      selector = undefined
      options.beforeOpen()
      $(this).addClass("notify_container content_" + options.content)[options.append_type] markup
      switch options.append_type
        when "prepend", "append"
          selector = $(this).find(".notify[style*='display']")
        when "after"
          selector = $(this).next(".notify[style*='display']")
        when "before"
          selector = $(this).prev(".notify[style*='display']")
      $(selector).slideDown "fast"
      options.afterOpen()
      $(this).notify "_setupEvents", options, selector

    close: (options, animate) ->
      selector = undefined
      animate = (if typeof animate isnt "undefined" then animate else true)
      options = $.extend({}, methods.defaults, options)
      options.beforeClose()
      switch options.append_type
        when "prepend", "append", "before"
          selector = $(this).parents(".notify_container")
        when "after"
          selector = $(this).prev(".notify_container")
      
      if animate
        $(this).slideUp "fast", ->
          $(selector).removeClass "content_hidden content_overlay content_visible notify_container"
          $(this).remove()
      else
        $(selector).removeClass "content_hidden content_overlay content_visible notify_container"
        return $(this).remove()
      
      options.afterClose()

    close_all: (options) ->
      options = $.extend({}, methods.defaults, options)
      options.beforeClose()
      $(".notify").slideUp "fast", ->
        $(this).closest("[class^=content_]").removeClass "content_hidden content_overlay content_visible"
        $(this).remove()

      options.afterClose()

    loading: (options) ->
      options = $.extend({}, methods.defaults, options)

    _setupEvents: (options, selector) ->
      unless options.sticky
        t = setTimeout(->
          $(selector).notify "close", options
          clearTimeout t
        , options.duration)
      $(selector).click ->
        clearTimeout t
        $(selector).notify "close", options


  $.fn.notify = (method) ->
    if methods[method]
      methods[method].apply this, Array::slice.call(arguments, 1)
    else if typeof method is "object" or not method
      methods.init.apply this, arguments
    else
      $.error "Method " + method + " does not exist on jQuery.Notify"
) jQuery
