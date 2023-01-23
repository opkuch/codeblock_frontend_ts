import smileyIcon from '../assets/smiley.svg'

const CompletedBlock = ({isCompleted}: {isCompleted: boolean}) => {
  return (
    <>
      {isCompleted && (
        <div className="flex align-center justify-center gap-5 completed-codeblock">
          <img className="svg-medium" src={smileyIcon} alt="smiley-img" />{' '}
          <span className="text-uppercase">you got it right!</span>
        </div>
      )}
    </>
  )
}

export default CompletedBlock
