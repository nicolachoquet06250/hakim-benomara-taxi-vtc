import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import { openstreetmap } from '../../helpers/apiCredentials.json';

export default function Map({ currentPosition, routes = [], addresses }) {
    const map                = useRef(null);
    const initializedMap     = useRef(null);
    const localisationMarker = useRef(null);
    const directionsElements = useRef({
        startMarker: null,
        endMarker: null,
        path: null
    });
    const hasCurrentPosition = useRef(!!(
        currentPosition.latitude && 
        currentPosition.longitude
    ));

    useEffect(() => {
        hasCurrentPosition.current = !!(
            currentPosition.latitude && 
            currentPosition.longitude
        );
    }, [currentPosition]);

    useEffect(() => {
        if (!initializedMap.current) {
            const franceCenter = [46.227638, 2.213749];
            const centeredPoint = hasCurrentPosition.current ? [currentPosition.latitude, currentPosition.longitude] : franceCenter;
            
            // Créer l'objet "macarte" et l'insèrer dans l'élément HTML qui a l'ID "map"
            initializedMap.current = L.map(map.current).setView(centeredPoint, 6);

            if (hasCurrentPosition.current) {
                localisationMarker.current?.getElement().remove();

                localisationMarker.current = L.marker([currentPosition.latitude, currentPosition.longitude])
                    .addTo(initializedMap.current)
                    .bindPopup(`Vous êtes ici`)
                    .openPopup();
            }
            // Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer. Ici, openstreetmap.fr
            L.tileLayer(openstreetmap.layer, {
                // Il est toujours bien de laisser le lien vers la source des données
                attribution: /*html*/`données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>`,
                minZoom: 1,
                maxZoom: 20
            }).addTo(initializedMap.current);
        }
    }, [map]);

    useEffect(() => {
        if (initializedMap.current) {            
            if (hasCurrentPosition.current) {
                localisationMarker.current?.getElement().remove();

                initializedMap.current.setView([currentPosition.latitude, currentPosition.longitude], 11);
    
                localisationMarker.current = L.marker([currentPosition.latitude, currentPosition.longitude])
                    .addTo(initializedMap.current)
                    .bindPopup(`<center>Vous êtes ici<br />${addresses.start}</center`)
                    .openPopup();

                if (addresses.start && addresses.end) {
                    localisationMarker.current?.getElement().remove();
                    
                    routes.map(r => {
                        r = r.map(c => [...c.reverse()]);
        
                        const firstPoint = r[0];
                        const lastPoint = r[r.length - 1];
        
                        directionsElements.current.startMarker?.getElement().remove();
                        directionsElements.current.endMarker?.getElement().remove();
                        directionsElements.current.path?.remove();
        
                        directionsElements.current = {
                            ...directionsElements.current,
        
                            startMarker: L.marker([firstPoint[0], firstPoint[1]])
                                .addTo(initializedMap.current)
                                .bindPopup(`<center>Départ <br /> ${addresses.start}</center>`)
                                .openPopup(),
        
                            endMarker: L.marker([lastPoint[0], lastPoint[1]])
                                .addTo(initializedMap.current)
                                .bindPopup(`<center>Arrivée <br /> ${addresses.end}</center>`)
                                .openPopup(),
                                
                            path: L.polyline(r, {color: 'red'}).addTo(initializedMap.current)
                        };
        
                        // zoom the map to the polyline
                        initializedMap.current.fitBounds(directionsElements.current.path.getBounds());
                    })
                }
            }
        }
    }, [routes, addresses])

    return (<div ref={map} style={{ zIndex: 0, minHeight: '40%' }}></div>)
}