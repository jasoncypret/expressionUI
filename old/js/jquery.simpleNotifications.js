(function() {

  (function($) {
    var methods, t;
    t = void 0;
    methods = {
      defaults: {
        id: "notification_center",
        message: "You should pass a message",
        sticky: false,
        wide: false,
        duration: "7000",
        type: "error",
        appendType: "prepend",
        beforeOpen: $.noop,
        afterOpen: $.noop,
        beforeClose: $.noop,
        afterClose: $.noop
      },
      init: function(options) {
        options = $.extend({}, methods.defaults, options);
        if ($(".notification_center")[0]) {
          $(".notification_center").remove();
          clearTimeout(t);
        }
        return $(this).notify("_open", options);
      },
      _open: function(options) {
        var markup;
        options.beforeOpen();
        markup = "<div style=\"display:none;\" class=\"notification_center wide_" + options.wide + " " + options.type + "\" id=\"" + options.id + "\"><div class=\"notify_Wrap\"><em class=\"icon\">" + options.type + "</em>" + options.message + "<a class=\"close_notify\" href=\"javascript:;\"><span>Close</span></a></div></div>";
        $(this)[options.appendType](markup);
        $("#" + options.id).slideDown("fast");
        options.afterOpen();
        return $("#" + options.id).notify("_setupEvents", options);
      },
      close: function(options) {
        options = $.extend({}, methods.defaults, options);
        options.beforeClose();
        $(".notification_center").slideUp("fast", function() {
          return $(this).remove();
        });
        return options.afterClose();
      },
      _setupEvents: function(options) {
        if (!options.sticky) {
          t = setTimeout(function() {
            $(this).notify("close", options);
            return clearTimeout(t);
          }, options.duration);
        }
        return $("#" + options.id + " .close_notify").click(function() {
          clearTimeout(t);
          return $("#" + options.id).notify("close", options);
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
