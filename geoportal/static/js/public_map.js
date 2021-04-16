
mapboxgl.accessToken =
  "pk.eyJ1Ijoib2RsZXJhbCIsImEiOiJja2F5cHRubWIwbTNjMnpvN3c4djNiN3U1In0.LbTdZqW972B3EQuymd6g-w";

var currentStyle = "night_basic";

var first = new mapboxgl.Map({
  container: "public_map_1",
  style: "mapbox://styles/odleral/cknh4u6k61ybk17p3nx6fm7wz",
  center: [35.21833, 55.98696],
  zoom: 16,
});

var second = new mapboxgl.Map({
  container: "public_map_2",
  style: "mapbox://styles/odleral/cknh4u6k61ybk17p3nx6fm7wz",
  center: [35.21833, 55.98696],
  zoom: 16,
});

var container = "#comparison-container";



// var language = new MapboxLanguage();
// first.addControl(language);
// second.addControl(language);


first.on("load", function () {
    first.addSource("rededge_rgb", {
    type: "raster",
    
    tiles: [
      "https://geoportal.utmn.ru/geoserver/tiff/wms?BBOX={bbox-epsg-3857}&SERVICE=WMS&REQUEST=GetMap&CRS=EPSG:3857&transparent=true&WIDTH=256&HEIGHT=256&LAYERS=tiff:rededge-ndvi&FORMAT=image/png",
    ],
    tileSize: 256,
  });
  first.addLayer(
    {
      id: "rededge_rgb",
      type: "raster",
      source: "rededge_rgb",
    },
  );
});
second.on("load", function () {
    second.addSource("rededgeNDVI", {
    type: "raster",
    // use the tiles option to specify a WMS tile source URL
    // https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/
    tiles: [
        "https://geoportal.utmn.ru/geoserver/tiff/wms?BBOX={bbox-epsg-3857}&SERVICE=WMS&REQUEST=GetMap&CRS=EPSG:3857&transparent=true&WIDTH=256&HEIGHT=256&LAYERS=tiff:rededge-rgb&FORMAT=image/png",
      ],
      tileSize: 256,
  });
  second.addLayer(
    {
      id: "rededgeNDVI",
      type: "raster",
      source: "rededgeNDVI",
    },
    "aeroway-line"
  );
});
first.setStyle("mapbox://styles/odleral/cknh4u6k61ybk17p3nx6fm7wz");
second.setStyle("mapbox://styles/odleral/cknh4u6k61ybk17p3nx6fm7wz");

first.addControl(new CompasControl(), 'left-right');

var map = new mapboxgl.Compare(first, second, container, {
    // Set this to enable comparing two maps by mouse movement:
  //   mousemove: true
});


