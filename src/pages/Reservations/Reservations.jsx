import { useCallback, useEffect, useRef, useState } from "react";
import { useClickAway, useGeolocation } from 'react-use';
import AddressList from "./AddressList";
import styles from './index.module.css';
import { openRouteService } from '../../helpers/apiCredentials.json';
import Openrouteservice from 'openrouteservice-js';

export default function Reservations() {
    const [addressQuery, setAddressQuery]               = useState('');
    const [queryResult, setQueryResult]                 = useState([]);
    const [coordinates, setcoordinates]                 = useState({lon: null, lat: null});
    const [loading, setLoading]                         = useState(false);
    const [searchFocused, setSearchFocused]             = useState(false);
    const [listFocused, setListFocused]                 = useState(false);
    const addressList                                   = useRef(null);
    const currentCoordinates                            = useGeolocation();
    const [currentAddress, setCurrentAddress]           = useState(null);
    const [totalTravelDistance, setTotalTravelDistance] = useState(0);
    const inputAddressSearchRef                         = useRef(null);

    const link = `${openRouteService.autocompleteUrl}&text=${addressQuery}&api_key=${openRouteService.apiKey}`;

    const makeAutocomplete = useCallback(async () => {
        setLoading(true);
        // AUTOCIMPLETE API
        const r = await fetch(link);
        return await r.json();
    }, [link]);

    useEffect(() => {
        if (addressQuery !== '') {
            makeAutocomplete()
                .then(setQueryResult)
                .catch(err => console.error(err))
                .finally(() => setLoading(false))
        } else {
            setQueryResult([]);
        }
    }, [addressQuery]);

    useClickAway(addressList, () => setListFocused(false));
    
    useEffect(() => {
        const { longitude, latitude } = currentCoordinates;

        if (latitude !== null && longitude !== null) {
            // REVERSE API
            (new Openrouteservice.Geocode({ api_key: openRouteService.apiKey })).reverseGeocode({
                point: {
                    lat_lng: [latitude, longitude],
                    radius: 50
                },
                boundary_country: ['FR']
            }).then(json => {
                const best = json.features.reduce((r, c) => r === null || c.properties.confidence > r.properties.confidence ? c : r, null);

                setCurrentAddress(best);
            })
        }
    }, [currentCoordinates]);

    useEffect(() => {
        const { lon, lat } = coordinates;

        if (currentAddress && lon !== null && lat !== null) {
            (new Openrouteservice.Directions({ api_key: openRouteService.apiKey })).calculate({
                coordinates: [
                    [currentAddress.geometry.coordinates[0], currentAddress.geometry.coordinates[1]],
                    [lon, lat],
                ],
                profile: 'driving-car',
                format: 'json',
                api_version: 'v2',
                units:"km",
                geometry_simplify:"false",
                language:"fr-fr",
                maneuvers:"false",
            })
            .then(json => {
                setTotalTravelDistance(json.routes.map(r => r.summary.distance).reduce((r, c) => r + c, 0))
            }).catch(err => {
                console.log(err.message)
            })
        }
    }, [coordinates, currentAddress])

    const showList = ((queryResult.features?.length ?? 0) > 0 && searchFocused) || listFocused;

    return (<>
        {currentAddress && <>
            <details>
                <summary>
                    Vous êtes actuellement ici : 
                </summary>
                
                {currentAddress.properties.label}
            </details>
        
            <br />
        </>}

        <input  type='text' 
                placeholder="Saisissez l'adresse ici"
                ref={inputAddressSearchRef}
                className={styles.addressSearch}
                defaultValue={addressQuery} 
                onInput={e => setAddressQuery(e.target.value)} 
                onFocus={() => setSearchFocused(true)} 
                onBlur={() => setTimeout(() => {setSearchFocused(false)}, 150)} />

        <div>
            {showList && <AddressList 
                            list={queryResult.features} 
                            ref={addressList}
                            query={queryResult.geocoding.query} 
                            loading={loading}
                            onClick={() => setListFocused(true)}
                            onSelected={({ lon, lat, text }) => {
                                console.log(text)
                                setAddressQuery(text);
                                inputAddressSearchRef.current.value = text;
                                setcoordinates({ lon, lat });

                                setListFocused(false);
                                setSearchFocused(false);
                            }} />}
            
            {totalTravelDistance !== 0 ? <><br />Le trajet sera de : {totalTravelDistance}km, ( <b>{Math.round(totalTravelDistance) * .5}€</b> )</> : null}
        </div>
    </>);
};