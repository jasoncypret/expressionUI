(function ($) {
    "use strict";
    var methods = {
        defaults : {
            message: 'Loading',
            id: '',
            visible: false,
            type: 'spinner', // spinner // progressFill // progressFake
            beforeOpen: $.noop,
            afterOpen: $.noop,
            beforeClose: $.noop,
            afterClose: $.noop
        },
        init : function (options) {
            options = $.extend({}, methods.defaults, options);
            $(this).loading('_open', options);
        },
        _open : function (options) {
            options.beforeOpen();
            if (!options.visible) { options.visible = 'invisible'; } else { options.visible = ''; }
            var markup = '<div class="loading ' + options.type + '" id="' + options.id  + '"><div class="indicator">' + options.type + '</div><span class="msg">' + options.message  + '</span></div>';
            $(this).addClass(options.visible).prepend(markup);
            options.afterOpen();
        },
        close : function (options) {
            options = $.extend({}, methods.defaults, options);
            options.beforeClose();
            $(this).removeClass('invisible').find('.loading').remove();
            options.afterClose();
        }
    };

    $.fn.loading = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.Loading');
        }
    };
})(jQuery);