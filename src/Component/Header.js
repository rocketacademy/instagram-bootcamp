import { useContext } from "react";
import AuthContext from "./AuthContext";
import Button from "react-bootstrap/Button";

const Header = () => {
  const { user, handleSignOut } = useContext(AuthContext);

  return (
    <header>
      {/* ... other header content */}
      {user && (
        <Button variant="danger" onClick={handleSignOut}>
          Log Out
        </Button>
      )}
    </header>
  );
};

export default Header;
