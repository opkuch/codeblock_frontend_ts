import React from 'react'
import { CodeBlock } from '../types'
import { Link } from 'react-router-dom'
const MiniCodeBlock = ({
  codeBlock,
  idx,
}: {
  codeBlock: CodeBlock
  idx: number
}) => {
  return (
    <Link to={`/${codeBlock._id}`}>
      <div className="mini-codeblock flex column align-center">
        <span className="small-title">case #{++idx}</span>
        <h1 className="title">{codeBlock.title}</h1>
      </div>
    </Link>
  )
}

export default MiniCodeBlock
