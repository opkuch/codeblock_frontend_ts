import { useEffect, useState, useRef, useCallback } from 'react'
import { BASE_URL } from '../utils'
import { Link, useParams } from 'react-router-dom'
import {
  socketService,
  SOCKET_EMIT_SET_TOPIC,
  SOCKET_EMIT_UPDATE_BLOCK,
  SOCKET_EMIT_USER_CONNECTED,
  SOCKET_EVENT_BLOCK_UPDATED,
  SOCKET_EVENT_ROOM_UPDATED,
} from '../services/socket-service'
import { utilService } from '../services/util-service'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-java'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/mode-javascript'
import axios from 'axios'
import { CodeBlock } from '../types'
import smileyIcon from '../assets/smiley.svg'
import backArrowIcon from '../assets/arrow-back.svg'

const CodeBlockPage = () => {
  const { blockId } = useParams()
  const modeRef = useRef<boolean | undefined>()
  // State to store the updating codeblock
  const [codeBlock, setCodeBlock] = useState<CodeBlock>()
  const [isCompleted, setIsCompleted] = useState(false)

  // Wrapping editor onchange function with debouce to avoid exccesive API calls
  const delayedQuery = utilService.debounce(
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
    // Removing whitespaces from code and solution to be more precise when checking the equality of the 2 strings
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
    <div className='main-layout'>
      <Link to={'/'} className="back-to-lobby flex align-center">
        <img className="svg-medium" src={backArrowIcon} alt="back-arrow" />{' '}
        <span>Back to lobby</span>
      </Link>
      <div className='editor-wrapper'>
        <header className="flex space-around align-center gap-10 editor-header">
          <div className="flex column align-center">
            <h1 className="codeblock-title flex justify-center text-capitalize">
              {codeBlock?.title}
            </h1>
            <span>Mode: {modeRef.current ? 'Read Only' : 'Editable'}</span>
          </div>
          {isCompleted && (
            <div className="flex align-center justify-center gap-5 completed-codeblock">
              <img className="svg-medium" src={smileyIcon} alt="smiley-img" />{' '}
              <span className='text-uppercase'>you got it right!</span>
            </div>
          )}
        </header>
        <section className="codeblock-editor flex justify-center">
          <AceEditor
            placeholder="Write your case here.."
            mode="javascript"
            theme="github"
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
      <div className='gradient-02'/>
    </div>
  )
}

export default CodeBlockPage
