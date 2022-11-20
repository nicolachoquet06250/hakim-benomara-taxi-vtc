export default function Button ({ icon, title, customClasses, style = {}, onClick = () => null, children }) {
    return (<button type="button" 
        title={title}
        className={customClasses}
        style={style}
        onClick={e => {
            e.preventDefault();
            onClick(e)
        }}>
    <i className={`fa-solid fa-${icon}`} v-if="icon"></i>

    {children}
</button>)
};