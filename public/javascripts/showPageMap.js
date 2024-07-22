mapboxgl.accessToken = mapBoxToken
const coords = coordinates
const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/light-v10',
    center: coords,
    zoom: 13,
});

const marker1 = new mapboxgl.Marker()
    .setLngLat(coords)
    .setPopup(new mapboxgl.Popup({ offset: 25}).setHTML(`<h3>${spotName}</h3><p>${spot}</p>`))
    .addTo(map);