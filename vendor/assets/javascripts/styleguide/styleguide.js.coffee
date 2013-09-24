#= require_tree .
#= require jquery

class ViewModel
  constructor: (first, last) ->
    @firstName = ko.observable(first)
    @lastName =  ko.observable(last)
    @fullName = ko.computed =>
      @firstName() + " " + @lastName()

  modal_default: ->
    $('#example_modal').modal()


  popover_default: (v, e) ->
    $(e.currentTarget).popover(
      content: $('#example_modal')
      close_on_click: 'outside'
    )

  $(".section.group .menu .btn").mouseover(->
    content = undefined
    content = $(this).attr("rel")
    $("#popover_tip").html content
    $(this).popover
      content: $("#popover_tip")
      tooltip: true

  ).mouseout ->
    $(this).popover "close",
      content: $("#popover_tip")
      tooltip: true



$ ->
  window.viewmodel = new ViewModel
  ko.applyBindings(new ViewModel("CoffeeScript", "Fan"))

  # Consider using rails to highlight
  $("pre.code_format code").each (i, e) ->
    hljs.highlightBlock e

  unless Modernizr.touch
    s = skrollr.init()