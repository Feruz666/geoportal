  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.scrollspy');
    var instances = M.ScrollSpy.init(elems, {
      throttle: 100, 
    });
  });

  focusMethod = function getFocus() {
    document.getElementById("mainlogo").focus();
  }
