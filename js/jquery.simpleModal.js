(function ($) {

    var methods = {

        defaults : {
            title: 'Alert',
            id: 'modal',
            overlay: false,
            overlayMrk: '<div class="pageOverlay" style="display:none;"></div>',
            appendTo: 'body',
            closeClass: '',
            animate: false,
            closeID: 'closeDialog',
            width: 'auto',
            mobile: false,
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
            $(this).modal('_open', options);
            
            // ONCE ALL THE FUNCTIONS ARE DEFINED WE CAN CALL EACH HERE

        },

        _open : function (options) {
            options.beforeOpen();
            //  BUILD
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

            if (options.overlay)
                overlay = options.overlayMrk;

            if (options.mobile)
                isMobile = 'mobile'
    
            // NEED TO FIGURE OUT HOW TO ADD A CLASS TO THE OVERLAY
            buildModal =
                '<div id="' + options.id + '" class="modal ' + isMobile + '">' + overlay + '<div style="visibility:hidden; width:' + options.width + 'px;" class="modal">' +
                '<h1><span class="container">' + options.title + '<a href="javascript:;" id="' + options.closeID + '" class="closeDialog ' + options.closeClass + '">x</a></span></h1>' +
                '<div class="modalBody"><div class="container"><div class="content"></div></div></div>' +
                '<div class="dialogFooter"><span class="container">' + buttons + '</span></div>' +
                '</div></div>';

            // APPEND
            $(options.appendTo).append(buildModal);
            $(this).appendTo('#' + options.id + ' .content').css('display', 'block');


            // DISPLAY
            $('#' + options.id + ' .modal').modal('_position');
            $('#' + options.id + ' .modal').css({ 'display': 'none', 'visibility': 'visible' });
            if (options.animate) {
                $('#' + options.id + ' .modal, #' + options.id + ' .pageOverlay').fadeIn(options.transitionSpeed);
            } else {
                $('#' + options.id + ' .modal, #' + options.id + ' .pageOverlay').show();
            }
            
            // SET EVENTS
            $('#' + options.id).modal('_setupEvents', options);

            options.afterOpen.call();

        },

        close : function (options) {

            options = $.extend({}, methods.defaults, options);
            options.beforeClose();

            if (!options.removeContent) {        
                $(this).find('.content').children().clone().appendTo(options.appendTo).css('display', 'none');
            }

            if (options.animate) {
                $(this).fadeOut(options.transitionSpeed, function () {
                    $(this).parent().remove();
                });
            } else {
                $(this).parent().remove();
            }

            // Should possibly kill all events?
            options.afterClose();

        },

        _setupEvents : function (options) {

            $(this).find('.dialogFooter a').each( function (i) {
                $(this).click(options.buttons[i].callback);
            });
            
            $(this).find('.closeDialog').click( function () {
                (typeof options.closeCallback === 'undefined') ? $(this).closest('.modal').modal('close', options) : options.closeCallback() ;
            });

            // Needs to be specific to this ID
            $(document).bind('keyup.modal', function (e) {
                //console.log('keyed');
                /* ENTER
                if defaults is true roll each options.buttons[0].defaultButton === true {}

                if (e.keyCode == 13) {
                    $.each(window.options.buttons, function (i, checkIfDefaultDefined) {
                        (typeof checkIfDefaultDefined.defaultButton == 'undefined') ? closeDialog() : checkIfDefaultDefined.callback();
                    });
                }
                if (e.keyCode == 27) {
                    $(this).modal('close', options.closeCallback);
                }
                */
            });
        },

        _position : function () {
            var modal = $(this);
            var modalHeight = modal.outerHeight();
            var modalPadding = modalHeight - modal.height();
            var win = $(window).height();
            var threshold = 60;
            if (modalHeight > win - threshold) {
                modal.css('height', win - threshold - modalPadding);
            }
            modal.css({ 'margin-top': -modal.outerHeight() / 2, 'margin-left': -modal.outerWidth() / 2 });         
        }
    };

    $.fn.modal = function ( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.Modal' );
        }            
    }
})(jQuery);