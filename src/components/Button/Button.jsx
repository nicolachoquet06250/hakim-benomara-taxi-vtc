import styles from './index.module.css';

export default function Button({ icon, title, customClasses, onClick = () => null, children }) {
    return (<button type="button" 
        title={title}
        className={customClasses + ' ' + styles.button}
        onClick={onClick}>
        {icon && (<i className={`fa-solid fa-${icon}`} />)}

        {children}
    </button>);
}