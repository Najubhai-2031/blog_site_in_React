import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import "./style.css";
import { db } from "../../firebase/config";

const Users = () => {
  const [userss, setUsers] = useState("");

  const getUsersByName = async (search) => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", search)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setUsers(doc.data());
    });
  };

  return (
    <React.Fragment>
      <Container>
        <Form className="d-flex">
          <Form.Control
            type="search"
            onChange={(e) => getUsersByName(e.target.value)}
            placeholder="Search"
            className="me-2"
            aria-label="Search"
          />
        </Form>
        <React.Fragment>
          {userss !== "" ? (
            <Container>
              <Card style={{ marginTop: "30px" }}>
                <Card.Body>
                  <div className="user-cards">
                    <div>
                      <Card.Title>{userss?.displayName}</Card.Title>
                      <Card.Text>{userss?.email}</Card.Text>
                    </div>
                    <div>
                      <Button variant="primary">Follow</Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Container>
          ) : null}
        </React.Fragment>
      </Container>
    </React.Fragment>
  );
};

export default Users;
