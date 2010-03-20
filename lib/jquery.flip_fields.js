(function($) {
  var ENTER_KEY = 13;
  var ESC_KEY = 27;
  $.fn.flipFields = function(options) {
    options = options || {};
    var flipFields = this;
    flipFields.data('currentlyFlipped', false);
    flipFields.each(function() {
      var flipField = $(this);
      if (flipField.attr('type') != "text" || flipField.data('isflipField')) return;

      var originalValue = flipField.val();
      flipField.hide();
      var span = $("<span></span>").text(flipField.val()).addClass(options.spanClass);
      span.click(function(e) {
        if (flipFields.data('currentlyFlipped')) {
          flipFields.data('currentlyFlipped').blur();
        }
        flipFields.data('currentlyFlipped', flipField);
        originalValue = flipField.val();
        span.hide();
        flipField.show();
        flipField.focus();
      });

      var onBlur = function(e) {
        span.text(flipField.val());
        flipField.hide();
        span.show();
        flipFields.data('currentlyFlipped', false);
      };
      
      var onKeyPress = function(e) {
        var key = e.keyCode || e.which;
        if (key == ENTER_KEY) {
          flipField.blur();
          e.preventDefault();
        }
        if (key == ESC_KEY) {
          flipField.val(originalValue);
          flipField.blur();
          e.preventDefault();
        }
      };

      flipField.blur(onBlur);
      flipField.keypress(onKeyPress);

      flipField.before(span);
      flipField.data('isflipField', true)

    });
  };
})(jQuery);