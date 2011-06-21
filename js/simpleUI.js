(function( $ ){

    $.fn.uiModal = function( options ) {

        if ( $('.dialog')[0] ){ closeDialog({animate: false}); }

        var defaults = {
            type: 'alert',
            body: 'Customize this content by providing body: "message"',
            title: 'Alert',
            overlay: false,
            buttons: [
                {buttonText: 'Ok', callback: closeDialog, defaultButton: true}
            ]
        };
         
        window.options = $.extend(defaults, options); 
        var constructAllButtons = '';
        var overlay;
        var formID = window.options.body;
        if(formID.indexOf('#') != -1) {window.options.body = '';}
        $.each(window.options.buttons, function(i, myButtonObject){
            var defaultButton = myButtonObject.defaultButton;
            (typeof defaultButton  == 'undefined') ? defaultButton = "" : defaultButton = 'class="defaultButton"' ;
            constructAllButtons +='<a href="javascript:;" id="dialogButton' + i + '" ' + defaultButton + '><span>' + myButtonObject.buttonText + '</span></a>';
            $('#dialogButton' + i).live('click',  myButtonObject.callback);
            myButtonObject.createdButton = 'dialogButton' + i;
        });
        (window.options.overlay) ? overlay = '<div class="pageOverlay" style="display:none;"></div>' : overlay = '' ;

        var constructModal = 
            overlay + '<div class="dialog ' + window.options.type + '" style="visibility:hidden;">' +
            '<h1>' + window.options.title +'<a href="javascript:;" id="closeDialog">Close</a></h1>' +
            '<div class="modalBody"><div class="modalWrap">' + window.options.body + '</div></div>' +
            '<div class="dialogFooter">' + constructAllButtons + '</div>' +
            '</div>';

        $('body').append(constructModal);
        if(formID.indexOf('#') != -1) {
            $(formID).appendTo('.modalWrap').css('display', 'block');
            window.options.body = formID;
        }
        centerDialogSizePosition();
        $('.dialog').css({'display' : 'none', 'visibility' : 'visible'});
        $('.dialog, .pageOverlay').fadeIn('fast');

        $('#closeDialog').live('click', closeDialog);

        $(document).keyup(function(e) {
            if (e.keyCode == 13) { 
                $.each(window.options.buttons, function(i, checkIfDefaultDefined){
                    (typeof checkIfDefaultDefined.defaultButton  == 'undefined') ? closeDialog() : checkIfDefaultDefined.callback() ;
                });
            }
            if (e.keyCode == 27) {
                closeDialog();
            }
        });
    }

    window.closeDialog = function( options ) {

        var defaults = {
            animate: true
        };

        options = $.extend(defaults, options); 
        
        $('.dialogFooter a').each(function(i){
            var id = $(this).attr('id');
            $('#' + id).die('click', window.options.buttons[i].callback);
        });
        var formID = window.options.body;
        if(formID.indexOf('#') != -1) {
            $(formID).clone().appendTo('body').css('display', 'none');
        }
        if (options.animate == true) {
            $('.dialog, .pageOverlay').fadeOut('fast', function() {
                $(this).remove();
            });
        } else {
            $('.dialog, .pageOverlay').remove();
        }
        $(document).unbind("keyup");
    }    

    function centerDialogSizePosition() {
        var dialog = $('.dialog');
        var dialogHeight = dialog.outerHeight();
        var dialogPadding = dialogHeight - dialog.height();
        var win = $(window).height();
        var threshold = 60;
        if (dialogHeight > win - threshold) {
            dialog.css('height', win - threshold - dialogPadding);
        }
        dialog.css('margin-top', -dialog.outerHeight()/2);
    }

})( jQuery );