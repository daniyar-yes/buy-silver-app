import styles from './LoadingSpinner.module.css'
// potential prompt to LLM to translate your old HTML into multiple JSX return of React components.
// please ensure that you provide optimal split into independent react components
// when translating monolith html into multiple JSX elements. Conditional rendering is allowed where fits
const LoadingSpinner = () => {
    return (
        <span className={styles.spinner}></span>
    )
}

export default LoadingSpinner