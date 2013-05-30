/* expressionUI modal v1.0
 * https://github.com/jasoncypret/expressionUI
 *
 * Copyright (c) 2013 Jason Cypret (http://jasoncypret.com/)
 * Licensed under the MIT License
 */

(function ($) {
    var methods = {
        defaults: {
            title: 'Alert',
            id: 'dialog',
            closeID: 'closeDialog',
            overlay: true,
            overlayMrk: '<div class="pageOverlay"></div>',
            appendTo: 'body',
            threshold: 15,
            ajax: '',
            ajaxTarget: '',
            notify: false,
            width: 'auto',
            height: 'auto',
            header: true,
            headerContent: '',
            footer: true,
            removeContent: false,
            buttons: [
                { buttonText: 'Ok', callback: function () {
                    return;
                }, defaultButton: true }
            ],
            beforeOpen: $.noop,
            afterOpen: $.noop,
            beforeClose: $.noop,
            afterClose: $.noop
        },
        init: function (options) {
            options = $.extend({}, methods.defaults, options);
            $(this).dialog('_open', options);
        },
        _open: function (options) {
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
            if (options.width != "auto") {
                options.width = options.width + 'px'
            }
            if (options.overlay) {
                overlay = options.overlayMrk;
            }
            buildModal = '<div id="' + options.id + '" class="dialog_container ' + isMobile + ' ' + options.height + '">' + overlay + '<div style="width:' + options.width + ';" class="dialog">';
            if (options.header) {
                buildModal += '<h1><span class="container"><span class="title">' + options.title + '</span><a href="javascript:;" id="' + options.closeID + '" class="closeDialog ' + options.closeClass + '">x</a></span></h1>';
            } else {
                buttons += '<a href="javascript:;" class="closeDialog"><span>Cancel</span></a>';
            }
            buildModal += '<div class="dialogBody"><div class="container"><div class="d_content"></div></div></div>';
            if (options.footer) {
                buildModal += '<div class="dialogFooter"><span class="container">' + buttons + '</span></div>';
            }
            buildModal += '</div></div>';
            $(options.appendTo).append(buildModal);
            if (options.headerContent && options.header) {
                $(options.headerContent).appendTo('#' + options.id + ' h1 .container').css('display', 'block');
            }
            $(this).appendTo('#' + options.id + ' .d_content').css('display', 'block');
            if (options.ajax) {
                $(this).dialog('ajax', options);
            }
            $('#' + options.id + ' .dialog').dialog('position', options);
            $('#' + options.id).dialog('_setupEvents', options);
            $(options.appendTo).addClass("dialog_open");
            if(!options.ajaxTarget){
                options.afterOpen.call();
            }
        },
        ajax: function (options) {
            var _this = $(this)
            if (options.ajaxTarget) options.ajax = options.ajax + ' ' + options.ajaxTarget
            if (options.notify) {
                _this.parents('.dialogBody').notify({ style: "none", position: "middle", loading: "circles", sticky: true, content: "hidden" });
            }
            _this.load(options.ajax, function (response, status, xhr) {
                _this.parents('.dialogBody').find('.notify').notify("close")
                options.afterOpen.call();
                if (status == "error") {
                    var msg = "Sorry but there was an error: ";
                    alert(msg + xhr.status + " " + xhr.statusText);
                }
            });
        },
        close: function (options) {
            options = $.extend({}, methods.defaults, options);
            if ($('.dialog')[1]) {
                var amount = $('.dialog').length - 1
                $.each($('.dialog'), function (i, v) {
                    if (i === amount) {
                        $(v).parents('.dialog_container').fadeOut('fast');
                    }
                });
            } else {
                $(options.appendTo).removeClass('dialog_open').addClass('dialog_close');
            }
            options.beforeClose();
            var modal_content = $(this).find('.d_content').children(),
                parent = $(this).parents('.dialog_container'),
                body = $(this).find('.dialogBody'),
                b_width = body.outerWidth(),
                b_height = body.outerHeight();
            body.css({width: b_width, height: b_height});
            if (!options.removeContent) {
                modal_content.appendTo(options.appendTo).css('display', 'none');
                if (options.headerContent && options.header) {
                    $(options.headerContent).appendTo(options.appendTo).css('display', 'none');
                }
            } else {
                modal_content.remove();
            }
            setTimeout(function () {
                if (!$('.dialog')[1]) {
                    $(options.appendTo).removeClass("dialog_close");
                }
                parent.remove();
                $(window).unbind("resize.modal");
            }, 1000);
            options.afterClose();
        },
        _setupEvents: function (options) {
            var _this = $(this)
            $(window).bind("resize.modal", function () {
                _this.find('.dialog').dialog('position', options)
            });
            $(this).find('.dialogFooter a:not(.closeDialog)').each(function (i) {
                $(this).click(options.buttons[i].context ? function () {
                    options.buttons[i].callback.apply(options.buttons[i].context)
                } : options.buttons[i].callback);
            });
            $(this).find('.closeDialog').click(function () {
                (typeof options.closeCallback === 'undefined') ? $('#' + options.id + ' .dialog').dialog('close', options) : options.closeCallback();
            });
        },
        position: function (options) {
            var dialog = $(this);
            var dialogHeight = dialog.outerHeight();
            var dialogPadding = dialogHeight - dialog.height();
            var win = $(window).height();
            var threshold = options.threshold;
            if (options.height == 'auto') {
                if ( dialogHeight > (win - (threshold * 2)) ) {
                    dialog.css('height', (win - ((threshold * 2) - dialogPadding)) );
                }
                dialog.css({ 'margin-top': -(dialog.outerHeight() / 2), 'margin-left': -(dialog.outerWidth() / 2) });
            } else {
                dialog.css({ 'top': threshold, 'bottom': threshold, 'margin-left': -(dialog.outerWidth() / 2) });
            }
        }
    };
    $.fn.dialog = function (method) {
        if (methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.Modal');
        }
    }
})(jQuery);