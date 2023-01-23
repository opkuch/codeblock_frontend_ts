import { useEffect, useState, useRef, useCallback } from 'react'
import { BASE_URL, debounce } from '../utils'
import { useParams } from 'react-router-dom'
import {
  socketService,
  SOCKET_EMIT_SET_TOPIC,
  SOCKET_EMIT_UPDATE_BLOCK,
  SOCKET_EVENT_BLOCK_UPDATED
} from '../services/socket-service'
import { utilService } from '../services/util-service'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-java'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/mode-javascript'
import axios from 'axios'
import { CodeBlock } from '../types'

const CodeBlockPage = () => {
  const { blockId } = useParams()
  const mentorRef = useRef<any>()
  const [codeBlock, setCodeBlock] = useState<CodeBlock>()
  const [editedCode, setEditedCode] = useState<any>('')
  const delayedQuery = utilService.debounce((val: string) => handleChange(val), 1000)
  useEffect(() => {
    async function fetchCodeBlock() {
      const {data} = await axios.get(`${BASE_URL}/blocks/${blockId}`)
      setCodeBlock(data)
      setEditedCode(data.code)
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
  }
  const handleChange = async (val: string) => {
    if (mentorRef.current) return
    const newCodeBlock = JSON.parse(JSON.stringify(codeBlock))
    newCodeBlock.code = val
    const response = await axios.put(`${BASE_URL}/blocks/${blockId}`, {
      block: newCodeBlock,
    })
    console.log(response.data)
    socketService.emit(SOCKET_EMIT_UPDATE_BLOCK, response.data)
    setEditedCode(val)
  }
  return (
    <>
      <h1>{codeBlock?.title}</h1>
      <div className="codeblock-page flex justify-center">
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
