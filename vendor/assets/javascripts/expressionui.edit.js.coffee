# * https://github.com/jasoncypret/expressionUI
# *
# * Copyright (c) 2013 Jason Cypret (http://jasoncypret.com/)
# * Licensed under the MIT License
# 

####################
# EDIT-SI
####################

((w, d) ->
  "use strict"
  if typeof String::trim isnt "function"
    String::trim = ->
      @replace /^\s+|\s+$/g, ""


####################
# DEFAULTS
####################

  editsi = editsi or (userOpts) ->
    settings =
      debug: true
      element: null
      modifier: "auto"
      placeholder: ""
      autofocus: false
      autoHR: true
      mode: "rich"
      maxLength: -1
      delay: 0
      modifiers:
        66: "bold"
        73: "italicize"
        85: "underline"
        86: "paste"

      on_placeholder_hide: $.noop
      on_placeholder_show: $.noop
      clear_text: $.noop

      tags:
        paragraph: "p"
        outerLevel: ["pre", "blockquote", "figure", "hr"]
        innerLevel: ["a", "b", "u", "i", "img", "strong"]

      cssClasses:
        editor: "editsi"
        pasteHook: "paste-hook"
        placeholder: "placeholder"

  
####################
# NOT SURE ABOUT CACHE
####################

    cache =
      initialized: false
      cmd: false
      focusedElement: null

    _log = (w) ->
      console.log w if settings.debug


####################
# UTILITIES (RENAME TO HELPERS?)
####################

    utils =
      isCommand: (e, fnTrue, fnFalse) ->
        if (settings.modifier is "ctrl" and e.ctrlKey) or (settings.modifier is "cmd" and e.metaKey) or (settings.modifier is "auto" and (e.ctrlKey or e.metaKey))
          fnTrue.call()
        else
          fnFalse.call()

      isShift: (e, fnTrue, fnFalse) ->
        if e.shiftKey
          fnTrue.call()
        else
          fnFalse.call()

      isModifier: (e, fn) ->
        w = e.which
        cmd = settings.modifiers[w]
        fn.call null, cmd  if cmd

      isNotSpecial: (e) ->
        special =
          16: "shift"
          17: "ctrl"
          18: "alt"
          91: "cmd"
          8: "delete"

        return false  if cache.cmd
        (e.which not of special)

      addEvent: addEvent = (element, eventName, func) ->
        if element.addEventListener
          element.addEventListener eventName, func, false
        else element.attachEvent "on" + eventName, func  if element.attachEvent

      removeEvent: addEvent = (element, eventName, func) ->
        if element.addEventListener
          element.removeEventListener eventName, func, false
        else element.detachEvent "on" + eventName, func  if element.attachEvent

      preventDefaultEvent: (e) ->
        if e.preventDefault
          e.preventDefault()
        else
          e.returnValue = false

      getElementsByClassName: (classname, el) ->
        el = (if el then el else document.body)
        a = []
        re = new RegExp("(^| )" + classname + "( |$)")
        els = el.getElementsByTagName("*")
        i = 0
        j = els.length

        while i < j
          a.push els[i]  if re.test(els[i].className)
          i++
        a

      deepExtend: (destination, source) ->
        for property of source
          if source[property] and source[property].constructor and source[property].constructor is Object
            destination[property] = destination[property] or {}
            utils.deepExtend destination[property], source[property]
          else
            destination[property] = source[property]
        destination


      pasteHook: (fn) ->
        input = d.createElement("textarea")
        input.className = settings.cssClasses.pasteHook
        settings.element.appendChild input
        pasteHookNode = utils.getElementsByClassName(settings.cssClasses.pasteHook, settings.element)[0]
        pasteHookNode.focus()
        setTimeout (->
          v = pasteHookNode.value
          fn.call null, v
          utils.html.deleteNode pasteHookNode
        ), 1

      check_select: () ->
        sel = utils.selection.saveSelection()
        options =
          content: $(".popover")
          close_on_scroll: true
          scroll_target: $(".content_scroll")
          close_on_click: "none"
          reposition_on_resize: false
          outter_width: 0
          outter_height: 0
          position_left: 0
          position_top: 0
          afterClose: ->
            _log "Popover Closed"
        
        if !sel.collapsed
          _log "Text Selection"
          cords = utils.getSelectionCoords()
          dems = utils.getSelectionDimensions()
          options.outter_width = dems[0]
          options.outter_height = dems[1]
          options.position_left = cords.x
          options.position_top = cords.y

          if $("#text_area").hasClass('popover_target')
            $("#text_area").popover "reposition_popover", options
          else
            $("#text_area").popover options
        else
          $("#text_area").popover 'close', options
          _log "No Text Selection"

      

      getSelectionCoords: ->
        x = 0
        y = 0
        # Use standards-based method only if Range has getBoundingClientRect
        if window.getSelection and document.createRange and typeof document.createRange().getBoundingClientRect isnt "undefined"
          sel = window.getSelection()
          if sel.rangeCount > 0
            rect = sel.getRangeAt(0).getBoundingClientRect()
            x = rect.left
            y = rect.top
        else if document.selection and document.selection.type isnt "Control"
          # All versions of IE
          textRange = document.selection.createRange()
          x = textRange.boundingLeft
          y = textRange.boundingTop
        x: x
        y: y

      getSelectionDimensions: ->
        sel = window.getSelection()
        range = undefined
        rect = undefined
        width = 0
        height = 0
        if sel.rangeCount
          range = sel.getRangeAt(0).cloneRange()
          if range.getBoundingClientRect
            rect = range.getBoundingClientRect()
            width = rect.right - rect.left
            height = rect.bottom - rect.top
        [width, height]



      ####################
      # GET SELECTION
      ####################

      selection:
        saveSelection: ->
          if window.getSelection
            sel = window.getSelection()
            return sel.getRangeAt(0)  if sel.rangeCount > 0
          else return d.selection.createRange() if d.selection and d.selection.createRange
          null

        restoreSelection: (range) ->
          if range
            if w.getSelection
              sel = w.getSelection()
              sel.removeAllRanges()
              sel.addRange range
            else range.select()  if d.selection and range.select

      cursor:
        set: (pos, el) ->
          if d.createRange
            range = d.createRange()
            selection = window.getSelection()
            lastChild = utils.html.lastChild()
            length = utils.html.text(lastChild).length - 1
            toModify = (if el then el else lastChild)
            theLength = (if typeof pos isnt "undefined" then pos else length)
            range.setStart toModify, theLength
            range.collapse true
            selection.removeAllRanges()
            selection.addRange range
          else
            range = d.body.createTextRange()
            range.moveToElementText el
            range.collapse false
            range.select()




      ####################
      # HTML PARSING
      ####################

      html:
        text: (node, val) ->
          node = node or settings.element
          if val
            if (node.textContent) and (typeof (node.textContent) isnt "undefined")
              node.textContent = val
            else
              node.innerText = val
          (node.textContent or node.innerText).trim()

        changeTag: (oldNode, newTag) ->
          newNode = d.createElement(newTag)
          node = undefined
          nextNode = undefined
          node = oldNode.firstChild
          while node
            nextNode = node.nextSibling
            newNode.appendChild node
            node = nextNode
          oldNode.parentNode.insertBefore newNode, oldNode
          oldNode.parentNode.removeChild oldNode

        deleteNode: (el) ->
          el.parentNode.removeChild el

        placeholders: ->
          placeholders = utils.getElementsByClassName(settings.cssClasses.placeholder, settings.element)
          innerText = utils.html.text(settings.element)
          if innerText is ""
            settings.element.innerHTML = ""
            if settings.placeholder.length > 0
              utils.html.addTag settings.tags.paragraph, false, false
              c = utils.html.lastChild()
              c.className = settings.cssClasses.placeholder
              utils.html.text c, settings.placeholder
            utils.html.addTag settings.tags.paragraph, (if cache.initialized then true else settings.autofocus)
            settings.on_placeholder_show.apply this, [settings.element]
          else
            if innerText isnt settings.placeholder
              i = undefined
              i = 0
              while i < placeholders.length
                utils.html.deleteNode placeholders[i]
                i++
              settings.on_placeholder_hide.apply this, [settings.element]

        clean: ->

          ## Need to add more
          ## Heading can contain only em's??
          ## pre Can contain code??
          ## blockquote links em bold
          ## hr NOTHING

          attsToRemove = ["style", "class"]
          only = (settings.tags.outerLevel).concat([settings.tags.paragraph])
          children = settings.element.children
          i = undefined
          j = undefined
          k = undefined
          i = 0
          while i < children.length
            child = children[i]
            nodeName = child.nodeName
            shouldDelete = true
            k = 0
            while k < attsToRemove.length
              child.removeAttribute attsToRemove[k]  if child.getAttribute(attsToRemove[k]) isnt settings.cssClasses.placeholder  if child.hasAttribute(attsToRemove[k])
              k++
            j = 0
            while j < only.length
              shouldDelete = false  if only[j] is nodeName.toLowerCase()
              j++
            if shouldDelete
              switch nodeName.toLowerCase()
                when "div"
                  utils.html.changeTag child, settings.tags.paragraph
                else
                  utils.html.deleteNode child
            i++

        lastChild: ->
          settings.element.lastChild

        addTag: (tag, shouldFocus, isEditable, afterElement) ->
          newEl = d.createElement(tag)
          toFocus = undefined
          newEl.contentEditable = false  if typeof isEditable isnt "undefined" and isEditable is false
          newEl.innerHTML = " "
          if afterElement and afterElement.nextSibling
            afterElement.parentNode.insertBefore newEl, afterElement.nextSibling
            toFocus = afterElement.nextSibling
          else
            settings.element.appendChild newEl
            toFocus = utils.html.lastChild()
          if shouldFocus
            cache.focusedElement = toFocus
            utils.cursor.set 0, toFocus




####################
# Intercept Keyboard Commands
####################

    intercept =

      focus: (e) ->
        _log 'Focused'

      mouse_down: (e) ->
        _log 'Mouse Pressed'
        # utils.check_select()
        
      mouse_up: (e) ->
        _log 'Mouse De-Pressed'
        utils.check_select()

      key_down: (e) ->
        
        # utils.check_select()

        # DETECTS CMD
        utils.isCommand e, (->
          cache.cmd = true
          _log 'CMD'
        ), ->
          cache.cmd = false

        # DETECTS Shift Key
        utils.isShift e, (->
          cache.shift = true
          _log 'Shift'
        ), ->
          cache.shift = false

        # DETECTS CMD + MODIFIER
        utils.isModifier e, (cmd) ->
          if cache.cmd
            return  if ((settings.mode is "inline") or (settings.mode is "partial")) and cmd isnt "paste"
            intercept.command[cmd].call null, e
            _log command

        # CHECKS MAX LENGTH
        if settings.maxLength isnt -1
          ph = settings.element.getElementsByClassName(settings.cssClasses.placeholder)[0]
          len = utils.html.text().length
          len -= settings.placeholder.length  if settings.placeholder and ph
          return utils.preventDefaultEvent(e)  if len >= settings.maxLength and utils.isNotSpecial(e)
          _log len + "/" + settings.maxLength
        
        # DETECTS ENTER KEY
        intercept.enterKey.call null, e if e.which is 13
        _log 'Key Pressed Down'


      key_up: (e) ->
        utils.isCommand e, (->
          cache.cmd = false
        ), ->
          cache.cmd = true

        # utils.html.clean()
        utils.html.placeholders()
        action.preserveElementFocus()
        utils.check_select()
        _log 'Key De-pressed'


      
      ## TODO: Add Blockquote x 2, H1, h2, Links


      ####################
      # CMD(⌘) + KEY
      ####################
      command:
        bold: (e) ->
          utils.preventDefaultEvent e
          d.execCommand "bold", false
          _log "⌘ + B"

        underline: (e) ->
          utils.preventDefaultEvent e
          d.execCommand "underline", false
          _log "⌘ + U"

        italicize: (e) ->
          utils.preventDefaultEvent e
          d.execCommand "italic", false
          _log "⌘ + I"

        quote: (e) ->
          _log '⌘ + "'

        paste: (e) ->
          sel = utils.selection.saveSelection()
          utils.pasteHook (text) ->
            utils.selection.restoreSelection sel
            d.execCommand "insertHTML", false, text.replace(/\n/g, "<br>")
          _log '⌘ + V'


      ####################
      # Pressed Enter
      ####################

      enterKey: (e) ->

        ## THIS IS A PROBLEM BOTCH

        return utils.preventDefaultEvent(e) if settings.mode is "inline"
        
        unless cache.shift
          utils.preventDefaultEvent e
          focusedElement = cache.focusedElement
          if settings.autoHR and settings.mode isnt "partial"
            children = settings.element.children
            lastChild = children[children.length - 1]
            makeHR = (utils.html.text(lastChild) is "") and (lastChild.nodeName.toLowerCase() is settings.tags.paragraph)
            if makeHR and children.length >= 2
              secondToLast = children[children.length - 2]
              makeHR = false  if secondToLast.nodeName.toLowerCase() is "hr"
            if makeHR
              utils.preventDefaultEvent e
              utils.html.deleteNode lastChild
              utils.html.addTag "hr", false, false, focusedElement
              focusedElement = focusedElement.nextSibling
            utils.html.addTag settings.tags.paragraph, true, null, focusedElement
          else
            utils.html.addTag settings.tags.paragraph, true, null, focusedElement

        _log "Pressed Enter"



####################
# EVENTS
####################

    action =
      listen: ->

        ## TODO: FIX UP AND DOWN

        utils.addEvent settings.element, "click", intercept.mouse_down
        utils.addEvent settings.element, "mouseup", intercept.mouse_up
        utils.addEvent settings.element, "keyup", intercept.key_up
        utils.addEvent settings.element, "keydown", intercept.key_down
        utils.addEvent settings.element, "focus", intercept.focus

      preserveElementFocus: ->
        anchorNode = (if w.getSelection then w.getSelection().anchorNode else d.activeElement)
        if anchorNode
          cur = anchorNode.parentNode
          children = settings.element.children
          diff = cur isnt cache.focusedElement
          elementIndex = 0
          i = undefined
          cur = anchorNode  if cur is settings.element
          i = 0
          while i < children.length
            if cur is children[i]
              elementIndex = i
              break
            i++
          if diff
            cache.focusedElement = cur
            cache.focusedElementIndex = elementIndex





####################
# INIT & DESTROY
####################
    init = (opts) ->
      for key of settings
        if typeof settings[key] isnt "object" and settings.hasOwnProperty(key) and opts.element.getAttribute("data-editsi-" + key)
          newVal = opts.element.getAttribute("data-editsi-" + key)
          newVal = newVal.toLowerCase() is "true"  if newVal.toLowerCase() is "false" or newVal.toLowerCase() is "true"
          settings[key] = newVal
      utils.deepExtend settings, opts
      settings.element.contentEditable = true
      settings.element.className += (" ") + settings.cssClasses.editor
      settings.element.className += (" ") + settings.cssClasses.editor + "-" + settings.mode
      utils.html.clean()
      utils.html.placeholders()
      action.preserveElementFocus()
      action.listen()
      cache.initialized = true

    @destroy = ->
      utils.removeEvent settings.element, "click", intercept.mouse_down
      utils.removeEvent settings.element, "mouseup", intercept.mouse_up
      utils.removeEvent settings.element, "keyup", intercept.key_up
      utils.removeEvent settings.element, "keydown", intercept.key_down
      utils.removeEvent settings.element, "focus", intercept.focus

    init userOpts

  module.exports = editsi  if typeof module isnt "undefined" and module.exports
  @editsi = editsi if typeof ender is "undefined"
  if typeof define is "function" and define.amd
    define "editsi", [], ->
      editsi

).call this, window, document