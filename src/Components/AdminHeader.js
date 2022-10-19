import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { CgProfile } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../firebase/config";
import { logout } from "../store/user/UserAction";

const AdminHeader = () => {
  const [user, setUser] = useState("");
  const userUid = useSelector((state) => state?.user?.user.uid);

  const getCurrentUserInfo = async () => {
    const docRef = doc(db, "users", userUid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUser(docSnap.data());
    } else {
      setUser("User Not Found!");
    }
  };

  useEffect(() => {
    getCurrentUserInfo();
  }, []);

  const dispatch = useDispatch();
  return (
    <React.Fragment>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="">Stack Summation</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto"></Nav>
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
                  // onClick={() => navigate(`/Profile/${userUid}`)}
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

export default AdminHeader;
