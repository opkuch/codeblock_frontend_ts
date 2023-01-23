import { useEffect, useState, useRef, useCallback } from 'react'
import { BASE_URL } from '../utils'
import { Link, useParams } from 'react-router-dom'
import {
  socketService,
  SOCKET_EMIT_SET_TOPIC,
  SOCKET_EMIT_UPDATE_BLOCK,
  SOCKET_EVENT_BLOCK_UPDATED,
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
  const mentorRef = useRef<any>()
  const [codeBlock, setCodeBlock] = useState<CodeBlock>()
  const [editedCode, setEditedCode] = useState<any>('')
  const [isCompleted, setIsCompleted] = useState(false)
  const delayedQuery = utilService.debounce(
    (val: string) => handleChange(val),
    1000
  )

  useEffect(() => {
    async function fetchCodeBlock() {
      const { data } = await axios.get(`${BASE_URL}/blocks/${blockId}`)
      setCodeBlock(data)
      setEditedCode(data.code)
      checkIfCompleted(data.code, data.solution)
    }
    fetchCodeBlock()
  }, [])

  useEffect(() => {
    socketService.emit(SOCKET_EMIT_SET_TOPIC, blockId)
    socketService.emit('user-connected', blockId)
    socketService.on('update-room-counter', (count: number) => {
      if (mentorRef.current) return
      if (count === 1) mentorRef.current = true
      else mentorRef.current = false
    })
    socketService.on(SOCKET_EVENT_BLOCK_UPDATED, updateBlockFromSocket)
    return () => {
      socketService.off('update-room-counter')
      socketService.off(SOCKET_EVENT_BLOCK_UPDATED)
      socketService.emit(SOCKET_EMIT_SET_TOPIC, '')
    }
  }, [codeBlock])

  function updateBlockFromSocket(block: CodeBlock) {
    setCodeBlock(block)
    setEditedCode(block.code)
    checkIfCompleted(block.code, block.solution)
  }

  function checkIfCompleted(updatedCode: string, solution: string) {
    console.log(
      updatedCode.toLowerCase().replace(/\s/g, ''))
    
    // Removing whitespaces and semicolons from code and solution to be more precise and checking the equality of the 2 strings
    if (
      updatedCode.toLowerCase().replace(/\s/g, '') ===
      solution.toLowerCase().replace(/\s/g, '')
    )
      setIsCompleted(true)
    // If still wrong, change the state to false
    else setIsCompleted(false)
  }

  const handleChange = async (val: string) => {
    if (mentorRef.current) return
    const newCodeBlock = JSON.parse(JSON.stringify(codeBlock))
    newCodeBlock.code = val
    const response = await axios.put(`${BASE_URL}/blocks/${blockId}`, {
      block: newCodeBlock,
    })
    socketService.emit(SOCKET_EMIT_UPDATE_BLOCK, response.data)
    setEditedCode(val)
  }
  return (
    <>
      <Link to={'/'} className="back-to-lobby flex align-center">
        <img className="svg-medium" src={backArrowIcon} alt="back-arrow" />{' '}
        <span>Back to lobby</span>
      </Link>
      <header className="flex justify-center align-center gap-10 editor-header">
        <div className='flex column align-center gap-5'>
          <h1 className="codeblock-title flex justify-center">
            {codeBlock?.title}
          </h1>
          <span>Mode: {mentorRef.current ? 'Read Only' : 'Editable'}</span>
        </div>
        {isCompleted && (
          <div className="flex align-center justify-center gap-5 completed-codeblock">
            <img className="svg-medium" src={smileyIcon} alt="smiley-img" />{' '}
            <span>YOU GOT IT RIGHT!</span>
          </div>
        )}
      </header>
      <div className="codeblock-editor flex justify-center">
        <AceEditor
          placeholder="Write your case here.."
          mode="javascript"
          theme="github"
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={editedCode}
          onChange={(val) => delayedQuery(val)}
          readOnly={mentorRef.current}
          setOptions={{ useWorker: false }}
        />
      </div>
    </>
  )
}

export default CodeBlockPage
