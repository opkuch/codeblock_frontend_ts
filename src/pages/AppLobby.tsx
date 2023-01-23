import useFetchData from '../hooks/useFetchData'
import { BASE_URL } from '../utils'
import MiniCodeBlock from '../components/MiniCodeBlock'
import { CodeBlock } from '../types'
import '../styles/global.scss'
import Loader from '../components/Loader'

function AppLobby() {
  // Using custom hook to fetch the list of codeblocks
  const { data, isLoading, isError } = useFetchData(BASE_URL + '/blocks')
  if (isError) return <div>Error</div>

  return (
      <div className="main-layout">
        {isLoading ? (
          <Loader />
        ) : (
          <section className="simple-cards-grid">
            {data.map((codeblock: CodeBlock, idx: number) => (
              <MiniCodeBlock
                key={codeblock._id}
                codeBlock={codeblock}
                idx={idx}
              />
            ))}
          </section>
        )}
      </div>
  )
}

export default AppLobby
