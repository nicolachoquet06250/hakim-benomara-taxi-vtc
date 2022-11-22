import Link from '../Link/Link';
import logo from '../../assets/logo-hakim-benomara-v6-dark-sm.svg';
import Button from '../Button/Button.jsx';
import { menu } from '../Sidebar/Sidebar';
import styles from './index.module.css';
import { useEffect, useRef, useState } from 'react';

export default function Navbar({ onToggleSidebar = e => null }) {
    const [selectorPositionX, setSelectorPositionX] = useState('0px');
    const [selectorWidth, setSelectorWidth] = useState('0px');
    const sizes = useRef([]);
    const currentSelectedMenuItemIndex = useRef(0);
    const [showMenuItems, setShowMenuItems] = useState(true);
    
    const handleSelected = i => ({ width }) => {
        setSelectorWidth(`${width + 10}px`);
        setSelectorPositionX(`${sizes.current.filter((_, j) => j < i).reduce((r, c) => r + c, 0)}px`);
        currentSelectedMenuItemIndex.current = i;
    };

    const handleLoaded = i => ({ width }) => {
        sizes.current = (s => {
            if (s[i]) {
                s[i] = width + 10;
                return s;
            }

            return [...s, width + 10];
        })(sizes.current);
    };

    useEffect(() => {
        const mq = window.matchMedia('screen and (max-width: 660px)');
        const handleChange = () => setShowMenuItems(!mq.matches);

        handleChange();
        mq.addEventListener('change', handleChange)
    }, []);

    return (<nav className={styles.nav}>
        <img src={logo} alt='logo simplifié' className={styles.logo} />

        <Button icon='ellipsis-vertical' 
                title='toggle sidebar' 
                customClasses={styles.sidebarButton} 
                onClick={onToggleSidebar} />

        <ul className={styles.menu}>
            {menu.map(({ label, href }, i) => 
                (<li key={i} className={styles.menuItem + ' link-container'}>
                    {showMenuItems && <Link to={href} 
                        className={styles.link} 
                        onSelected={handleSelected(i)} 
                        onLoaded={handleLoaded(i)}>
                        {label}
                    </Link>}
                </li>))}

            <div className={'selector ' + styles.menuSelector} 
                 style={{
                    '--width': selectorWidth, 
                    '--position-x': selectorPositionX
                 }} />
        </ul>
    </nav>);
}