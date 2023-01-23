import { Link } from 'react-router-dom'
import appLogo from '../assets/cube.svg'
const Navbar = () => {
  return (
    <nav className="gradient-1">
      <Link to="/" className="flex column align-center">
          <img src={appLogo} alt="logo" className="svg-medium" />
          <h1>Codeblocks</h1>
      </Link>
    </nav>
  )
}

export default Navbar
