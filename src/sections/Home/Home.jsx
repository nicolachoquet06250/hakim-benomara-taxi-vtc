import styles from './index.module.css';
import DownButton from "../../components/DownButton/DownButton.jsx";
import OverlayedSection from '../../layouts/OverlayedSection/OverlayedSection.jsx';
import imageHome from '../../assets/image-home.jpg';
import logo from '../../assets/logo-hakim-benomara-v6-dark.svg';
import { useEffect, useState } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';

export default function Home() {
    const [styleLogoClass, setStyleLogoClass] = useState('horizontal');

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

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > window.innerHeight) {
                setStyleLogoClass('horizontal');
            } else if (window.innerWidth < window.innerHeight) {
                setStyleLogoClass('vertical');
            }
        };
        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [])

    return (<OverlayedSection>
        <img src={imageHome} alt="logo home" className={styles.backImg} />

        <BrowserView className={styles.completeLogoContainer}>
            <img src={logo} alt="logo complet" className={styles.desktopLogo} />
        </BrowserView>

        <MobileView className={styles.completeLogoContainer}>
            <img src={logo} alt="logo complet" className={styles[styleLogoClass + 'Logo'] + ' ' + styles.mobileLogo} />
        </MobileView>

        <div className={styles.downButtonContainer}>
            <DownButton onClick={onClick} />
        </div>
    </OverlayedSection>);
}