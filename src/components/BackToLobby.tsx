import backArrowIcon from '../assets/arrow-back.svg'
import { Link } from 'react-router-dom'

const BackToLobby = () => {
  return (
    <div className='pos-absolute'>
      <Link to={'/'} className="back-to-lobby flex align-center">
        <img className="svg-small" src={backArrowIcon} alt="back-arrow" />{' '}
        <span>Back to lobby</span>
      </Link>
    </div>
  )
}

export default BackToLobby
