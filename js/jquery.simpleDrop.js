(function ($) {
  $.fn.replaceSelects = function () {
      $(this).each(function () {
          var txt = [], frst;
          $(this).css('opacity', '0').find('option').each(function (i) {
              txt[i] = $(this).text();
              ($(this).attr("selected")) ? frst = $(this).text() : frst = txt[0];
          });
          $(this).parent().find('label').html(frst + '<span>^</span>');
          $(this).change( function () {
            var updatedValue = $(this).find('option:selected').text();
            $(this).parent().find('label').html(updatedValue + '<span>^</span>');
          });
      });
  }    
})(jQuery);