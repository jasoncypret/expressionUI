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
        duration: 5000
        content: "visible"
        text_align: "bottom"
        beforeOpen: jQuery.noop
        afterOpen: jQuery.noop
        beforeClose: jQuery.noop
        afterClose: jQuery.noop

      init: (options) ->
        options = jQuery.extend({}, methods.defaults, options)
        unless options.allow_multiple
          selector = ""
          switch options.append_type
            when "prepend", "append"
              selector = jQuery(this).find(".notify")
            when "after"
              selector = jQuery(this).next(".notify")
            when "before"
              selector = jQuery(this).prev(".notify")
          jQuery(selector).notify "close", options, false  if selector.length > 0
          jQuery(this).notify "_add_markup", options
        else
          jQuery(this).notify "_add_markup", options

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
        jQuery(this).notify "_open", options, markup

      _open: (options, markup) ->
        selector = undefined
        options.beforeOpen()
        jQuery(this).addClass("notify_container content_" + options.content)[options.append_type] markup
        switch options.append_type
          when "prepend", "append"
            selector = jQuery(this).find(".notify[style*='display']")
          when "after"
            selector = jQuery(this).next(".notify[style*='display']")
          when "before"
            selector = jQuery(this).prev(".notify[style*='display']")
        jQuery(selector).slideDown "fast"
        options.afterOpen()
        jQuery(this).notify "_setupEvents", options, selector

      close: (options, animate) ->
        selector = undefined
        animate = (if typeof animate isnt "undefined" then animate else true)
        options = jQuery.extend({}, methods.defaults, options)
        options.beforeClose()
        switch options.append_type
          when "prepend", "append", "before"
            selector = jQuery(this).parents(".notify_container")
          when "after"
            selector = jQuery(this).prev(".notify_container")

        if animate
          jQuery(this).slideUp "fast", ->
            jQuery(selector).removeClass "content_hidden content_overlay content_visible notify_container"
            jQuery(this).remove()
        else
          jQuery(selector).removeClass "content_hidden content_overlay content_visible notify_container"
          return jQuery(this).remove()

        options.afterClose()

      close_all: (options) ->
        options = jQuery.extend({}, methods.defaults, options)
        options.beforeClose()
        jQuery(".notify").slideUp "fast", ->
          jQuery(this).closest("[class^=content_]").removeClass "content_hidden content_overlay content_visible"
          jQuery(this).remove()

        options.afterClose()

      loading: (options) ->
        options = jQuery.extend({}, methods.defaults, options)

      _setupEvents: (options, selector) ->
        unless options.sticky
          t = setTimeout(->
            jQuery(selector).notify "close", options
            clearTimeout t
          , options.duration)
        jQuery(selector).click ->
          clearTimeout t
          jQuery(selector).notify "close", options


    jQuery.fn.notify = (method) ->
      if methods[method]
        methods[method].apply this, Array::slice.call(arguments, 1)
      else if typeof method is "object" or not method
        methods.init.apply this, arguments
      else
        jQuery.error "Method " + method + " does not exist on jQuery.Notify"
  ) jQuery
