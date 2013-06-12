/* expressionUI popover v2.0
 * https://github.com/jasoncypret/expressionUI
 *
 * Copyright (c) 2013 Jason Cypret (http://jasoncypret.com/)
 * Licensed under the MIT License
 */

(function ($) {
  var methods = {
    defaults: {
      content: $('.popover'),
      padding: 5,
      flush: false,
      fixed: false,
      close_on_scroll: false,
      scroll_target: $(document),
      scroll_threshold: 5,
      close_on_click: "anywhere",
      reposition_on_resize: false,
      tooltip: false,
      arrow_height: 12,
      arrow_offset: 35,
      arrow_position: null,
      position_top: '',
      position_left: '',
      afterOpen: $.noop,
      afterClose: $.noop
    },
    init: function (options) {
      options = $.extend({}, methods.defaults, options);

      var outter_height, outter_width;
      outter_height = ($(this).outerHeight() === 0) ? $(this).attr('height') : $(this).outerHeight() ;
      outter_width = ($(this).outerWidth() === 0) ? $(this).attr('width') : $(this).outerWidth() ;
      
      options.position_left = $(this).offset().left + (outter_width / 2);
      options.position_top = $(this).offset().top + (outter_height / 2);

      if(!options.arrow_position) options.arrow_position = $(this).popover('_positionArrow', options);

      options.content.addClass('popover_container ' + options.arrow_position).css({visibility: 'hidden', display: 'block', zIndex: '9999'});
      if(options.flush) options.content.addClass('flush');
      if(options.tooltip) options.content.addClass('tooltip');
      if (options.fixed) options.content.css({'position': 'fixed' });
      
      var tooltipHeight = options.content.outerHeight(),
          tooltipWidth = options.content.outerWidth();


      if (options.fixed) {
        options.position_top += -$(options.scroll_target).scrollTop();
        options.position_left += -$(options.scroll_target).scrollLeft();
      }

      switch (options.arrow_position) {
        case "topleft":
          if (options.flush) {
            options.position_top = outter_height;
            options.position_left += -(outter_width/2)
          } else {
            options.position_top += (outter_height/2) + options.arrow_height + options.padding;
            options.position_left += -(options.arrow_offset);
          }
          break;
        case "bottomleft":
          options.position_top += -tooltipHeight -(outter_height/2) - options.arrow_height - options.padding;
          options.position_left += -(options.arrow_offset);
          break;
        case "topright":
          options.position_top += (outter_height/2) + options.arrow_height + options.padding;
          options.position_left += -(tooltipWidth) + (options.arrow_offset)
          break;

        case "bottomright":
          options.position_top += -tooltipHeight -(outter_height/2) - options.arrow_height - options.padding;
          options.position_left += -(tooltipWidth) + (options.arrow_offset)
          break;
      }

      if (options.tooltip) {
        options.position_left = $(this).offset().left + (outter_width / 2) -(tooltipWidth/2);
      }

      // TODO: add an active_popover class to $(this)
      options.content.css({ 'left': options.position_left + 'px', 'top': options.position_top + 'px', 'display': 'none', 'visibility': 'visible' }).show();
      options.afterOpen.apply(this, [options.content])

      $(this).popover('_setupEvents', options);
    },
    close: function (options) {
      options = $.extend({}, methods.defaults, options);
      $(options.content).removeClass('popover_container topleft bottomleft topright bottomright tooltip flush').attr('style', '').hide();
      $(this).popover('_destroyEvents', options);
      options.afterClose.apply(this, [options.content]);
    },
    _destroyEvents: function (options) {
      $(document).unbind('click.popover');
      $(document).unbind('scroll.popover');
      $(document).unbind('resize.popover');
    },
    _setupEvents: function (options) {
      var _this = $(this),
          click = 0;

      if (options.reposition_on_resize) {
        $(window).bind("resize.popover", function () {
          // TODO:
          //$(this).popover('_positionArrow', options);
          //$(this).popover('_positionPopover', options);
        });
      }

      $(document).bind('click.popover', function(e) {
        click++;
        if (click > 1) {
          $(this).popover('close', options);
        }
      });

      if (options.close_on_scroll) {
        $(options.scroll_target).bind('scroll.popover', function() {
          $(document).trigger('content.scroll')
          if ( $(options.scroll_target).scrollTop() >= options.scroll_threshold ){
            $(this).popover('close', options);
          }
        });
      }
      switch (options.close_on_click) {
        case "anywhere":
          // no block
          break;
        case "outside":
          $(options.content).click(function(e) {
            e.stopPropagation();
            return false;
          });
          break;
      }
    },
    _positionArrow: function (options) {
      var winTopMax = $(options.scroll_target).height() / 2,
          winLeftMax = $(options.scroll_target).width() / 2,
          pos = '';

      (options.position_top >= 1 && options.position_top - $(options.scroll_target).scrollTop() <= winTopMax) ? pos = 'top' : pos = 'bottom';
      (options.position_left >= 1 && options.position_left - $(options.scroll_target).scrollLeft() <= winLeftMax) ? pos += 'left' : pos += 'right';      
      
      return pos;
    },
    _positionPopover: function (options) {
    }
  };
  $.fn.popover = function (method) {
    if (methods[method]) {
      return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on expressionui.popover');
    }
  }
})(jQuery);
