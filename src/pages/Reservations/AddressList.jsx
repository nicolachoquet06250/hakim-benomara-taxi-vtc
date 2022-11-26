import { forwardRef } from "react";
import Loader from "../Loader/Loader.jsx";
import styles from './index.module.css';
import { openRouteService } from '../../helpers/apiCredentials.json';

export default forwardRef(function AddressList({ list = [], query = {}, loading, onClick = () => null, onSelected = () => null }, ref) {
    return (<div ref={ref} className={styles.list} onClick={onClick}>
        {list.map((item, i) => 
            (<div key={i} onClick={onClick}>
                <button type="button" className={styles.selectionButton} onClick={e => {
                    e.preventDefault();

                    // SEARCH API
                    fetch(`${openRouteService.searchUrl}&text=${item.properties.label}&api_key=${openRouteService.apiKey}`)
                        .then(r => r.json())
                        .then(json => {
                            if (json.features.length === 1) {
                                onSelected({
                                    type: 'response',
                                    text: json.features[0].properties.label,
                                    lon: json.features[0].geometry.coordinates[0],
                                    lat: json.features[0].geometry.coordinates[1]
                                });
                            } else if (json.features.length > 1) {
                                const best = json.features.reduce((r, c) => r === null || c.properties.confidence > r.properties.confidence ? c : r, null);

                                onSelected({
                                    type: 'response',
                                    text: best?.properties.label,
                                    lon: best?.geometry.coordinates[0],
                                    lat: best?.geometry.coordinates[1]
                                });
                            }
                        });
                }}>
                    {item.properties.label}
                </button>
            </div>))}

        {loading && 
            (<div className={styles.listLoaderContainer}>
                <Loader color={'#000'} />
            </div>)}
    </div>);
})