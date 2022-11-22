import { useEffect, useRef } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import styles from './index.module.css';

export default function Link({ tag = '', to = '/', className, children, onSelected = () => null, onLoaded = () => null, ...props }) {
    const route = useLocation();
    const containerRef = useRef(null);

    let path = to === '/reservation' ? '/' : to;
    const active = route.pathname === to || route.pathname === path;
    const Tag = tag;

    useEffect(() => {
        onLoaded({ width: containerRef.current?.offsetWidth })
    }, [containerRef]);

    useEffect(() => {
        if (active && containerRef.current) {
            onSelected({ width: containerRef.current?.offsetWidth });
        }
    }, [active]);

    if (tag) {
        return (<Tag ref={containerRef} className={(active ? styles.active : '') + ' link-container'}>
            <RouterLink to={to} className={(className ?? '')} {...props}>
                {children}
            </RouterLink>
        </Tag>);
    }

    return (<RouterLink ref={containerRef} to={to} className={(className ?? '') + (active ? ' ' + styles.active : '')} {...props}>
        {children}
    </RouterLink>)
}

// 263 bis route d'antibes 06560