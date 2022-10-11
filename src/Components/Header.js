import { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Navbar from "react-bootstrap/esm/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { Button, Form, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const Header = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const logout = () => {
    signOut(auth)
      .then(() => {
        localStorage.clear();
        navigate("/auth/login");
      })
      .catch((error) => {});
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setName(user.displayName);
      } else {
      }
    });
  }, []);

  return (
    <Navbar className="navbar">
      <Container>
        <Navbar.Brand className="logo"><Link to="/">Stack Summation</Link></Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="me-auto">
            <Nav.Link> <Link to="AboutUs">About Us</Link></Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
          </Nav>
          <Dropdown className="drop-menu">
            <Dropdown.Toggle
              className="name"
              variant="success"
              id="dropdown-basic"
            >
              Hi, {name}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#" onClick={() => navigate("/Profile")}>
                Profile
              </Dropdown.Item>
              <Dropdown.Item href="#" onClick={logout}>
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
