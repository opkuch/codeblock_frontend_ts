import { useEffect, useState, useRef, ReactHTMLElement } from 'react'
import { BASE_URL } from '../config'
import { useParams } from 'react-router-dom'
import {
  socketService,
  SOCKET_EMIT_SET_TOPIC,
  SOCKET_EMIT_UPDATE_BLOCK,
  SOCKET_EMIT_USER_CONNECTED,
  SOCKET_EVENT_BLOCK_UPDATED,
  SOCKET_EVENT_ROOM_UPDATED,
} from '../services/socket-service'
import { debounce } from '../services/util-service'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/theme-gruvbox'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/mode-javascript'
import axios from 'axios'
import { CodeBlock } from '../types'
import Navbar from '../components/Navbar'
import CompletedBlock from '../components/CompletedBlock'
import BackToLobby from '../components/BackToLobby'

const CodeBlockPage = () => {
  const { blockId } = useParams()
  // Store our user mode inside a ref
  const modeRef = useRef<boolean | undefined>()
  // State to store the updating codeblock
  const [codeBlock, setCodeBlock] = useState<CodeBlock>()
  const [isCompleted, setIsCompleted] = useState(false)
  // Wrapping editor onchange function with debouce to avoid exccesive API calls
  const delayedQuery = debounce(
    (val: string) => handleChange(val),
    1000
  )

  useEffect(() => {
    // Fetching current codeblock using id parameter from router and assign it to a useState variable
    async function fetchCodeBlock() {
      try {
        const { data } = await axios.get(`${BASE_URL}/blocks/${blockId}`)
        setCodeBlock(data)
        checkIfCompleted(data.code, data.solution)
      } catch (err) {
        console.log(err, 'Cannot get the codeblock from client')
      }
    }
    fetchCodeBlock()
  }, [])

  useEffect(() => {
    // Setting socket topic to current room
    socketService.emit(SOCKET_EMIT_SET_TOPIC, blockId)
    // Triggering an event on backend to count online user on current topic
    socketService.emit(SOCKET_EMIT_USER_CONNECTED, blockId)
    // Decide user mode based on current online users
    socketService.on(SOCKET_EVENT_ROOM_UPDATED, (onlineUsersCount: number) => {
      if (modeRef.current) return
      if (onlineUsersCount === 1) modeRef.current = true
      else modeRef.current = false
    })
    socketService.on(SOCKET_EVENT_BLOCK_UPDATED, updateBlockFromSocket)
    return () => {
      // Component unmounting
      // Unsubscribing events
      socketService.off(SOCKET_EVENT_ROOM_UPDATED)
      socketService.off(SOCKET_EVENT_BLOCK_UPDATED)
      // Clear socket room
      socketService.emit(SOCKET_EMIT_SET_TOPIC, '')
    }
  }, [codeBlock])

  function updateBlockFromSocket(block: CodeBlock) {
    // Storing the updated codeblock in our state
    setCodeBlock(block)
    // Check if updated code is identical to solution
    checkIfCompleted(block.code, block.solution)
  }

  function checkIfCompleted(updatedCode: string, solution: string) {
    // Removing whitespaces from code using regex and solution to be more precise when checking the equality of the 2 strings
    if (
      updatedCode.toLowerCase().replace(/\s/g, '') ===
      solution.toLowerCase().replace(/\s/g, '')
    )
      setIsCompleted(true)
    // If user is wrong, change the state to false
    else setIsCompleted(false)
  }

  const handleChange = async (val: string) => {
    // Read-only mode cannot edit text, but making extra sure they can't change our data
    if (modeRef.current) return
    // Breaking pointer
    const newCodeBlock = JSON.parse(JSON.stringify(codeBlock))
    // Attaching most recent code
    newCodeBlock.code = val
    // Sending the request for the backend to make the change with the updated codeblock via axios
    const response = await axios.put(`${BASE_URL}/blocks/${blockId}`, {
      block: newCodeBlock,
    })
    // Broadcasting to all other sockets with the updated codeblock after request is done
    socketService.emit(SOCKET_EMIT_UPDATE_BLOCK, response.data)
  }

  return (
    <>
      <Navbar />
      <div className="main-layout">
        <BackToLobby />
        <div className="editor-wrapper">
          <header className="flex space-around align-center gap-10 editor-header">
            <div className="flex column align-center">
              <h1 className="codeblock-title flex justify-center text-capitalize">
                {codeBlock?.title}
              </h1>
              <span>Mode: {modeRef.current ? 'Read Only' : 'Editable'}</span>
            </div>
            <CompletedBlock isCompleted={isCompleted}/>
          </header>
          <section className="codeblock-editor flex justify-center">
            <AceEditor
              placeholder="Write your case here.."
              mode="javascript"
              theme='gruvbox'
              fontSize={14}
              showPrintMargin={true}
              showGutter={true}
              highlightActiveLine={true}
              value={codeBlock?.code || ''}
              onChange={(val) => delayedQuery(val)}
              readOnly={modeRef.current}
              setOptions={{ useWorker: false }}
            />
          </section>
        </div>
        <div className="gradient-02" />
      </div>
    </>
  )
}

export default CodeBlockPage
