import styles from './index.module.css';
import Section from "../../layouts/Section/Section";
import Menu from "../../components/Menu";
import { Outlet } from 'react-router-dom';

export default function Sectionned() {
    return (<Section name="second-section" customClasses={styles.section}>
        <Menu />

        <div className={styles.outletContainer}>
            <Outlet />
        </div>
    </Section>);
}