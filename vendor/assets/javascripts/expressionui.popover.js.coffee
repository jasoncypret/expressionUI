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
        content: jQuery(".popover")
        padding: 5
        flush: false
        fixed: true
        close_on_scroll: false
        scroll_target: jQuery(document)
        scroll_threshold: 5
        close_on_click: "anywhere"
        restrict_close_click: null
        reposition_on_resize: false
        tooltip: false
        arrow_height: 12
        arrow_offset: 35
        arrow_position: null
        position_top: null
        position_left: null
        outter_height: null
        outter_width: null
        afterOpen: jQuery.noop
        afterClose: jQuery.noop
        afterReposition: jQuery.noop

      init: (options) ->
        if typeof options.content is "string"
          jQuery('.popover').remove()
          jQuery('body').append '<div class="popover">' + options.content + '</div>'
          options.content = methods.defaults.content = jQuery('.popover')
        options = jQuery.extend({}, methods.defaults, options)
        options.tooltipHeight = 0
        options.tooltipWidth = 0
        jQuery(this).popover "_get_width_height", options
        jQuery(this).popover "_get_center_position", options
        options.arrow_position = jQuery(this).popover("_positionArrow", options)  unless options.arrow_position
        jQuery(this).popover "_init_class_styles", options
        options.tooltipHeight = options.content.outerHeight()
        options.tooltipWidth = options.content.outerWidth()
        jQuery(this).popover "_position_popover", options
        options.content.css(
          left: options.position_left + "px"
          top: options.position_top + "px"
          display: "none"
          visibility: "visible"
        ).show()
        options.afterOpen.apply this, [options.content]
        jQuery(this).popover "_setupEvents", options

      close: (options) ->
        jQuery(".active.popover_target").removeClass "active popover_target"
        options = jQuery.extend({}, methods.defaults, options)
        options.content = this  unless jQuery(options.content).length
        jQuery(options.content).removeClass("popover_container topleft bottomleft topright bottomright tooltip flush").attr("style", "").hide()
        jQuery(this).popover "_destroyEvents", options
        options.afterClose.apply this, [options.content]

      _get_center_position: (options) ->
        if options.position_left is null
          options.position_left = jQuery(this).offset().left + (options.outter_width / 2)
        else
          options.position_left += (options.outter_width / 2)
        if options.position_top is null
          options.position_top = jQuery(this).offset().top + (options.outter_height / 2)
        else
          options.position_top += (options.outter_height / 2)

      _get_width_height: (options) ->
        options.outter_height = (if (jQuery(this).outerHeight() is 0) then jQuery(this).attr("height") else jQuery(this).outerHeight())  if options.outter_height is null
        options.outter_width = (if (jQuery(this).outerWidth() is 0) then jQuery(this).attr("width") else jQuery(this).outerWidth())  if options.outter_width is null

      _destroyEvents: (options) ->
        jQuery(document).unbind "click.popover"
        jQuery(options.scroll_target).unbind "scroll.popover"
        jQuery(window).unbind "resize.popover"

      _setupEvents: (options) ->
        if options.reposition_on_resize
          jQuery(window).bind "resize.popover", =>
            options.position_left = null
            options.position_top = null
            options.outter_height = null
            options.outter_width = null
            @popover "reposition_popover", options

        jQuery(document).unbind("click.popover").bind "click.popover", (event) =>
          container = jQuery(".popover_container")
          switch options.close_on_click
            when "anywhere"
              if !!options.restrict_close_click
                jQuery(this).popover "close", options  if jQuery.inArray(event.target, options.restrict_close_click)
              else
                jQuery(this).popover "close", options
            when "outside"
              if !!options.restrict_close_click
                jQuery(this).popover "close", options  if not container.is(event.target) and container.has(event.target).length is 0 and jQuery.inArray(event.target, options.restrict_close_click)
              else
                jQuery(this).popover "close", options  if not container.is(event.target) and container.has(event.target).length is 0

        if options.close_on_scroll
          jQuery(options.scroll_target).bind "scroll.popover", =>
            jQuery(document).trigger "content.scroll"
            jQuery(this).popover "close", options  if jQuery(options.scroll_target).scrollTop() >= options.scroll_threshold

      _positionArrow: (options) ->
        winTopMax = jQuery(window).height() / 2
        winLeftMax = jQuery(window).width() / 2
        pos = ""
        (if (options.position_top >= 1 and options.position_top <= winTopMax) then pos = "top" else pos = "bottom")
        (if (options.position_left >= 1 and options.position_left + jQuery(options.scroll_target).scrollLeft() <= winLeftMax) then pos += "left" else pos += "right")
        pos

      reposition_popover: (options) ->
        options = jQuery.extend({}, methods.defaults, options)
        jQuery(this).popover "_remove_class_styles", options
        options.arrow_position = null
        options.tooltipHeight = 0
        options.tooltipWidth = 0
        jQuery(this).popover "_get_width_height", options
        jQuery(this).popover "_get_center_position", options
        options.arrow_position = jQuery(this).popover("_positionArrow", options)  unless options.arrow_position
        jQuery(this).popover "_add_class_styles", options
        options.tooltipHeight = options.content.outerHeight()
        options.tooltipWidth = options.content.outerWidth()
        jQuery(this).popover "_position_popover", options
        options.content.animate
          top: options.position_top
          left: options.position_left
          queue: false
        ,
          500
        , ->
          options.afterReposition.apply this, [options.content]


      _position_popover: (options) ->
        switch options.arrow_position
          when "topleft"
            if options.flush
              options.position_top = options.outter_height
              options.position_left += -(options.outter_width / 2)
            else
              options.position_top += (options.outter_height / 2) + options.arrow_height + options.padding
              options.position_left += -(options.arrow_offset)
          when "bottomleft"
            options.position_top += -options.tooltipHeight - (options.outter_height / 2) - options.arrow_height - options.padding
            options.position_left += -(options.arrow_offset)
          when "topright"
            options.position_top += (options.outter_height / 2) + options.arrow_height + options.padding
            options.position_left += -(options.tooltipWidth) + (options.arrow_offset)
          when "bottomright"
            options.position_top += -options.tooltipHeight - (options.outter_height / 2) - options.arrow_height - options.padding
            options.position_left += -(options.tooltipWidth) + (options.arrow_offset)
        options.position_left = jQuery(this).offset().left + (options.outter_width / 2) - (options.tooltipWidth / 2)  if options.tooltip

      _remove_class_styles: (options) ->
        options.content.removeClass "topleft bottomleft topright bottomright"

      _add_class_styles: (options) ->
        options.content.addClass "popover_container " + options.arrow_position

      _init_class_styles: (options) ->
        options.content.addClass("popover_container " + options.arrow_position).css
          visibility: "hidden"
          display: "block"
          zIndex: "9999"

        options.content.addClass "flush"  if options.flush
        options.content.addClass "tooltip"  if options.tooltip
        options.content.css position: "fixed"  if options.fixed
        options.content.css position: "absolute"  unless options.fixed
        jQuery(this).addClass "active popover_target"

    jQuery.fn.popover = (method, evt) ->
      if evt?
        evt.stopPropagation() if evt.stopPropagation?
      if methods[method]
        methods[method].apply this, Array::slice.call(arguments, 1)
      else if typeof method is "object" or not method
        methods.init.apply this, arguments
      else
        jQuery.error "Method " + method + " does not exist on expressionui.popover"
  ) jQuery