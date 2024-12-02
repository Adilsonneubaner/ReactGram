import './Navbar.css'

// Router
import { NavLink, Link } from 'react-router-dom'

// React Icons
import {BsSearch, BsHouseDoorFill, BsFillPersonFill, BsFillCameraFill} from 'react-icons/bs'

// Hooks
import { useState } from 'react'
import { useAuth } from '../../hooks/userAuth'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// Redux
import { logout, reset } from '../../slices/authSlice'


const Navbar = () => {
    const [query, setQuery] = useState('')

    const {auth} = useAuth()
    const {user} = useSelector((state) => state.auth)

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logout())
        dispatch(reset())

        navigate('/login')
    }

    const handleSearch = (e) => {
        e.preventDefault()

        if(query){
            return navigate(`/search?q=${query}`)
        }
    }

  return (
    <nav id='nav'>
        <Link to='/' id='reactgram'>ReactGram</Link>
        <form id='search-form' onSubmit={handleSearch}>
            <BsSearch id='search'/>
            <input type="text" placeholder='Pesquisar' onChange={(e) => setQuery(e.target.value)}/>
        </form>
        <ul id="nav-links">
              {auth ? (
                <>
                    <li>
                        <NavLink to='/'>
                            <BsHouseDoorFill/>
                        </NavLink>
                    </li>

                    {user && (
                        <li>
                            <NavLink to={`/users/${user._id}`}>
                                <BsFillCameraFill/>
                            </NavLink>
                        </li>
                    )}

                    <li>
                        <NavLink to='/profile'>
                            <BsFillPersonFill/>
                        </NavLink>
                    </li>

                    <li>
                        <span onClick={handleLogout}>Sair</span>
                    </li>
                </>
            ) : (
                <>
                    <li>
                        <NavLink to='/login'>
                            Entrar
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/register'>
                            Cadastrar
                        </NavLink>
                    </li>
                </>
            )}
           
        </ul>
    </nav>
  )
}

export default Navbar