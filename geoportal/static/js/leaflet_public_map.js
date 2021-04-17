var map = L.map("map", {
  zoomControl: false,
}).setView([55.98696, 35.21833], 16);

var mapbox_s = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
    {
      maxZoom: 18,
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
    }
  ),
  osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }),
  m_d = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
    {
      maxZoom: 18,
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: "dark-v9",
      tileSize: 512,
      zoomOffset: -1,
    }
  ),
  m_s = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
    {
      maxZoom: 18,
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: "satellite-v9",
      tileSize: 512,
      zoomOffset: -1,
    }
  );

let ndvi = L.tileLayer
  .wms("https://geoportal.utmn.ru/geoserver/wms?", {
    layers: "tiff:rededge-ndvi",
    format: "image/png",
    transparent: true,
  })
  .addTo(map);

map.addEventListener("mousemove", (event) => {
  let lat = Math.round(event.latlng.lat);
  let lng = Math.round(event.latlng.lng);
  var cor = document.getElementById("coordinates");
  cor.innerHTML = lat + ", " + lng;
});

let ndre = L.tileLayer
  .wms("https://geoportal.utmn.ru/geoserver/wms?", {
    layers: "tiff:rededge-ndre",
    format: "image/png",
    transparent: true,
  });
let rgb = L.tileLayer
  .wms("https://geoportal.utmn.ru/geoserver/wms?", {
    layers: "tiff:rededge-rgb",
    format: "image/png",
    transparent: true,
  });
let rgb_sony = L.tileLayer
  .wms("https://geoportal.utmn.ru/geoserver/wms?", {
    layers: "tiff:sony_rx",
    format: "image/png",
    transparent: true,
  });
var overlays = {
  NDVI: ndvi,
  NDRE: ndre,
  "Естественные цвета": rgb,
  "Естественные цвета высокого разрешения": rgb_sony,
  // "Продук нейронной сети": neuro,
};

var baseLayers = {};

var obj = {
  "MapBox-Streets": mapbox_s,
  "MapBox-темная основа": m_d,
  "MapBox-спутник": m_s,
  OpenStreetMap: osm,
};

baseLayers = Object.assign(baseLayers, obj);

L.control.layers(baseLayers, overlays).addTo(map);

L.control
  .zoom({
    position: "topright",
  })
  .addTo(map);

map.pm.setLang("ru");

map.pm.addControls({
  position: "topright",
  drawCircle: true,
  drawMarker: true,
  drawCircleMarker: true,
  drawPolyline: true,
  drawRectangle: true,
  drawPolygon: true,
  drawCircle: true,
  editMode: true,
  dragMode: true,
  cutPolygon: true,
  removalMode: true,
  oneBlock: false,
  drawControls: true,
  editControls: true,
  customControls: true,
  optionsControls: true,
  pinningOption: true,
  snappingOption: true,
});

map.pm.addControls({
  drawControls: true,
  editControls: true,
  optionsControls: true,
  customControls: true,
  oneBlock: false,
});

map.pm.Toolbar.createCustomControl({
  name: "Шторка",
  block: "custom",
  title: "Сравнение слоев карты",
  className: "compareIcon",
  onClick: function () {
    document.location.href = "http://localhost:8000";
  },
});
m_d.addTo(map);
