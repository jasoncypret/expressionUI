(function ($) {
  var methods = {
      defaults : {
          list: '.drop_list',
          afterSelect: $.noop,
          afterOpen: $.noop,
          afterClose: $.noop
      },
      _init : function (options) {
          options = $.extend({}, methods.defaults, options);
          $(this).data('htmlDrop', true);
          $(this).htmlDrop('_events', options);
      },
      close : function (options) {
        $(this).removeClass('active').parent().find(options.list).slideUp('100');
        options.afterClose();
      },
      open : function (options) {
        $(this).addClass('active').parent().find(options.list).slideDown('100');
        if ( $(this).parent().hasClass('accountDrop') ) {
          console.log('Account Box')
          $('body').htmlDrop('_ie7', 'close'); // FIX for IE7
        }
        options.afterOpen();
      },
      _select : function (options) {
        var html = $(this).html();
        $(this).closest(options.list).find('.checked').removeClass('checked');
        $(this).parent().addClass('checked');
        $(this).offsetParent('.drop_list').prev().find('.address').html(html);
        options.afterSelect();
      },
      _ie7: function (state) {
        if (state === 'open') {
          $('.ie7 .wrap.content').css('z-index', '-1');
        } else if (state === 'close') {
          $('.ie7 .wrap.content').css('z-index', '0');
        }
      },
      _events: function (options) {
        $(this).on('click', function () {
          var target;
          var num = 0;
          if ( $(this).hasClass('active') ) {
            target = 'close';
          } else {
            target = 'open';
            $(document).bind('click',function (e) {
              num++
              if (num > 1) {
                $('.drop_label.active').htmlDrop('close', options);
                $(document).unbind('click');
              }
              
            });
          }
          $('body').htmlDrop('_ie7', target);
          $(this).htmlDrop(target, options);
        });
        $(this).parent().find(options.list + ' a').each( function (i) {
          $(this).on('click', function () {
              $(this).htmlDrop('_select', options);
              $(this).parents('.drop_list').prev().htmlDrop('close', options);
            }
          );
        });
      },
      destroy: function() {
          if ($(this).data('htmlDrop') !== true)
              return;
          $(this).parent().find('.drop_list a').each( function (i) {
              $(this).off('click');
          });
          $(this).off('click');
          $(this).data('htmlDrop', false);
      }
  };
  $.fn.htmlDrop = function ( method ) {
      if ( methods[method] ) {
          return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
      } else if ( typeof method === 'object' || ! method ) {
          return methods._init.apply( this, arguments );
      } else {
          $.error( 'Method ' +  method + ' does not exist on jQuery.HTMLDrop' );
      }
  }
})(jQuery);