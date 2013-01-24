(function ($) {

    var tooltipTimer = null;

    $.fn.startTooltipTimer = function (delay, message, is_iframe) {
        var item = $(this);
        item.clearTooltip();

        tooltipTimer = setTimeout(function () {
            var useCallback = typeof message == "function";
            if (useCallback) { mess = "<ul><li>&nbsp;</li></ul>"; var cName = 'edtTip' } else { mess = message; var cName = 'editortooltip' }

            item.showTooltip({
                msg: mess,
                iframe: is_iframe,
                className: cName,
                aOffset: 30
            });

            if (useCallback) {
                message("#toolTipBody", item);
            }
        }, delay);
    };

    $.fn.clearTooltip = function () {
        if (tooltipTimer) {
            clearTimeout(tooltipTimer);
            tooltipTimer = null;
        }

        $('.editortooltip, .edtTip').remove();
    };

    $.fn.showTooltip = function (options) {
        var defaults = {
            msg: 'tooltip message',
            iframe: false,
            padding: 20,
            className: 'sTip',
            aOffset: 0
        };
        options = $.extend({}, defaults, options);

        var left = $(this).offset().left + $(this).width() / 2, // GETS CENTER POINT OF OBJECT FOR MORE ACCURATE READING
            top = $(this).offset().top + $(this).height() / 2, // GETS CENTER POINT OF OBJECT FOR MORE ACCURATE READING
            winTopMax = $(window).height() / 2,
            winLeftMax = $(window).width() / 2,
            cName = '.' + options.className,
            pos = '';






        // GETS CENTER POINT RELATIVE TO IFRAME
        if (options.iframe === true) {
            var itemHtml = $(this).closest("html");
            var iframe = $("iframe").filter(function () { return itemHtml.get(0) == $(this).contents().find("html").get(0); });
            left += iframe.offset().left;
            top += iframe.offset().top;
        }




        // DECIDES WHAT QUADRANT
        (top >= 1 && top <= winTopMax) ? pos = 'top' : pos = 'bottom';
        (left >= 1 && left <= winLeftMax) ? pos += 'left' : pos += 'right';

        $('body').prepend('<div class="' + options.className + ' ' + pos + '" style="visibility:hidden; display:block; z-index:9999;"><span class="head"></span><div id="toolTipBody">' + options.msg + '</div><span class="foot"></span><span class="arrow"></span></div>');




        // PLACES OH SO DELECATELY
        var tooltipHeight = $(cName).outerHeight(),
            tooltipWidth = $(cName).outerWidth();

        switch (pos) {
            case "topleft":
                top += $(this).height() / 2 + options.padding;
                left += -$(this).width() / 2 - options.aOffset;
                break;
            case "bottomleft":
                top += -tooltipHeight - $(this).height() / 2 - options.padding;
                left += -$(this).width() / 2 - options.aOffset;
                break;
            case "topright":
                top += $(this).height() / 2 + options.padding;
                left += $(this).width() / 2 - tooltipWidth + options.aOffset;
                break;
            case "bottomright":
                top += -$(this).height() / 2 - tooltipHeight - options.padding;
                left += $(this).width() / 2 - tooltipWidth + options.aOffset;
                break;
        }

        $(cName).css({ 'left': left + 'px', 'top': top + 'px', 'display': 'none', 'visibility': 'visible' }).show();

    }


    $.fn.simpleRadio = function (options) {

        var defaults = {
            afterChange: $.noop
        };
        options = $.extend({}, defaults, options);

        function toggActive(target) {
            target.closest('.toggleRadio').find('.checked').removeClass('checked');
            target.parent().addClass('checked');
        }

        $(this).find('input').each(function () {

            $(this).css('opacity', '0');

            if ($(this).attr("checked")) {
                toggActive($(this));
            }

            $(this).change(function () {
                toggActive($(this));
                options.afterChange($(this).attr('value'));
            });

        });

    }

    $.fn.simpleCheck = function () {

        function toggActive(target) {
            if (target.attr("checked")) {
                target.parent().addClass('checked');
            }
            else {
                target.parent().removeClass('checked');
            }
        }

        $(this).find('input').each(function () {

            $(this).css('opacity', '0');

            if ($(this).attr("checked")) {
                toggActive($(this));
            }

            $(this).change(function () {
                toggActive($(this));
            });

        });

    }


    $.fn.simpleTip = function (options) {
        var defaults = {
            position: 'top', // MERGE AND DECIDE YOURSELF
            msg: 'tooltip message' // NEW OPTION CALLED CENTERED
        };
        options = $.extend({}, defaults, options);
        var offset = $(this).offset();
        var height = $(this).outerHeight();
        var width = $(this).outerWidth();
        $('body').prepend('<div class="simpleTip ' + options.position + '" style="visibility:hidden;"><h1><span>' + options.msg + '</span></h1></div>');

        var tooltipHeight = $('.simpleTip').outerHeight();
        if (options.position == 'top') {
            var top = offset.top - tooltipHeight - height / 2;
        } else {
            var top = offset.top + height / 2 + tooltipHeight / 2;
        }
        var tooltipWidth = $('.simpleTip').outerWidth();

        var left = offset.left - tooltipWidth / 2 + width / 2;
        $('.simpleTip').css({ 'left': left + 'px', 'top': top + 'px', 'display': 'none', 'visibility': 'visible' }).fadeIn(200);
    }
})(jQuery);