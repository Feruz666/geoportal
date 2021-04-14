mapboxgl.accessToken =
  "pk.eyJ1Ijoib2RsZXJhbCIsImEiOiJja2F5cHRubWIwbTNjMnpvN3c4djNiN3U1In0.LbTdZqW972B3EQuymd6g-w";
var map = new mapboxgl.Map({
  container: "public_map_2",
  zoom: 8,
  center: [58, 60],
  pitch: 0,
  bearing: 0,
  style: "mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y",
});
map.addControl(new mapboxgl.NavigationControl());

// function change_base_layer(){
//     if(document.getElementById("layer").value == "street"){
//         map.setStyle("mapbox://styles/mapbox/streets-v11");
//     }else{
//         map.setStyle("mapbox://styles/mapbox/satellite-v9");
//     }
// }
