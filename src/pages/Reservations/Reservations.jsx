import { useCallback, useEffect, useRef, useState } from "react";
import { useClickAway, useGeolocation } from 'react-use';
import AddressList from "./AddressList.jsx";
import styles from './index.module.css';
import { openRouteService } from '../../helpers/apiCredentials.json';
import Openrouteservice from 'openrouteservice-js';
import Map from "../../components/Map/Map.jsx";

export default function Reservations() {
    const [addressQuery, setAddressQuery]                   = useState('');
    const [tmpAddressQuery, setTmpAddressQuery]             = useState('');
    const [startAddressQuery, setStartAddressQuery]         = useState('');
    const [tmpStartAddressQuery, setTmpStartAddressQuery]   = useState('');
    const [queryResult, setQueryResult]                     = useState([]);
    const [startQueryResult, setStartQueryResult]           = useState([]);
    const [coordinates, setCoordinates]                     = useState({
        lon: null, 
        lat: null
    });
    const [loading, setLoading]                             = useState(false);
    const [startLoading, setStartLoading]                   = useState(false);
    const [searchFocused, setSearchFocused]                 = useState(false);
    const [startSearchFocused, setStartSearchFocused]       = useState(false);
    const [listFocused, setListFocused]                     = useState(false);
    const [startListFocused, setStartListFocused]           = useState(false);
    const addressList                                       = useRef(null);
    const startAddressList                                  = useRef(null);
    const currentCoordinates                                = useGeolocation();
    const [_currentCoordinates, setCurrentCoordinates]      = useState({});
    const [currentAddress, setCurrentAddress]               = useState(null);
    const [totalTravelDistance, setTotalTravelDistance]     = useState(0);
    const [travelRouteItneraire, setTravelRouteItneraire]   = useState([]);
    const inputAddressSearchRef                             = useRef(null);
    const inputStartAddressSearchRef                        = useRef(null);
    const lastGeolocalisationLoadingState                   = useRef(true);

    const [addresses, setAddresses]                         = useState({
        start: '',
        end: ''
    });
    const [currentPosition, setCurrentPosition]             = useState({
        latitude: 0,
        longitude: 0
    });

    const link = query => `${openRouteService.autocompleteUrl}&text=${query}&api_key=${openRouteService.apiKey}`;

    const makeAutocomplete = useCallback(async query => {
        setLoading(true);
        // AUTOCIMPLETE API
        const r = await fetch(link(query));
        return await r.json();
    }, [link]);

    useEffect(() => {
        if (tmpAddressQuery !== '') {
            makeAutocomplete(tmpAddressQuery)
                .then(setQueryResult)
                .catch(err => console.error(err))
                .finally(() => setLoading(false))
        } else {
            setQueryResult([]);
        }
    }, [tmpAddressQuery]);

    useEffect(() => {
        if (tmpStartAddressQuery !== '') {
            makeAutocomplete(tmpStartAddressQuery)
                .then(setStartQueryResult)
                .catch(err => console.error(err))
                .finally(() => setStartLoading(false))
        } else {
            setStartQueryResult([]);
        }
    }, [tmpStartAddressQuery]);

    useClickAway(addressList, () => setListFocused(false));
    
    useEffect(() => {
        // if (currentCoordinates && currentCoordinates.loading !== lastGeolocalisationLoadingState.current) {
            const { longitude, latitude } = currentCoordinates;
            const { longitude: _longitude, latitude: _latitude } = _currentCoordinates;

            if ((latitude !== null && longitude !== null) || (_latitude && _longitude)) {
                // REVERSE API
                (new Openrouteservice.Geocode({ api_key: openRouteService.apiKey })).reverseGeocode({
                    point: {
                        lat_lng: [(latitude ?? _latitude), (longitude ?? _longitude)],
                        radius: 50
                    },
                    boundary_country: ['FR']
                }).then(json => {
                    const best = json.features.reduce((r, c) => r === null || c.properties.confidence > r.properties.confidence ? c : r, null);

                    setCurrentAddress(best);
                })
            }
            lastGeolocalisationLoadingState.current = currentCoordinates.loading;
        // }
    }, [currentCoordinates, _currentCoordinates]);

    useEffect(() => {
        const { lon, lat } = coordinates;

        if (currentAddress && lon !== null && lat !== null) {
            (new Openrouteservice.Directions({ api_key: openRouteService.apiKey })).calculate({
                coordinates: [
                    [currentAddress.geometry.coordinates[0], currentAddress.geometry.coordinates[1]],
                    [lon, lat],
                ],
                profile: 'driving-car',
                format: 'geojson',
                api_version: 'v2',
                units:"km",
                geometry_simplify:"false",
                language:"fr-fr",
                maneuvers:"false",
            })
            .then(json => {
                setTotalTravelDistance(json.features.map(r => r.properties.summary.distance).reduce((r, c) => r + c, 0));
                setTravelRouteItneraire(json.features.map(r => r.geometry.coordinates.map(c => [...c.reverse()])));
            }).catch(err => {
                console.error(err)
            })
        }
    }, [coordinates]);

    useEffect(() => {
        if (
            addresses.start !== (currentAddress?.properties.label ?? '') || 
            addresses.start !== (startAddressQuery ?? '') || 
            addresses.end !== (addressQuery ?? '')
        ) {
            setAddresses({
                start: ((currentAddress?.properties.label ?? startAddressQuery) ?? ''),
                end: addressQuery
            });
        }
    }, [currentAddress, startAddressQuery, addressQuery]);

    useEffect(() => {
        if (
            currentPosition.latitude !== ((currentCoordinates.latitude ?? _currentCoordinates.latitude) ?? 0) || 
            currentPosition.longitude !== ((currentCoordinates.longitude ?? _currentCoordinates.longitude) ?? 0)
        ) {
            setCurrentPosition({
                latitude: ((currentCoordinates.latitude ?? _currentCoordinates.latitude) ?? 0), 
                longitude: ((currentCoordinates.longitude ?? _currentCoordinates.longitude) ?? 0)
            });
        }
    }, [currentCoordinates, _currentCoordinates]);

    const showList = ((queryResult.features?.length ?? 0) > 0 && searchFocused) || listFocused;
    const showStartList = ((startQueryResult.features?.length ?? 0) > 0 && startSearchFocused) || startListFocused;

    console.log(currentAddress)

    return (<div className={styles.container}>
        <div>
            <h1> Réservez une course </h1>

            <p>
                Saisissez {currentCoordinates.latitude === null || currentCoordinates.longitude === null ? <>Votre adresse de départ et</> : null} 
                votre adresse d'arrivée pour calculer l'itinérère le plus court et ainsi calculer le prix de votre course.
            </p>
                
            {totalTravelDistance !== 0 ? <>Le trajet sera de : {totalTravelDistance}km, ( <b>{Math.round(totalTravelDistance) * .5}€</b> )<br /></> : null}

            {!(currentCoordinates.latitude === null || currentCoordinates.longitude === null) && 
                (<input type='text' 
                        disabled={true}
                        ref={inputStartAddressSearchRef}
                        className={styles.addressSearch}
                        defaultValue={currentAddress?.properties.label ?? ''} />)}

            {(currentCoordinates.latitude === null || currentCoordinates.longitude === null) && 
                (<input type='text' 
                        placeholder="Saisissez l'adresse de départ ici"
                        ref={inputStartAddressSearchRef}
                        className={styles.addressSearch}
                        defaultValue={tmpStartAddressQuery} 
                        onInput={e => setTmpStartAddressQuery(e.target.value)} 
                        onFocus={() => setStartSearchFocused(true)} 
                        onBlur={() => {
                            setTimeout(() => {
                                setStartSearchFocused(false)
                                setStartAddressQuery(tmpStartAddressQuery)
                            }, 150)
                        }} />)}

            <div className={styles.autocompletionContainer}>
                {(currentCoordinates.latitude === null || currentCoordinates.longitude === null) && showStartList && 
                    (<AddressList 
                        list={startQueryResult.features} 
                        ref={startAddressList}
                        query={startQueryResult.geocoding.query} 
                        loading={startLoading}
                        onClick={() => setStartListFocused(true)}
                        onSelected={({ lon, lat, text }) => {
                            setStartAddressQuery(text);
                            inputStartAddressSearchRef.current.value = text;
                            setCurrentCoordinates({ longitude: lon, latitude: lat });

                            setStartListFocused(false);
                            setStartSearchFocused(false);
                        }} />)}
            </div>

            <input  type='text' 
                    placeholder="Saisissez l'adresse d'arrivé ici"
                    ref={inputAddressSearchRef}
                    className={styles.addressSearch}
                    defaultValue={tmpAddressQuery} 
                    onInput={e => setTmpAddressQuery(e.target.value)} 
                    onFocus={() => setSearchFocused(true)} 
                    onBlur={() => setTimeout(() => {setSearchFocused(false)}, 150)} />

            <div className={styles.autocompletionContainer}>
                {showList && <AddressList 
                                list={queryResult.features} 
                                ref={addressList}
                                query={queryResult.geocoding.query} 
                                loading={loading}
                                onClick={() => setListFocused(true)}
                                onSelected={({ lon, lat, text }) => {
                                    setAddressQuery(text);
                                    inputAddressSearchRef.current.value = text;
                                    setCoordinates({ lon, lat });

                                    setListFocused(false);
                                    setSearchFocused(false);
                                }} />}
            </div>
        </div>

        <Map currentPosition={currentPosition} 
             routes={travelRouteItneraire} 
             addresses={addresses}
        />
    </div>);
};