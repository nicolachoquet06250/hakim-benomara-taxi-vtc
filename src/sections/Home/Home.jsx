import styles from './index.module.css';
import DownButton from "../../components/DownButton/DownButton";
import OverlayedSection from '../../layouts/OverlayedSection/OverlayedSection';
import imageHome from '../../assets/image-home.jpg';
import logo from '../../assets/logo-hakim-benomara-v6-dark.svg';

export default function Home() {
    const onClick = () => {
        const goTo = 'second-section';
        const targetSection = document.querySelector(`section.${goTo}`);
    
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
        }
    };

    return (<OverlayedSection>
        <img src={imageHome} alt="logo home" className={styles.backImg} />

        <div className={styles.completeLogoContainer}>
            <img src={logo} alt="logo complet" />
        </div>

        <div className={styles.downButtonContainer}>
            <DownButton onClick={onClick} />
        </div>
    </OverlayedSection>);
}