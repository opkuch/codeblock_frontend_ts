import { useEffect, useState } from 'react'
import useFetchData from '../hooks/useFetchData'
import {BASE_URL} from '../utils'
import MiniCodeBlock from '../components/MiniCodeBlock'
import { CodeBlock } from '../types'
import '../styles/global.scss'
import Navbar from '../components/Navbar'

function AppLobby() {
  const { data, isLoading, isError } = useFetchData(BASE_URL + '/blocks')
  if (isError) return <div>Error</div>

  return (
    <>
      <Navbar />
      <div className="main-layout">
        {isLoading ? (
          <p>Loading</p>
        ) : (
          <main className='simple-cards-grid'>
            {data.map((codeblock: CodeBlock, idx: number) => (
              <MiniCodeBlock key={codeblock._id} codeBlock={codeblock} idx={idx}/>
            ))}
          </main>
        )}
      </div>
    </>
  )
}

export default AppLobby
