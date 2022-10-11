import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router";
import "./style.css";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setName(user.displayName);
        setEmail(user.email);
      } else {
      }
    });
  }, [auth]);

  return (
    <React.Fragment>
      <div className="profile text-center">
        <Card style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title>Name: {name}</Card.Title>
            <Card.Text>Your Email: {email}</Card.Text>
            <div className="text-center">
              <Button variant="primary" onClick={() => navigate("/")}>
                Go to Home Page
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default Profile;
