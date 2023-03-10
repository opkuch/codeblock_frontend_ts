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
      <div className="mini-codeblock flex align-center justify-center gap-10">
        <span className="small-title text-center">case #{++idx}</span>
        <h1 className="title">{codeBlock.title}</h1>
      </div>
    </Link>
  )
}

export default MiniCodeBlock
