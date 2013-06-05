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
            id: 'modal',
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
            $(this).modal('_open', options);
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
                buttons += '<a href="javascript:;" id="modalBtn' + i + '" class="' + className + defaultBtn + '"><span>' + btn.buttonText + '</span></a>';
            });
            if (options.width != "auto") {
                options.width = options.width + 'px'
            }
            if (options.overlay) {
                overlay = options.overlayMrk;
            }
            buildModal = '<div id="' + options.id + '" class="modal_wrapper ' + isMobile + ' ' + options.height + '">' + overlay + '<div style="width:' + options.width + ';" class="modal">';
            if (options.header) {
                buildModal += '<h1><span class="wrapper"><span class="title">' + options.title + '</span><a href="javascript:;" id="' + options.closeID + '" class="closeDialog ' + options.closeClass + '">x</a></span></h1>';
            } else {
                buttons += '<a href="javascript:;" class="closeDialog"><span>Cancel</span></a>';
            }
            buildModal += '<div class="modalBody"><div class="wrapper"><div class="d_content"></div></div></div>';
            if (options.footer) {
                buildModal += '<div class="modalFooter"><span class="wrapper">' + buttons + '</span></div>';
            }
            buildModal += '</div></div>';
            $(options.appendTo).append(buildModal);
            if (options.headerContent && options.header) {
                $(options.headerContent).appendTo('#' + options.id + ' h1 .wrapper').css('display', 'block');
            }
            $(this).appendTo('#' + options.id + ' .d_content').css('display', 'block');
            if (options.ajax) {
                $(this).modal('ajax', options);
            }
            $('#' + options.id + ' .modal').modal('position', options);
            $('#' + options.id).modal('_setupEvents', options);
            $(options.appendTo).addClass("modal_open");
            if(!options.ajaxTarget){
                options.afterOpen.call();
            }
        },
        ajax: function (options) {
            var _this = $(this)
            if (options.ajaxTarget) options.ajax = options.ajax + ' ' + options.ajaxTarget
            if (options.notify) {
                _this.parents('.modalBody').notify({ style: "none", position: "middle", loading: "circles", sticky: true, content: "hidden" });
            }
            _this.load(options.ajax, function (response, status, xhr) {
                _this.parents('.modalBody').find('.notify').notify("close")
                options.afterOpen.call();
                if (status == "error") {
                    var msg = "Sorry but there was an error: ";
                    alert(msg + xhr.status + " " + xhr.statusText);
                }
            });
        },
        close: function (options) {
            options = $.extend({}, methods.defaults, options);
            if ($('.modal')[1]) {
                var amount = $('.modal').length - 1
                $.each($('.modal'), function (i, v) {
                    if (i === amount) {
                        $(v).parents('.modal_wrapper').fadeOut('fast');
                    }
                });
            } else {
                $(options.appendTo).removeClass('modal_open').addClass('modal_close');
            }
            options.beforeClose();
            var modal_content = $(this).find('.d_content').children(),
                parent = $(this).parents('.modal_wrapper'),
                body = $(this).find('.modalBody'),
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
                if (!$('.modal')[1]) {
                    $(options.appendTo).removeClass("modal_close");
                }
                parent.remove();
                $(window).unbind("resize.modal");
            }, 1000);
            options.afterClose();
        },
        _setupEvents: function (options) {
            var _this = $(this)
            $(window).bind("resize.modal", function () {
                _this.find('.modal').modal('position', options)
            });
            $(this).find('.modalFooter a:not(.closeDialog)').each(function (i) {
                $(this).click(options.buttons[i].context ? function () {
                    options.buttons[i].callback.apply(options.buttons[i].context)
                } : options.buttons[i].callback);
            });
            $(this).find('.closeDialog').click(function () {
                (typeof options.closeCallback === 'undefined') ? $('#' + options.id + ' .modal').modal('close', options) : options.closeCallback();
            });
        },
        position: function (options) {
            var modal = $(this);
            var modalHeight = modal.outerHeight();
            var modalPadding = modalHeight - modal.height();
            var win = $(window).height();
            var threshold = options.threshold;
            if (options.height == 'auto') {
                if ( modalHeight > (win - (threshold * 2)) ) {
                    modal.css('height', (win - ((threshold * 2) - modalPadding)) );
                }
                modal.css({ 'margin-top': -(modal.outerHeight() / 2), 'margin-left': -(modal.outerWidth() / 2) });
            } else {
                modal.css({ 'top': threshold, 'bottom': threshold, 'margin-left': -(modal.outerWidth() / 2) });
            }
        }
    };
    $.fn.modal = function (method) {
        if (methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.Modal');
        }
    }
})(jQuery);