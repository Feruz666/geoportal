// import 'materialize';
// import 'jquery';
// import 'mapbox-gl';
// import '@supermap/iclient-mapboxgl';
// import 'mapbox-gl-compare';
import { MapboxStyleSwitcherControl } from "mapbox-gl-style-switcher";
import { Map } from "mapbox-gl";

import "mapbox-gl-style-switcher/styles.css";

import "mapbox-gl-style-switcher/styles.css";
const map = new MapboxMap();
map.addControl(new MapboxStyleSwitcherControl());
