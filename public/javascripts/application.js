//
// Module pattern:
// http://yuiblog.com/blog/2007/06/12/module-pattern
//
var APP = (function($, window, document, undefined) {
  // For use only inside APP.
  var PRIVATE_CONSTANT_1 = 'foo';
  var PRIVATE_CONSTANT_2 = 'bar';

  // Expose contents of APP.
  return {
    go: function() {
      for (var i in APP.init) {
        APP.init[i]();
      }
    },
    init: {
      call_automatically_one: function() {
        // Called on page-load.
        // Can still be called individually, via:
        // APP.init.call_automatically_one();
      },
      call_automatically_two: function() {
        // Called on page-load.
        // Can still be called individually, via:
        // APP.init.call_automatically_two();
      }
    },
    misc: {
      call_specifically_one: function() {
        // Must be called individually, via:
        // APP.misc.call_specifically_one();
      },
      call_specifically_two: function() {
        // Must be called individually, via:
        // APP.misc.call_specifically_two();
      }
    }
  };
  // Alias jQuery, window, document.
})(this.jQuery, this, this.document);

//
// Automatically calls all functions in APP.init
//
this.jQuery(document).ready(function() {
  APP.go();
});