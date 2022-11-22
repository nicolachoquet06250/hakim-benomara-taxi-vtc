import Link from "../Link/Link";
import logo from '../../assets/logo-hakim-benomara-v6-dark-sm.svg';
import styles from './index.module.css';

export const menu = [
    {
        label: 'Réserver une course', 
        href: '/reservation'
    }, {
        label: 'Expericences professionnelles', 
        href: '/experiences'
    }, {
        label: 'Nos services', 
        href: '/services'
    }, {
        label: 'A propos', 
        href: '/a-propos'
    }, {
        label: 'Contact', 
        href: '/contact'
    }
];

export default function Sidebar({ opened = false, onClose = () => null }) {
    return (<>
        <div className={styles.overlay + ' ' + (opened ? styles.overlayOpened : '')} 
             onClick={onClose} />

        <aside className={styles.aside + ' ' + (opened ? styles.asideOpened : '')}>
            <header>
                <button onClick={e => {
                    e.preventDefault();
                    onClose(e);
                }}>
                    <i className="fa-solid fa-arrow-right-from-bracket" />
                </button>

                <img src={logo} alt="logo simplifié" />
            </header>

            <main>
                <ul>
                    {menu.map((item, i) => 
                        (<Link tag='li' key={i} to={item.href}>
                            {item.label}
                        </Link>))}
                </ul>
            </main>
        </aside>
    </>);
}