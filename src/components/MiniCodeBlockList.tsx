import { CodeBlock } from '../types'
import MiniCodeBlock from './MiniCodeBlock'

const MiniCodeBlockList = ({codeBlocks}: {codeBlocks: CodeBlock[]}) => {
  return (
    <section className="simple-cards-grid">
    {codeBlocks.map((codeblock: CodeBlock, idx: number) => (
      <MiniCodeBlock
        key={codeblock._id}
        codeBlock={codeblock}
        idx={idx}
      />
    ))}
  </section>  )
}

export default MiniCodeBlockList