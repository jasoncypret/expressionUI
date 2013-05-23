/* expressionUI popover v2.0
 * https://github.com/jasoncypret/expressionUI
 *
 * Copyright (c) 2013 Jason Cypret (http://jasoncypret.com/)
 * Licensed under the MIT License
 */

(function ($) {
    $.fn.popover = function (options) {
        var defaults = {
            content: $('.popover'),
            padding: 0,
            aOffset: 55
        };
        options = $.extend({}, defaults, options);
        var left = $(this).offset().left,
            top = $(this).offset().top,
            winTopMax = $(window).height() / 2,
            winLeftMax = $(window).width() / 2,
            pos = '',
            num = 0,
            tooltipHeight,
            tooltipWidth;
        (top >= 1 && top - $(window).scrollTop() <= winTopMax) ? pos = 'top' : pos = 'bottom';
        (left >= 1 && left - $(window).scrollLeft() <= winLeftMax) ? pos += 'left' : pos += 'right';
        options.content.addClass('popover_container ' + pos).css({visibility: 'hidden', display: 'block', zIndex: '9999'});
        tooltipHeight = options.content.outerHeight();
        tooltipWidth = options.content.outerWidth();
        switch (pos) {
            case "topleft":
                top += ( $(this).outerHeight() * Math.PHI ) + options.padding;
                left -= options.aOffset / (Math.PHI * Math.PHI);
                break;
            case "topright":
                top += ( $(this).outerHeight() * Math.PHI ) + options.padding;
                left -= tooltipWidth - options.aOffset;
                break;
            case "bottomleft":
                top -= tooltipHeight + ($(this).outerHeight() / 2);
                left -= options.aOffset / (Math.PHI * Math.PHI);
                break;
            case "bottomright":
                top -= tooltipHeight + ($(this).outerHeight() / 2);
                left -= tooltipWidth - options.aOffset;
                break;
        }
        options.content.css({ 'left': left + 'px', 'top': top + 'px', 'display': 'none', 'visibility': 'visible' }).show();
        $(this).addClass('popover_active')
        var removePopup = function (e) {
            num++;
            if (num > 1) {
                $(options.content).removeClass('popover_container topleft bottomleft topright bottomright').hide();
                $(document).unbind('click.popover content.scroll');
                $('.popover_active').removeClass('popover_active')
            }
        };
        $(document).bind('click.popover content.scroll', removePopup);
    }
})(jQuery);

//TODO: Move to a global place
Math.PHI = 1.61803398875;