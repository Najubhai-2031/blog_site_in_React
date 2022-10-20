import React from "react";
import { Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { CgProfile } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/user/UserAction";
import AdminSidebar from "./AdminSidebar";

const AdminHeader = () => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();

  return (
    <React.Fragment>
      
      <Navbar bg="light" expand="lg" className="navbar-width">
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
                  // onClick={() => navigate(`/Profile/${user?.uid}`)}
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
