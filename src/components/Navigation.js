import { Navbar, Nav, Container } from 'react-bootstrap';

const Navigation = (props) =>{

    // Access props values
    const {loggedInUser,signOut} = props;
    
    return (
        <Navbar collapseOnSelect fixed = 'top' expand='sm' bg='dark' variant='dark'>
            <Container>
                <Navbar.Toggle aria-controls='responsive-navbar-nav'/>
                <Navbar.Collapse id='responsive-navbar-nav'>
                    <Nav>
                        <Nav.Link href='/'>Home</Nav.Link>
                        {loggedInUser ? <Nav.Link href="/" onClick={signOut} >Sign Out</Nav.Link> : <Nav.Link href="/project/AuthForm">Login</Nav.Link>}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

    );
}

export default Navigation;
