document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems, {
        accordion: true,
    });
  });

  mapboxgl.accessToken = 'pk.eyJ1IjoidHJvbXNvIiwiYSI6ImNrbHFlaml1eDFiczUybmw2dHBmaXV5cHQifQ.dMP0Ehf9s1AWEmvgYJZdcg';
  var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: [65.5268919467926,
    57.15829204273426], // starting position [lng, lat]
  zoom: 15 // starting zoom
  });