import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useParams } from "react-router";
import { db } from "../firebase/config";

const AllProfiles = () => {
  const { uid } = useParams();
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')

  const getAllProfiles = async () => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        setName(docSnap.data().displayName)
        setEmail(docSnap.data().email);
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    getAllProfiles();
  }, []);

  return (
    <React.Fragment>
      <div className="profile text-center">
        <Card style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title>Name: {name}</Card.Title>
            <Card.Text>Your Email: {email}</Card.Text>
            <div className="text-center">
              <Button variant="primary">
                Go to Home Page
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default AllProfiles;
