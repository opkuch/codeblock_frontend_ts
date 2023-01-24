import useFetchData from '../hooks/useFetchData'
import { BASE_URL } from '../config'
import '../styles/global.scss'
import Loader from '../components/Loader'
import { CodeBlock } from '../types'
import MiniCodeBlock from '../components/MiniCodeBlock'

const LobbyPage = () => {
  // Using custom hook to fetch the list of codeblocks
  const { data, isLoading, isError } = useFetchData(BASE_URL + '/blocks')

  return (
    <div className="main-layout">
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <div className="error">
          Something is not working properly right now..
        </div>
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

export default LobbyPage
