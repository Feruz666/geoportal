(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var mapbox_control_switcher = require('mapbox-gl-style-switcher');
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

first.addControl(new mapbox_control_switcher.MapboxStyleSwitcherControl());

var map = new mapboxgl.Compare(first, second, container, {
  // Set this to enable comparing two maps by mouse movement:
//   mousemove: true
});



},{"mapbox-gl-style-switcher":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MapboxStyleSwitcherControl {
    constructor(styles, defaultStyle) {
        this.styles = styles || MapboxStyleSwitcherControl.DEFAULT_STYLES;
        this.defaultStyle = defaultStyle || MapboxStyleSwitcherControl.DEFAULT_STYLE;
        this.onDocumentClick = this.onDocumentClick.bind(this);
    }
    getDefaultPosition() {
        const defaultPosition = "top-right";
        return defaultPosition;
    }
    onAdd(map) {
        this.map = map;
        this.controlContainer = document.createElement("div");
        this.controlContainer.classList.add("mapboxgl-ctrl");
        this.controlContainer.classList.add("mapboxgl-ctrl-group");
        this.mapStyleContainer = document.createElement("div");
        this.styleButton = document.createElement("button");
        this.styleButton.type = "button";
        this.mapStyleContainer.classList.add("mapboxgl-style-list");
        for (const style of this.styles) {
            const styleElement = document.createElement("button");
            styleElement.type = "button";
            styleElement.innerText = style.title;
            styleElement.classList.add(style.title.replace(/[^a-z0-9-]/gi, '_'));
            styleElement.dataset.uri = JSON.stringify(style.uri);
            styleElement.addEventListener("click", event => {
                const srcElement = event.srcElement;
                if (srcElement.classList.contains("active")) {
                    return;
                }
                this.map.setStyle(JSON.parse(srcElement.dataset.uri));
                this.mapStyleContainer.style.display = "none";
                this.styleButton.style.display = "block";
                const elms = this.mapStyleContainer.getElementsByClassName("active");
                while (elms[0]) {
                    elms[0].classList.remove("active");
                }
                srcElement.classList.add("active");
            });
            if (style.title === this.defaultStyle) {
                styleElement.classList.add("active");
            }
            this.mapStyleContainer.appendChild(styleElement);
        }
        this.styleButton.classList.add("mapboxgl-ctrl-icon");
        this.styleButton.classList.add("mapboxgl-style-switcher");
        this.styleButton.addEventListener("click", () => {
            this.styleButton.style.display = "none";
            this.mapStyleContainer.style.display = "block";
        });
        document.addEventListener("click", this.onDocumentClick);
        this.controlContainer.appendChild(this.styleButton);
        this.controlContainer.appendChild(this.mapStyleContainer);
        return this.controlContainer;
    }
    onRemove() {
        if (!this.controlContainer || !this.controlContainer.parentNode || !this.map || !this.styleButton) {
            return;
        }
        this.styleButton.removeEventListener("click", this.onDocumentClick);
        this.controlContainer.parentNode.removeChild(this.controlContainer);
        document.removeEventListener("click", this.onDocumentClick);
        this.map = undefined;
    }
    onDocumentClick(event) {
        if (this.controlContainer && !this.controlContainer.contains(event.target)
            && this.mapStyleContainer && this.styleButton) {
            this.mapStyleContainer.style.display = "none";
            this.styleButton.style.display = "block";
        }
    }
}
MapboxStyleSwitcherControl.DEFAULT_STYLE = "Streets";
MapboxStyleSwitcherControl.DEFAULT_STYLES = [
    { title: "Dark", uri: "mapbox://styles/mapbox/dark-v10" },
    { title: "Light", uri: "mapbox://styles/mapbox/light-v10" },
    { title: "Outdoors", uri: "mapbox://styles/mapbox/outdoors-v11" },
    { title: "Satellite", uri: "mapbox://styles/mapbox/satellite-streets-v11" },
    { title: "Streets", uri: "mapbox://styles/mapbox/streets-v11" }
];
exports.MapboxStyleSwitcherControl = MapboxStyleSwitcherControl;

},{}]},{},[1]);
