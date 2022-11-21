import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import { openstreetmap } from '../../helpers/apiCredentials.json';

export default function Map({ currentPosition, routes = [], addresses }) {
    const map               = useRef(null);
    const initializedMap    = useRef(null);

    // Fonction d'initialisation de la carte
    function initMap() {
        // console.log(currentPosition)
        // Créer l'objet "macarte" et l'insèrer dans l'élément HTML qui a l'ID "map"
        initializedMap.current = L.map(map.current)
            .setView([currentPosition.latitude, currentPosition.longitude], 11);
        // Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer. Ici, openstreetmap.fr
        L.tileLayer(openstreetmap.layer, {
            // Il est toujours bien de laisser le lien vers la source des données
            attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
            minZoom: 1,
            maxZoom: 20
        }).addTo(initializedMap.current);
    }

    useEffect(() => {
        if (!initializedMap.current) {
            initMap();
        }
    }, [map]);

    useEffect(() => {
        if (initializedMap.current) {
            // console.log(routes);

            routes.map(r => {
                r = r.map(c => [...c.reverse()])
                const firstPoint = r[0];
                const lastPoint = r[r.length - 1];

                L.marker([firstPoint[0], firstPoint[1]])
                    .addTo(initializedMap.current)
                    .bindPopup(`<center>Départ <br /> ${addresses.start}</center>`)
                    .openPopup();
                
                L.marker([lastPoint[0], lastPoint[1]])
                    .addTo(initializedMap.current)
                    .bindPopup(`<center>Arrivée <br /> ${addresses.end}</center>`)
                    .openPopup();

                    
                var polyline = L.polyline(r, {color: 'red'})
                    .addTo(initializedMap.current);

                // zoom the map to the polyline
                initializedMap.current.fitBounds(polyline.getBounds());
            })
        }
    }, [routes])

    return (<div ref={map} style={{ zIndex: 0 }}></div>)
}