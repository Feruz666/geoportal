var map = L.map("map", {
  zoomControl: false,
}).setView([55.98696, 35.21833], 17);

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

let ndvi = L.nonTiledLayer
  .wms("http://localhost:8080/geoserver/wms?", {
    layers: "tiff:rededge-ndvi",
    format: "image/png",
    transparent: true,
    pane: 'tilePane',
    tiled: false,
  })
  .addTo(map);

map.addEventListener("mousemove", (event) => {
  let lat = event.latlng.lat;
  let lng = event.latlng.lng;
  var x = document.getElementById("x");
  var y = document.getElementById("y");
  var z = document.getElementById("z");
  x.value = lat; 
  y.value = lng;
  z.value = map.getZoom();
});

let ndre = L.nonTiledLayer
  .wms("http://localhost:8080/geoserver/wms?", {
    layers: "tiff:rededge-ndre",
    format: "image/png",
    transparent: true,
    tiled: false,
  });
let rgb = L.nonTiledLayer
  .wms("http://localhost:8080/geoserver/wms?", {
    layers: "tiff:rededge-rgb",
    format: "image/png",
    transparent: true,
    tiled: false,
  });
let rgb_sony = L.nonTiledLayer
  .wms("http://localhost:8080/geoserver/wms?", {
    layers: "tiff:sony_rx",
    format: "image/png",
    transparent: true,
    tiled: false,
  });

  let neuro = L.nonTiledLayer
  .wms("http://localhost:8080/geoserver/wms?", {
    layers: "tiff:neuro",
    format: "image/png",
    transparent: true,
    tiled: false,
  });
var overlays = {
  NDVI: ndvi,
  NDRE: ndre,
  NeuroForest: neuro,
  "Естественные цвета": rgb,
  "Естественные цвета высокого разрешения": rgb_sony,
  // "Продук нейронной сети": neuro,
};

var baseLayers = {};

var obj = {
  "Улицы": mapbox_s,
  "Улицы (темная)": m_d,
  "Спутник": m_s,
  OpenStreetMap: osm,
};

baseLayers = Object.assign(baseLayers, obj);

L.control.layers(baseLayers, overlays,{
    collapsed: false
}).addTo(map);

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


map.pm.Toolbar.changeControlOrder(['drawCircle', 'drawRectangle', 'removalMode', 'editMode']);  

map.pm.setPathOptions({  
  color: 'rgb(197, 10, 208)',  
  fillColor: 'grey',  
  fillOpacity: 0.4,  
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
// setTimeout(()=>{map.flyTo([55.98696, 35.21833], 17);}, 1000);


