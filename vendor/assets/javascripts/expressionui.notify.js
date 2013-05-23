/* expressionUI notify v2.0
 * https://github.com/jasoncypret/expressionUI
 *
 * Copyright (c) 2013 Jason Cypret (http://jasoncypret.com/)
 * Licensed under the MIT License
 */

 (function() {
  (function($) {
    var methods, t;
    t = void 0;
    methods = {
      defaults: {
        n_class: "",
        message: null,
        sticky: false,
        width: "full",
        style: "success",
        append_type: "prepend",
        allow_multiple: false,
        invert: false,
        icon: true,
        loading: null,
        position: "top",
        duration: "7000",
        content: "visible",
        text_align: "bottom",
        beforeOpen: $.noop,
        afterOpen: $.noop,
        beforeClose: $.noop,
        afterClose: $.noop
      },
      init: function(options) {
        options = $.extend({}, methods.defaults, options);
        if (!options.allow_multiple) {
          var selector = '';
          switch (options.append_type) {
            case 'prepend': case 'append':
              selector =  $(this).find('.notify');
              break
            case 'after':
              selector =  $(this).next('.notify');
              break
            case 'before':
              selector =  $(this).prev('.notify');
              break
          }
          if (selector.length > 0) {
            $(selector).notify("close", options, false);
          }
          return $(this).notify("_add_markup", options);
        } else {
          return $(this).notify("_add_markup", options);
        }
      },
      _add_markup: function(options) {
        var markup, iconType;

        // Check ICON TRUE
        if (options.style === "error") { iconType = 'x'; }
        if (options.style === "success") { iconType = '/'; }
        if (options.style === "tip") { iconType = '!'; }
        if (options.style === "info") { iconType = 'i'; }
        if (!options.message) { options.message = ''; }
        
        markup =  '<div style="display:none;" class="notify' + options.n_class + ' text_align_' + options.text_align + ' style_' + options.style + ' position_' + options.position + ' width_' + options.width + ' invert_' + options.invert + ' loading_' + options.loading + ' icon_' + options.icon +'">';
        markup += '<div class="notify_wrap">';
        if (options.icon) {  markup += '<div class="icon">' + iconType + '</div>' }
        

        switch(options.loading) {
          case "dots":
            markup += '<div class="indicator">';
            markup += '<div class="dot1"></div>';
            markup += '<div class="dot2"></div>';
            markup += '<div class="dot3"></div>';
            markup += '<div class="dot4"></div>';
            markup += '<div class="dot5"></div>';
            markup += '<div class="dot6"></div>';
            markup += '<div class="dot7"></div>';
            markup += '<div class="dot8"></div>';
            markup += '</div>'
            markup += '<div class="msg">' + options.message + '</div>';
            break

          case "spinner":
            markup += '<div class="indicator"></div>';
            markup += '<div class="msg">' + options.message + '</div>';
            break

          case "bars":
            markup += '<div class="indicator"><div class="progress"></div></div>';
            markup += '<div class="msg">' + options.message + '</div>';
            break

          case "circles":
            markup += '<div class="indicator">';
            markup += '<div class="circle1"></div>';
            markup += '<div class="circle2"></div>'
            markup += '<div class="circle3"></div>';
            markup += '</div>';
            markup += '<div class="msg">' + options.message + '</div>';
            break

          default:
            (options.style == "loading") ? markup += '<div class="progress"></div><div class="msg">' + options.message + '</div>' : markup += '<div class="msg">' + options.message + '</div>' ;
            markup += '<a class="notify_close" href="javascript:;"><span>x</span></a>';
            markup += '</div>';
        }

        markup += '</div>';

        return $(this).notify("_open", options, markup);
      },

      _open: function(options, markup) {
        var selector
        options.beforeOpen();
        $(this).addClass('notify_container content_' + options.content)[options.append_type](markup);
        switch (options.append_type) {
          case 'prepend': case 'append':
            selector =  $(this).find('.notify[style*="display"]');
            break
          case 'after':
            selector =  $(this).next('.notify[style*="display"]');
            break
          case 'before':
            selector =  $(this).prev('.notify[style*="display"]');
            break
        }
        $(selector).slideDown("fast");
        options.afterOpen();
        return $(this).notify("_setupEvents", options, selector);
      },
      close: function(options, animate) {
        var selector
        animate = typeof animate !== 'undefined' ? animate : true;
        options = $.extend({}, methods.defaults, options);
        options.beforeClose();
        switch (options.append_type) {
          case 'prepend': case 'append': case 'before':
            selector =  $(this).parents('.notify_container');
            break
          case 'after':
            selector =  $(this).prev('.notify_container');
            break
        }
        if (!$(this).hasClass("loading_null")) {
          animate = false;
        }
        if (animate) {
          $(this).slideUp("fast", function() {
            $(selector).removeClass('content_hidden content_overlay content_visible notify_container');
            return $(this).remove();
          });
        } else {
          $(selector).removeClass('content_hidden content_overlay content_visible notify_container');
          return $(this).remove();
        }
        return options.afterClose();
      },
      close_all: function(options) {
        options = $.extend({}, methods.defaults, options);
        options.beforeClose();
        $(".notify").slideUp("fast", function() {
          $(this).closest('[class^=content_]').removeClass('content_hidden content_overlay content_visible');
          return $(this).remove();
        });
        return options.afterClose();
      },
      loading: function(options) {
        options = $.extend({}, methods.defaults, options);
      },
      _setupEvents: function(options, selector) {
        if (!options.sticky) {
          t = setTimeout(function() {
            $(selector).notify("close", options);
            return clearTimeout(t);
          }, options.duration);
        }
        return $(selector).click(function() {
          clearTimeout(t);
          return $(selector).notify("close", options);
        });
      }
    };
    return $.fn.notify = function(method) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === "object" || !method) {
        return methods.init.apply(this, arguments);
      } else {
        return $.error("Method " + method + " does not exist on jQuery.Notify");
      }
    };
  })(jQuery);

}).call(this);

