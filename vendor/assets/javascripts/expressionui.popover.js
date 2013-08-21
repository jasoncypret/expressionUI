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
      fixed: true,
      close_on_scroll: false,
      scroll_target: $(document),
      scroll_threshold: 5,
      close_on_click: "anywhere",
      reposition_on_resize: false,
      tooltip: false,
      arrow_height: 12,
      arrow_offset: 35,
      arrow_position: null,
      position_top: null,
      position_left: null,
      outter_height: null,
      outter_width: null,
      afterOpen: $.noop,
      afterClose: $.noop
    },
    init: function (options) {
      options = $.extend({}, methods.defaults, options);
      options.tooltipHeight = 0;
      options.tooltipWidth = 0;

      $(this).popover('_get_width_height', options);
      $(this).popover('_get_center_position', options);
      if(!options.arrow_position) options.arrow_position = $(this).popover('_positionArrow', options);
      $(this).popover('_init_class_styles', options);

      options.tooltipHeight = options.content.outerHeight(),
      options.tooltipWidth = options.content.outerWidth();

      $(this).popover('_position_popover', options);

      options.content.css({ 'left': options.position_left + 'px', 'top': options.position_top + 'px', 'display': 'none', 'visibility': 'visible' }).show();
      options.afterOpen.apply(this, [options.content])
      $(this).popover('_setupEvents', options);
    },
    close: function (options) {
      $('.active.popover_target').removeClass('active popover_target')
      options = $.extend({}, methods.defaults, options);
      $(options.content).removeClass('popover_container topleft bottomleft topright bottomright tooltip flush').attr('style', '').hide();
      $(this).popover('_destroyEvents', options);
      options.afterClose.apply(this, [options.content]);
    },
    _get_center_position: function (options) {
      // POSITION CENTER OF ELEMENT
      if (options.position_left === null) {
        options.position_left = $(this).offset().left + (options.outter_width / 2);
      } else {
        options.position_left += (options.outter_width / 2);
      }
      if (options.position_top === null) {
        options.position_top = $(this).offset().top + (options.outter_height / 2);
      } else {
        options.position_top += (options.outter_height / 2);
      }
    },
    _get_width_height: function (options){
      // GET HEIGHT & WIDTH
      if (options.outter_height === null) {
        options.outter_height = ($(this).outerHeight() === 0) ? $(this).attr('height') : $(this).outerHeight() ;  
      }
      if (options.outter_width === null) {
        options.outter_width = ($(this).outerWidth() === 0) ? $(this).attr('width') : $(this).outerWidth() ;
      }
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
          $(this).popover("reposition_popover", options);
        });
      }

      $(document).unbind('click.popover').bind('click.popover', function(e) {
        click++
        if (click > 1) {
          var container = $('.popover_container');
          switch (options.close_on_click) {
            case "anywhere":
              $(this).popover('close', options);
              break;
            case "outside":
              if (!container.is(e.target) && container.has(e.target).length === 0) {
                $(this).popover('close', options);
              }
              break;
          }
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

    },
    _positionArrow: function (options) {
      var winTopMax = $(window).height() / 2,
          winLeftMax = $(window).width() / 2,
          pos = '';
      (options.position_top >= 1 && options.position_top + $(options.scroll_target).scrollTop() <= winTopMax) ? pos = 'top' : pos = 'bottom';
      (options.position_left >= 1 && options.position_left + $(options.scroll_target).scrollLeft() <= winLeftMax) ? pos += 'left' : pos += 'right';      
      return pos;
    },
    reposition_popover: function (options) {
      options = $.extend({}, methods.defaults, options);
      options.tooltipHeight = 0;
      options.tooltipWidth = 0;

      $(this).popover('_get_width_height', options);
      $(this).popover('_get_center_position', options);
      if(!options.arrow_position) options.arrow_position = $(this).popover('_positionArrow', options);
      $(this).popover('_move_class_styles', options);

      options.tooltipHeight = options.content.outerHeight(),
      options.tooltipWidth = options.content.outerWidth();

      $(this).popover('_position_popover', options);


      options.content.animate({
          top: options.position_top,
          left: options.position_left
        },{
          queue: false,
          duration: 500
        }, function() {
          options.afterOpen.apply(this, [options.content]);
        });
    },
    _position_popover: function (options) {

      switch (options.arrow_position) {
        case "topleft":
          if (options.flush) {
            options.position_top = options.outter_height;
            options.position_left += -(options.outter_width/2)
          } else {
            options.position_top += (options.outter_height/2) + options.arrow_height + options.padding;
            options.position_left += -(options.arrow_offset);
          }
          break;
        case "bottomleft":
          options.position_top += -options.tooltipHeight -(options.outter_height/2) - options.arrow_height - options.padding;
          options.position_left += -(options.arrow_offset);
          break;
        case "topright":
          options.position_top += (options.outter_height/2) + options.arrow_height + options.padding;
          options.position_left += -(options.tooltipWidth) + (options.arrow_offset)
          break;

        case "bottomright":
          options.position_top += -options.tooltipHeight -(options.outter_height/2) - options.arrow_height - options.padding;
          options.position_left += -(options.tooltipWidth) + (options.arrow_offset)
          break;
      }

      // ACCOUNT FOR SCROLL
      // options.position_top += +($(options.scroll_target).scrollTop());
      // options.position_left += +($(options.scroll_target).scrollLeft());
      
      if (options.tooltip) {
        // RECODE FOR PASSING IN WIDTH AND HEIGHT
        options.position_left = $(this).offset().left + (options.outter_width / 2) -(options.tooltipWidth/2);
      }

    },
    _move_class_styles: function (options) {
      options.content.removeClass('topleft bottomleft topright bottomright');
      options.content.addClass('popover_container ' + options.arrow_position);
    },
    _init_class_styles: function (options) {
      options.content.addClass('popover_container ' + options.arrow_position).css({visibility: 'hidden', display: 'block', zIndex: '9999'});
      if(options.flush) options.content.addClass('flush');
      if(options.tooltip) options.content.addClass('tooltip');
      if (options.fixed) options.content.css({'position': 'fixed' });
      $(this).addClass('active popover_target');
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
