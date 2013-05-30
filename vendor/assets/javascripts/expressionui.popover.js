/* expressionUI popover v2.0
 * https://github.com/jasoncypret/expressionUI
 *
 * Copyright (c) 2013 Jason Cypret (http://jasoncypret.com/)
 * Licensed under the MIT License
 */

(function ($) {
  $.fn.popover = function (options) {
    var defaults = {
        content: $('.popover'),
        padding: 0,
        aOffset: 55,
        afterOpen: $.noop,
        afterClose: $.noop,
        flush: false
    };
    options = $.extend({}, defaults, options);
    var left = $(this).offset().left + ($(this).outerWidth() / 2),
      top = $(this).offset().top + ($(this).outerHeight() / 2),
      winTopMax = $(window).height() / 2,
      winLeftMax = $(window).width() / 2,
      pos = '',
      num = 0,
      tooltipHeight,
      tooltipWidth;

    pos = options.position;
    if(!pos){
        (top >= 1 && top - $(window).scrollTop() <= winTopMax) ? pos = 'top' : pos = 'bottom';
        (left >= 1 && left - $(window).scrollLeft() <= winLeftMax) ? pos += 'left' : pos += 'right';
    }


    options.content.addClass('popover_container ' + pos).css({visibility: 'hidden', display: 'block', zIndex: '9999'});
    if(options.flush) options.content.addClass('flush');
    tooltipHeight = options.content.outerHeight();
    tooltipWidth = options.content.outerWidth();
    switch (pos) {
      case "topleft":
        top += ($(this).height() / (options.flush ? 2 : 1)) + options.padding * 2;
        left += -$(this).width() / 2 - options.aOffset;
        break;
      case "bottomleft":
        top += -tooltipHeight - $(this).height() / 2 - options.padding;
        left += -$(this).width() / 2 - options.aOffset;
        break;
      case "topright":
        top += $(this).height() + options.padding * 2;
        left += $(this).width() - (tooltipWidth + (options.aOffset *2));
        break;
      case "bottomright":
        top += -$(this).height() / 2 - tooltipHeight - options.padding;
        left += $(this).width() - (tooltipWidth + (options.aOffset * 2));
        break;
    }

    options.content.css({ 'left': left + 'px', 'top': top + 'px', 'display': 'none', 'visibility': 'visible' }).show();

    options.afterOpen.apply(this, [options.content])

    // You could add an active_popover class to $(this)
    $(document).bind('click.popover', function(e) {
      num++;
      if (num > 1) {
        $(options.content).removeClass('popover_container topleft bottomleft topright bottomright').hide();
        options.afterClose.apply(this, [options.content])
        $(document).unbind('click.popover');
      }
    });
  }
})(jQuery);