(function() {

  (function($) {
    var methods;
    methods = {
      defaults: {
        list: ".drop_list",
        afterSelect: $.noop,
        afterOpen: $.noop,
        afterClose: $.noop,
        duration: 500,
        can_click: false,
        triggered_click: false
      },
      _init: function(options) {
        options = $.extend({}, methods.defaults, options);
        $(this).data("htmlDrop", true);
        return $(this).htmlDrop("_events", options);
      },
      close: function(options) {
        $(this).removeClass("active").parent().find(options.list).slideUp(options.duration);
        options.afterClose();
        options.triggered_click = false;
        return $("body").htmlDrop("_ie7", "close");
      },
      open: function(options) {
        $(this).addClass("active").parent().find(options.list).slideDown(options.duration, function() {
          return $(this).css('overflow', 'visible');
        });
        if ($(this).parent().hasClass("accountDrop")) {
          $("body").htmlDrop("_ie7", "open");
        }
        return options.afterOpen();
      },
      _select: function(options) {
        var html;
        html = $(this).html();
        $(this).closest(options.list).find(".checked").removeClass("checked");
        $(this).parent().addClass("checked");
        $(this).offsetParent(".drop_list").prev().find(".address").html(html);
        return options.afterSelect();
      },
      _ie7: function(state) {
        if (state === "open") {
          return $(".ie7 .content.wrap").css("z-index", "-1");
        } else {
          if (state === "close") {
            return $(".ie7 .content.wrap").css("z-index", "0");
          }
        }
      },
      _events: function(options) {
        $(this).on("click", function() {
          var num, self, target;
          if (!options.triggered_click) {
            options.triggered_click = true;
            target = void 0;
            num = 0;
            if ($(this).hasClass("active")) {
              if (!options.can_click) target = "close";
            } else {
              self = this;
              target = "open";
              $(document).bind("click", function(e) {
                if (options.can_click) {
                  if ($(e.target).parent().hasClass("drop_label")) num++;
                  if ($(self).find($(e.target)).length === 0) {
                    $(self).htmlDrop("close", options);
                    $(".drop_label.active, .html_drop.active").htmlDrop("close", options);
                    $(document).unbind("click");
                  }
                } else {
                  num++;
                }
                if (num > 1) {
                  $(self).htmlDrop("close", options);
                  $(".drop_label.active, .html_drop.active").htmlDrop("close", options);
                  return $(document).unbind("click");
                }
              });
            }
            return $(this).htmlDrop(target, options);
          }
        });
        return $(this).parent().find(options.list + " a").each(function(i) {
          return $(this).on("click", function() {
            $(this).htmlDrop("_select", options);
            return $(this).parents(".drop_list").prev().htmlDrop("close", options);
          });
        });
      },
      destroy: function() {
        if ($(this).data("htmlDrop") !== true) return;
        $(this).parent().find(".drop_list a").each(function(i) {
          return $(this).off("click");
        });
        $(this).off("click");
        return $(this).data("htmlDrop", false);
      }
    };
    return $.fn.htmlDrop = function(method) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === "object" || !method) {
        return methods._init.apply(this, arguments);
      } else {
        return $.error("Method " + method + " does not exist on jQuery.HTMLDrop");
      }
    };
  })(jQuery);

}).call(this);
