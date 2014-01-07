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
      overlayMrk: "<div class='pageOverlay'></div>"
      close_on_overlay: false
      enter_to_submit: false
      appendTo: "body"
      animation: ""
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

      _this.load options.ajax, (response, status, xhr) =>
        $(_this).parents(".modalBody").find(".notify").notify "close"
        setTimeout =>
          options.afterAjax.call()
          _this.parents(".modal:first").modal "position", options
        , 100
        if status is "error"
          msg = "Sorry but there was an error: "
          alert msg + xhr.status + " " + xhr.statusText


    close: (options={}) ->
      options = $.extend({}, methods.defaults, options) # TODO: This is not extending!
      modal_content = $(this).find(".d_content").children()
      parent = $(this).parents(".modal_wrapper")
      m  = $(".modal")
      remove_and_clean = ->
        unless options.removeContent
          modal_content.appendTo(options.appendTo).css "display", "none"
          $(options.headerContent).appendTo(options.appendTo).css "display", "none"  if options.headerContent and options.header
        else
          modal_content.remove()

        unless m[1]
          $(options.appendTo).removeClass "modal_close"
          $(window).unbind "resize.modal"
        parent.remove()
        $(this).unbind 'oanimationend animationend webkitAnimationEnd'
        options.afterClose()

      options.beforeClose()

      # Checking for multiple open
      if m[1]
        $(m[m.length - 1]).fadeOut "fast", =>
          remove_and_clean()
      else
        $(this).bind 'oanimationend animationend webkitAnimationEnd',  =>
          remove_and_clean()
        $(options.appendTo).removeClass("modal_open").addClass "modal_close"

    _setupEvents: (options) ->
      _this = $(this)
      
      if options.autoresize
        $(window).bind "resize.modal", ->
          _this.find(".modal").modal "position", options
      
      if options.enter_to_submit
        form = $(this).find 'form'
        $(document).bind('keypress', (e) =>
          code = e.keyCode || e.which
          if code == 13
            form.submit()
            options.submit_callback() if (typeof options.submit_callback is not "undefined") 
        )

      if options.overlay and options.close_on_overlay
        parser = new DOMParser()
        over = parser.parseFromString(options.overlayMrk, "text/xml");
        klass = $(over.firstChild).attr('class')
        $("." + klass).click( =>
          (if (typeof options.closeCallback is "undefined") then $("#" + options.id + " .modal").modal("close", options) else options.closeCallback())
        )

      $(this).find(".modalFooter a:not(.closeDialog)").each( (i, e) =>
        $(e).click( =>
          if (options.buttons[i].context)
            options.buttons[i].callback.apply options.buttons[i].context
          else
            options.buttons[i].callback()
        )
      ) 

      $(this).find(".closeDialog").click ->
        # TODO: Should prob make this a default for easier reading
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