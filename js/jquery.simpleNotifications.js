(function ($) {
    var t;
    var methods = {
        defaults : {
            id: 'notification_center',
            message: 'You should pass a message',
            sticky: false,
            wide: false,
            duration: '7000',
            type: 'error', // error // success // warning // info
            appendType: 'prepend', // prepend // append // before // after 
            beforeOpen: $.noop,
            afterOpen: $.noop,
            beforeClose: $.noop,
            afterClose: $.noop
        },
        init : function (options) {
            options = $.extend({}, methods.defaults, options);
            if ($('.notification_center')[0]) {
                $('.notification_center').remove();
                clearTimeout(t);
            }
            $(this).notify('_open', options);
        },
        _open : function (options) {
            options.beforeOpen();
            var markup = '<div style="display:none;" class="notification_center wide_' + options.wide + ' ' + options.type + '" id="' + options.id  + '"><div class="notify_Wrap group"><em class="icon">' + options.type + '</em>'+ options.message  + '<a class="close_notify" href="javascript:;"><span>Close</span></a></div></div>';
            $(this)[options.appendType](markup);
            $('#' + options.id).slideDown('fast');
            options.afterOpen();
            $('#' + options.id).notify('_setupEvents', options);
        },
        close : function (options) {
            options = $.extend({}, methods.defaults, options);
            options.beforeClose();
            $('.notification_center').slideUp('fast', function() {
                $(this).remove();
            });
            options.afterClose();
        },
        _setupEvents : function (options) {
            if (!options.sticky) {
                t = setTimeout( function() {
                    $(this).notify('close', options);
                    clearTimeout(t);
                } , options.duration);
            }
            
            $('#' + options.id + ' .close_notify').click( function() {
                clearTimeout(t);
                $('#' + options.id).notify('close', options);
            });
        }
    };

    $.fn.notify = function ( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.Notify' );
        }            
    }
})(jQuery);