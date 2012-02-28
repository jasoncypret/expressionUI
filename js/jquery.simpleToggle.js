(function ($) {

    var methods = {
        init : function () {       
            
            var selects = $(this);
            selects.each(function () {

                var select = $(this);
                var toggle = select.parent();
                var first = select.children('option:first');
                var second = first.next('option');
                var selected = select.children('option:selected').attr('value');
                var tMarkup =   '<label class="firstTxt" data-opt-value="' + first.attr("value") + '">' + first.text() + '</label>';
                    tMarkup +=  '<label class="secondTxt" data-opt-value="' + second.attr("value") + '">' + second.text() + '</label>';
                    tMarkup +=  '<span class="handle">select</span>';

                select.hide().wrap('<a class="simpleToggle" href="javascript:;" style="display:none;"></a>');
                toggle.find('.simpleToggle').append(tMarkup).show();  
                select.simpleToggle('updateToggle', selected);
            });

            $(this).closest('.simpleToggle').click(function() {
                $(this).simpleToggle('updateToggle', methods._changeToggle($(this)) );
            });

        },
        
        updateToggle : function (value) {
            
            var handle = $(this).parent().find('.handle'),
                hWidth = $(this).find('label[data-opt-value=' + value + ']').width(),
                first = $(this).find('option:first').attr('value'),
                pos = {left: '0px'};

            if ( value === first ) 
                pos = {right: '0px'};
     
            handle.attr('style','left:auto; right:auto;').css(pos);
            methods._updateSelect($(this), value);               

        },
        _updateSelect : function (target, value) {

            target.find('select').val(value).change();

        },
        _changeToggle : function (target) {

            var selected = target.find('option:not(:selected)').attr('value');
            target.find('option:selected').attr('selected', '');
            return selected;

        }
    };

    $.fn.simpleToggle = function ( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
        }            
    }
})(jQuery);