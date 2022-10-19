import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import { CgProfile } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import Navbar from "react-bootstrap/esm/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router";
import { Button, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/user/UserAction";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const Header = () => {
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userId = useSelector((state) => state?.user?.user?.uid);

  const getCurrentUserInfo = async () => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUser(docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      setUser({ displayName: "No such document!" });
    }
  };

  useEffect(() => {
    getCurrentUserInfo();
  }, []);

  return (
    <React.Fragment>
      <Navbar className="navbar">
        <Container>
          <Navbar.Brand className="logo">
            <Link to="/">Stack Summation</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav className="me-auto">
              <Nav.Link>
                <Link to="AboutUs">About Us</Link>
              </Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>

              <Button
                variant="outline-success"
                onClick={() => navigate("/Users")}
              >
                Find Users
              </Button>
            </Nav>
            <Dropdown className="drop-menu">
              <Dropdown.Toggle
                className="name"
                variant="success"
                id="dropdown-basic"
              >
                Hi, {user?.displayName}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  href="#"
                  onClick={() => navigate(`/Profile/${userId}`)}
                >
                  <CgProfile /> My Profile
                </Dropdown.Item>
                <Dropdown.Item href="#" onClick={() => dispatch(logout())}>
                  <FiLogOut /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </React.Fragment>
  );
};

export default Header;
