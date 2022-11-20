import styles from './index.module.css';

const Loader = ({color = null}) => (<div className={styles.spiner} style={{'--color': color ?? false}} />);

export default Loader;