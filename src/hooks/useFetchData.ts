import { useState, useEffect } from 'react'
import axios from 'axios'

const useFetchData = (dataUrl: string) => {
    const [data, setData] = useState<any>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    useEffect(() => {
        let isMounted = true;
        const source = axios.CancelToken.source()

        const fetchData = async (url: string) => {
            setIsLoading(true)
            try {
                const {data} = await axios.get(url, { cancelToken: source.token })
                if (isMounted) {
                    setData(data)
                    setIsError(false)
                }
            }catch(err) {
                if (isMounted) {
                    setIsError(true)
                    setData([])
                }
            } finally {
                isMounted && setTimeout(() => setIsLoading(false), 1000)
            }
        }
        fetchData(dataUrl)
        
        return () => {
            console.log('cleaning up')
            isMounted = false
            source.cancel()
        }
    }, [dataUrl])
    return {data, isError, isLoading}
}

export default useFetchData