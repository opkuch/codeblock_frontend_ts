const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:3030/api' : '/api'

export { BASE_URL }