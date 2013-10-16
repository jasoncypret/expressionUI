# * https://github.com/jasoncypret/expressionUI
# *
# * Copyright (c) 2013 Jason Cypret (http://jasoncypret.com/)
# * Licensed under the MIT License
# 
(($) ->
  methods =
    defaults:
      title: "Alert"
      id: "modal"
      closeID: "closeDialog"
      overlay: true
      overlayMrk: "<div class=\"pageOverlay\"></div>"
      appendTo: "body"
      threshold: 15
      ajax: ""
      ajaxTarget: ""
      autoresize: true
      notify: false
      width: "auto"
      height: "auto"
      header: true
      headerContent: ""
      footer: true
      removeContent: false
      buttons: [
        buttonText: "Ok"
        callback: ->
          return

        defaultButton: true
      ]
      beforeOpen: $.noop
      afterOpen: $.noop
      beforeClose: $.noop
      afterClose: $.noop
      afterAjax: $.noop

    init: (options) ->
      options = $.extend({}, methods.defaults, options)
      $(this).modal "_open", options

    _open: (options) ->
      options.beforeOpen()
      overlay = ""
      isMobile = ""
      buildModal = undefined
      buttons = ""
      $.each options.buttons, (i, btn) ->
        defaultBtn = ""
        defaultBtn = " defaultButton"  unless typeof btn.defaultButton is "undefined"
        className = ""
        className = btn.className  unless typeof btn.className is "undefined"
        buttons += "<a href=\"javascript:;\" id=\"modalBtn" + i + "\" class=\"" + className + defaultBtn + "\"><span>" + btn.buttonText + "</span></a>"

      options.width = options.width + "px"  unless options.width is "auto"
      overlay = options.overlayMrk  if options.overlay
      buildModal = "<div id=\"" + options.id + "\" class=\"modal_wrapper " + isMobile + " " + options.height + "\">" + overlay + "<div style=\"width:" + options.width + ";\" class=\"modal\">"
      if options.header
        buildModal += "<h1><span class=\"wrapper\"><span class=\"title\">" + options.title + "</span><a href=\"javascript:;\" id=\"" + options.closeID + "\" class=\"closeDialog " + options.closeClass + "\">x</a></span></h1>"
      else
        buttons += "<a href=\"javascript:;\" class=\"closeDialog\"><span>Cancel</span></a>"
      buildModal += "<div class=\"modalBody\"><div class=\"wrapper\"><div class=\"d_content\"></div></div></div>"
      buildModal += "<div class=\"modalFooter\"><span class=\"wrapper\">" + buttons + "</span></div>"  if options.footer
      buildModal += "</div></div>"
      $(options.appendTo).append buildModal
      $(options.headerContent).appendTo("#" + options.id + " h1 .wrapper").css "display", "block"  if options.headerContent and options.header
      $(this).appendTo("#" + options.id + " .d_content").css "display", "block"
      $(this).modal "ajax", options  if options.ajax
      $("#" + options.id + " .modal").modal "position", options
      $("#" + options.id).modal "_setupEvents", options
      $(options.appendTo).addClass "modal_open"
      options.afterOpen.call()

    ajax: (options) ->
      _this = $(this)
      options.ajax = options.ajax + " " + options.ajaxTarget  if options.ajaxTarget
      if options.notify
        $(_this).parents(".modalBody").notify
          style: "none"
          position: "middle"
          loading: "circles"
          sticky: true
          content: "hidden"

      _this.load options.ajax, (response, status, xhr) ->
        $(_this).parents(".modalBody").find(".notify").notify "close"
        setTimeout =>
          options.afterAjax.call()
        , 100
        if status is "error"
          msg = "Sorry but there was an error: "
          alert msg + xhr.status + " " + xhr.statusText


    close: (options={}) ->
      # TODO: This is not extending!
      options = $.extend({}, methods.defaults, options)
      if $(".modal")[1]
        amount = $(".modal").length - 1
        $.each $(".modal"), (i, v) ->
          $(v).parents(".modal_wrapper").fadeOut "fast"  if i is amount

      else
        $(options.appendTo).removeClass("modal_open").addClass "modal_close"
      options.beforeClose()
      modal_content = $(this).find(".d_content").children()
      parent = $(this).parents(".modal_wrapper")
      body = $(this).find(".modalBody")
      b_width = body.outerWidth()
      b_height = body.outerHeight()
      body.css
        width: b_width
        height: b_height

      unless options.removeContent
        modal_content.appendTo(options.appendTo).css "display", "none"
        $(options.headerContent).appendTo(options.appendTo).css "display", "none"  if options.headerContent and options.header
      else
        modal_content.remove()
      setTimeout (->
        $(options.appendTo).removeClass "modal_close"  unless $(".modal")[1]
        parent.remove()
        $(window).unbind "resize.modal"
      ), 1000
      options.afterClose()

    _setupEvents: (options) ->
      _this = $(this)
      if options.autoresize
        $(window).bind "resize.modal", ->
          _this.find(".modal").modal "position", options

      $(this).find(".modalFooter a:not(.closeDialog)").each (i) ->
        $(this).click (if options.buttons[i].context then ->
          options.buttons[i].callback.apply options.buttons[i].context
         else options.buttons[i].callback)

      $(this).find(".closeDialog").click ->
        (if (typeof options.closeCallback is "undefined") then $("#" + options.id + " .modal").modal("close", options) else options.closeCallback())


    position: (options) ->
      modal = $(this)
      modal.css "bottom", "auto"
      modalHeight = modal.outerHeight()
      modalPadding = modalHeight - modal.height()
      win = $(window).height()
      threshold = options.threshold
      if options.height is "auto"
        if modalHeight > (win - (threshold * 2))
          modal.css
            top: threshold
            bottom: threshold
            "margin-left": -(modal.outerWidth() / 2)
            "margin-top": 0

        else
          modal.css
            top: "50%"
            "margin-top": -(modal.outerHeight() / 2)
            "margin-left": -(modal.outerWidth() / 2)

      else
        modal.css
          top: threshold
          bottom: threshold
          "margin-left": -(modal.outerWidth() / 2)


  $.fn.modal = (method) ->
    if methods[method]
      methods[method].apply this, Array::slice.call(arguments, 1)
    else if typeof method is "object" or not method
      methods.init.apply this, arguments
    else
      $.error "Method " + method + " does not exist on jQuery.Modal"
) jQuery