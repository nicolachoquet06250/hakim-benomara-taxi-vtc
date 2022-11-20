import styles from './index.module.css';

export default function OverlayedSection({ name = '', children }) {
    return (<section className={`overlayed-section ${name} ${styles.section}`}>
        {children}
    </section>);
}