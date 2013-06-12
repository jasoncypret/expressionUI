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
      close_on_scroll: false,
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

      // temp
      options.arrow_position = null

      if(!options.arrow_position) options.arrow_position = $(this).popover('_positionArrow', options);
      


      options.content.addClass('popover_container ' + options.arrow_position).css({visibility: 'hidden', display: 'block', zIndex: '9999'});
      if(options.flush) options.content.addClass('flush');
      

      var tooltipHeight = options.content.outerHeight(),
          tooltipWidth = options.content.outerWidth();


      switch (options.arrow_position) {

        // fixed position is different

        // LEFT IS WORKING CORRECTLY...JUST NOT MIDDLE
        // DOnt switch on tooltip
          // top or bottom
          // and always middle

        // Flush should be calculated differently
          // top: $(this).outerHeight() no padding
          // left: options.position_left*2

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

      console.log( 'left: ' + options.position_left + 'px\n' + 'top: ' + options.position_top + 'px\n' + 'tooltipHeight: ' + tooltipHeight + 'px\n' + 'tooltipWidth: ' + tooltipWidth + 'px\n' + 'arrow_position: ' + options.arrow_position + '\n' + 'arrow_offset: ' + options.arrow_offset + 'px\n');

      options.content.css({ 'left': options.position_left + 'px', 'top': options.position_top + 'px', 'display': 'none', 'visibility': 'visible' }).show();

      options.afterOpen.apply(this, [options.content])


      var num = 0
      // You could add an active_popover class to $(this)
      $(document).bind('click.popover', function(e) {
        num++;
        if (num > 1) {
          $(options.content).removeClass('popover_container topleft bottomleft topright bottomright').hide();
          options.afterClose.apply(this, [options.content])
          $(document).unbind('click.popover');
        }
      });

      //$('body').bind('click', function(e) {
      //if($(e.target).closest('#menu').length == 0) {
      // click happened outside of menu, hide any visible menu items
      //}
      //});


    },
    _open: function (options) {
      options.beforeOpen();
    },
    close: function (options) {
      options = $.extend({}, methods.defaults, options);
      options.beforeClose();
      options.afterClose();
    },
    _setupEvents: function (options) {
      var _this = $(this)
      if (options.reposition_on_resize) {
        $(window).bind("reposition.popover", function () {
          //_this.find('.modal').modal('position', options)
        });
      }
    },
    _positionArrow: function (options) {
      var winTopMax = $(window).height() / 2,
          winLeftMax = $(window).width() / 2,
          pos = '';

      (options.position_top >= 1 && options.position_top - $(window).scrollTop() <= winTopMax) ? pos = 'top' : pos = 'bottom';
      (options.position_left >= 1 && options.position_left - $(window).scrollLeft() <= winLeftMax) ? pos += 'left' : pos += 'right';      
      
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
