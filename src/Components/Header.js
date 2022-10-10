import { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Navbar from "react-bootstrap/esm/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { Button, Form } from "react-bootstrap";

const Header = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const logout = () => {
    signOut(auth)
      .then(() => {
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
    <Navbar>
      <Container>
        <Navbar.Brand href="#home">Stack Summation</Navbar.Brand>
        <Navbar.Toggle />
         <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        <Navbar.Collapse className="justify-content-end">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
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
