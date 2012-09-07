(function() {

  (function($) {
    return $.fn.replaceSelects = function() {
      return $(this).each(function() {
        var frst, txt;
        txt = [];
        frst = void 0;
        $(this).css("opacity", "0").find("option").each(function(i) {
          txt[i] = $(this).text();
          if ($(this).attr("selected")) {
            return frst = $(this).text();
          } else {
            return frst = txt[0];
          }
        });
        $(this).parent().find("label").html(frst + "<span>^</span>");
        return $(this).change(function() {
          var updatedValue;
          updatedValue = $(this).find("option:selected").text();
          return $(this).parent().find("label").html(updatedValue + "<span>^</span>");
        });
      });
    };
  })(jQuery);

}).call(this);
