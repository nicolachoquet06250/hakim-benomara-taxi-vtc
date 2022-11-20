import Button from '../Button/Button';
import styles from './index.module.css';

export default function DownButton({ onClick = () => null }) {
    return (<Button icon='chevron-down' 
                    title='descendre à la page suivante' 
                    customClasses={styles.button} 
                    onClick={onClick} />);
}