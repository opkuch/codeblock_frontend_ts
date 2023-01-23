const BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3030/api'
function debounce(func: Function, wait = 500) {
    let timeout: any

    return function executedFunction(...args: any[]) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }

        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}
export { BASE_URL, debounce }