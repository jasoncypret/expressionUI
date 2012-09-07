(function() {

  (function($) {
    "use strict";
    var methods;
    methods = {
      defaults: {
        message: "Loading",
        id: "",
        visible: false,
        type: "spinner",
        appendType: "prepend",
        beforeOpen: $.noop,
        afterOpen: $.noop,
        beforeClose: $.noop,
        afterClose: $.noop,
        color: "black",
        closeAll: true
      },
      init: function(options) {
        options = $.extend({}, methods.defaults, options);
        $(this).loading("_open", options);
      },
      _open: function(options) {
        var markup;
        markup = "";
        options.beforeOpen();
        if (!options.visible) {
          options.visible = "invisible";
        } else {
          options.visible = "";
        }
        options.color === "black";
        markup += "<div class=\"loading " + options.color + " " + options.type + "\" id=\"" + options.id + "\">";
        markup += "<div class=\"indicator\">" + options.type + "</div>";
        markup += "<span class=\"msg\">" + options.message + "</span>";
        markup += "</div>";
        $(this).addClass(options.visible)[options.appendType](markup);
        options.afterOpen();
      },
      close: function(options) {
        options = $.extend({}, methods.defaults, options);
        options.beforeClose();
        if (options.closeAll) {
          $(this).removeClass("invisible").find(".loading").remove();
        } else {
          $(this).removeClass("invisible").find(".loading").first().remove();
        }
        options.afterClose();
      }
    };
    $.fn.loading = function(method) {
      if (methods[method]) {
        methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === "object" || !method) {
        methods.init.apply(this, arguments);
      } else {
        $.error("Method " + method + " does not exist on jQuery.Loading");
      }
    };
  })(jQuery);

}).call(this);
