  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.scrollspy');
    var instances = M.ScrollSpy.init(elems, {
      throttle: 100, 
    });
  });

  focusMethod = function getFocus() {
    document.getElementById("mainlogo").focus();
  }


  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.materialboxed');
    var instances = M.Materialbox.init(elems, {
      inDuration: 275,
      outDuration: 200,
    });
  });