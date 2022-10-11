import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router";
import "./style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { addDoc, collection } from "firebase/firestore";

const Register = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [cpass, setCpass] = useState("");
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    let isValid = formValidation();

    if (isValid) {
      createUserWithEmailAndPassword(auth, email, pass, { displayName: "sldj" })
        .then((response) => {
          updateProfile(auth.currentUser, {
            displayName: name,
          })
            .then(() => {
              // Profile updated!
              // ...
            })
            .catch((error) => {
              // An error occurred
              // ...
            });
          addDoc(collection(db, "users"), {
            name: name,
            email: email,
            displayName: name,
          }).then((docResponse) => {
            console.log("docResponse", docResponse);
            toast.success("Registration Successfull");
          });
        })
        .catch((error) => {
          toast.error(error)
        });
    }
  };

  const formValidation = () => {
    let isValid = true;
    const errors = {};
    let enteredPass = pass;
    let enteredCpass = cpass;
    // let localEmail = localStorage.getItem("email");
    var dotposition = email.lastIndexOf(".");

    // Name Validation
    if (!name) {
      errors.name = "Enter Name";
      isValid = false;
    } else if (name.length < 3) {
      errors.name = "Name Should Contain Minimum 3 Characters";
      isValid = false;
    }

    // Email Validation
    if (dotposition + 2 >= email.length) {
      errors.email = "There Must be at least Two characters after . (dot)";
      isValid = false;
    }

    // Password Validation
    if (!pass) {
      errors.pass = "Pleae Enter Password";
      isValid = false;
    }

    // Confirm Password Validation
    if (!cpass) {
      errors.cpass = "Please Re-Enter Password";
      isValid = false;
    } else if (enteredCpass !== enteredPass) {
      errors.cpass = "Confirm Password Did not Match";
      isValid = false;
    }
    setError(errors);
    return isValid;
  };

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="main-div">
        <Form onSubmit={handleSubmit}>
          <div>
            <h3>Sign up</h3>
          </div>
          <div>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Name *"
              />
              <Form.Text className="error-message">{error.name}</Form.Text>
            </Form.Group>
          </div>
          <div>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email *"
              />
              <Form.Text className="error-message">{error.email}</Form.Text>
            </Form.Group>
          </div>
          <div>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Enter Password *"
              />
              <Form.Text className="error-message">{error.pass}</Form.Text>
            </Form.Group>
          </div>
          <div>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                type="password"
                value={cpass}
                onChange={(e) => setCpass(e.target.value)}
                placeholder="Re-Enter Password *"
              />
              <Form.Text className="error-message">{error.cpass}</Form.Text>
            </Form.Group>
          </div>
          <Form.Group
            className="mb-3"
            controlId="formBasicCheckbox"
          ></Form.Group>
          <div className="d-grid gap-2">
            <Button variant="outline-primary" type="submit">
              Sign up
            </Button>
          </div>
          <div className="forSignin">
            <p onClick={() => navigate("/auth/login")}>
              Already have an Account? Sign in
            </p>
          </div>
        </Form>
      </div>
    </React.Fragment>
  );
};

export default Register;
