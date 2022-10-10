import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    let isValid = forgotPassValidation();
    if (isValid) {
      setPass(localStorage.getItem("pass"));
    }
  };

  const forgotPassValidation = () => {
    let isValid = true;
    const errors = {};
    let localEmail = localStorage.getItem("email");

    if (!email) {
      errors.email = "Pleas Enter Email";
      isValid = false;
    } else if (email !== localEmail) {
      errors.email = "Invalid Email";
      isValid = false;
    }

    setError(errors);
    return isValid;
  };
  return (
    <React.Fragment>
      <div className="main-div">
        <Form onSubmit={handleSubmit}>
          <div>
            <h3>Forgot Password</h3>
          </div>
          <div>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email *"
              />
            </Form.Group>
          </div>
          <Form.Group
            className="d-grid gap-2"
            controlId="formBasicCheckbox"
          ></Form.Group>
          <div className="d-grid gap-2">
            <Button variant="outline-primary" type="submit">
              Forgote Password
            </Button>
            <Button
              variant="outline-primary"
              type="submit"
              onClick={() => navigate("/")}
            >
              Go to Home Page
            </Button>
          </div>
          Your Password is: {pass}
          <Form.Text className="error-message">{error.email}</Form.Text>
        </Form>
      </div>
    </React.Fragment>
  );
};

export default ForgotPass;
