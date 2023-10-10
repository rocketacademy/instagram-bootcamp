import { Link} from 'react-router-dom'

const Navbar = (props) =>{
    return (
        <div>
            {props.isLoggedIn ? <button onClick={props.logout}>signout</button> : <Link to='auth'>Signup/Login</Link>}
            <Link to='feed'>Feed</Link>
            {props.isLoggedIn ? <Link to='composer'>Composer</Link> : null}
        </div>
    )
}

export default Navbar;