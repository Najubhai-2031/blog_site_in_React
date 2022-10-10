import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router";
import "./style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";

const Login = (props) => {
  const [error, setError] = useState({});
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    let isValid = loginValidation();
    if (isValid) {
      signInWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user)
        toast.success("Login Successfull");
        // ...
      })
      .catch((error) => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
      });
    }
  };

  const loginValidation = () => {
    let isValid = true;
    const errors = {};
    // let localEmail = localStorage.getItem("email");
    // let localPass = localStorage.getItem("pass");

    // Email Validation
    if (!email) {
      errors.email = "Please Enter Email";
      isValid = false;
    }
    //  else if (email !== localEmail) {
    //   errors.email = "Email not Register, Please Register First";
    //   isValid = false;
    // }

    // Password Validation
    if (!pass) {
      errors.pass = "Please Enter Password";
      isValid = false;
    }
    //  else if (pass !== localPass) {
    //   errors.pass = "Invalid Password";
    //   isValid = false;
    // }
    setError(errors);
    return isValid;
  };

  return (
    <React.Fragment>
      <div className="main-div">
      <ToastContainer />
        <Form onSubmit={handleSubmit}>
          <div>
            <h3>Sign in</h3>
          </div>
          <div>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email *"
              />
              <Form.Text className="error-message">{error.email}</Form.Text>
            </Form.Group>
          </div>
          <div>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                type="password"
                onChange={(e) => setPass(e.target.value)}
                placeholder="Password *"
              />
              <Form.Text className="error-message">{error.pass}</Form.Text>
            </Form.Group>
          </div>
          <Form.Group
            className="d-grid gap-2"
            controlId="formBasicCheckbox"
          ></Form.Group>
          <div className="d-grid gap-2">
            <Button variant="outline-primary" type="submit">
              Sign in
            </Button>
          </div>
          <div className="forSignup">
            <p onClick={() => navigate("/auth/forgotepassword")}>
              Forgot password?
            </p>
            <p onClick={() => navigate("/auth/register")}>
              Don't have an account? Sign Up
            </p>
          </div>
        </Form>
      </div>
    </React.Fragment>
  );
};

export default Login;
