import useFetchData from '../hooks/useFetchData'
import { BASE_URL } from '../config'
import MiniCodeBlock from '../components/MiniCodeBlock'
import { CodeBlock } from '../types'
import '../styles/global.scss'
import Loader from '../components/Loader'
import Navbar from '../components/Navbar'
import MiniCodeBlockList from '../components/MiniCodeBlockList'

function AppLobby() {
  // Using custom hook to fetch the list of codeblocks
  const { data, isLoading, isError } = useFetchData(BASE_URL + '/blocks')

  // Show a message for client if cannot fetch codeblocks
  if (isError)
    return (
      <div className="error">Something is not working properly right now..</div>
    )

  return (
    <>
      <Navbar />
      <div className="main-layout">
        {isLoading ? <Loader /> : <MiniCodeBlockList codeBlocks={data} />}
      </div>
    </>
  )
}

export default AppLobby
