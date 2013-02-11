/* expressionUI modal v2.0
 * https://github.com/jasoncypret/expressionUI
 *
 * Copyright (c) 2013 Jason Cypret (http://jasoncypret.com/)
 * Licensed under the MIT License
 */

(function ($) {
    var methods = {
        defaults : {
            title: 'Alert',
            id: 'dialog',
            overlay: true,
            overlayMrk: '<div class="pageOverlay"></div>',
            appendTo: 'body',
            closeClass: '',
            animate: true,
            closeID: 'closeDialog',
            width: 'auto',
            mobile: false,
            height: 'auto',
            header: true,
            transitionSpeed: 'fast',
            removeContent: false,
            buttons: [
                { buttonText: 'Ok', callback: function(){ return; }, defaultButton: true }
            ],
            beforeOpen: $.noop,
            afterOpen: $.noop,
            beforeClose: $.noop,
            afterClose: $.noop
        },
        init : function (options) {
            options = $.extend({}, methods.defaults, options);
            $(this).dialog('_open', options);
        },
        _open : function (options) {
            options.beforeOpen();
            var overlay = '',
                isMobile = '',
                buildModal,
                buttons = ''
            $.each(options.buttons, function (i, btn) {
                var defaultBtn = '';
                if (typeof btn.defaultButton != 'undefined')
                    defaultBtn = ' defaultButton';

                var className = '';
                if (typeof btn.className != 'undefined')
                    className = btn.className;

                buttons += '<a href="javascript:;" id="dialogBtn' + i + '" class="' + className + defaultBtn + '"><span>' + btn.buttonText + '</span></a>';
            });
            if (options.overlay) {overlay = options.overlayMrk;}
            if (options.mobile){ isMobile = 'mobile'; window.scrollTo(0,0);}
            buildModal = '<div id="' + options.id + '" class="dialog_container ' + isMobile + ' ' + options.height + '">' + overlay + '<div width:' + options.width + 'px;" class="dialog">';
            if (options.header) {
                buildModal += '<h1><span class="container">' + options.title + '<a href="javascript:;" id="' + options.closeID + '" class="closeDialog ' + options.closeClass + '">x</a></span></h1>';
            } else {
                buttons += '<a href="javascript:;" class="closeDialog"><span>Cancel</span></a>';
            }
            buildModal += '<div class="dialogBody"><div class="container"><div class="d_content"></div></div></div>';
            buildModal += '<div class="dialogFooter"><span class="container">' + buttons + '</span></div>';
            buildModal += '</div></div>';
            $(options.appendTo).append(buildModal);
            $(this).appendTo('#' + options.id + ' .d_content').css('display', 'block');
            $('#' + options.id + ' .dialog').dialog('position', options);
            $('#' + options.id).dialog('_setupEvents', options);
            $("html").addClass("dialog_open");
            options.afterOpen.call();
        },
        close : function (options) {
            $("html").addClass('dialog_close').removeClass("dialog_open");
            options = $.extend({}, methods.defaults, options);
            options.beforeClose();
            var modal_content = $(this).find('.d_content').children(),
                parent = $(this).parents('.dialog_container'),
                body = $(this).find('.dialogBody'),
                b_width = body.outerWidth(),
                b_height = body.outerHeight();
            body.css({width: b_width, height: b_height});
            modal_content.appendTo(options.appendTo).css('display', 'none');
            setTimeout(function() {
                parent.remove();
                $("html").removeClass("dialog_close");
            }, 1000);
            options.afterClose();
        },
        _setupEvents : function (options) {
            $(this).find('.dialogFooter a:not(.closeDialog)').each( function (i) {
                $(this).click(options.buttons[i].context ? function(){options.buttons[i].callback.apply(options.buttons[i].context)} : options.buttons[i].callback);
            });
            $(this).find('.closeDialog').click( function () {
                (typeof options.closeCallback === 'undefined') ? $(this).closest('.dialog').dialog('close', options) : options.closeCallback() ;
            });
        },
        position : function (options) {
            var dialog = $(this);
            var dialogHeight = dialog.outerHeight();
            var dialogPadding = dialogHeight - dialog.height();
            var win = $(window).height();
            var threshold = 60;
            if (options.height == 'auto') {
                if (dialogHeight > win - threshold) {
                    dialog.css('height', win - threshold - dialogPadding);
                }
                dialog.css({ 'margin-top': -dialog.outerHeight() / 2, 'margin-left': -dialog.outerWidth() / 2 });
            } else {
                dialog.css({ 'top': '15px', 'bottom': '15px', 'margin-left': -dialog.outerWidth() / 2 });
            }
        }
    };
    $.fn.dialog = function ( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.Modal' );
        }
    }
})(jQuery);