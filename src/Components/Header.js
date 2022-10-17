import { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import { CgProfile } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import Navbar from "react-bootstrap/esm/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/user/action";

const Header = () => {
  const [name, setName] = useState("");
  const [uid, setUid] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setName(user.displayName);
        setUid(user?.uid);
      } else {
      }
    });
  }, []);

  return (
    <Navbar className="navbar">
      <Container>
        <Navbar.Brand className="logo">
          <Link to="/">Stack Summation</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="me-auto">
            <Nav.Link>
              {" "}
              <Link to="AboutUs">About Us</Link>
            </Nav.Link>
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
              <Dropdown.Item
                href="#"
                onClick={() => navigate(`/Profile/${uid}`)}
              >
                <CgProfile /> Profile
              </Dropdown.Item>
              <Dropdown.Item href="#" onClick={() => dispatch(logout())}>
                <FiLogOut /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
