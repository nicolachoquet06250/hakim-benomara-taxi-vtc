export default function Section({ name = '', children, customClasses = '' }) {
    return (<section className={`${name} ${customClasses}`}>
        {children}
    </section>);
}