import backArrowIcon from '../assets/arrow-back.svg'
import { Link } from 'react-router-dom'

const BackToLobby = () => {
  return (
    <Link to={'/'} className="back-to-lobby flex align-center">
    <img className="svg-medium" src={backArrowIcon} alt="back-arrow" />{' '}
    <span>Back to lobby</span>
  </Link>
)
}

export default BackToLobby