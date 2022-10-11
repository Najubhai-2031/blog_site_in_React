import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../../firebase/config";
import "./style.css";

const Home = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [uId, setUId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  const getBlogs = async () => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user !== null) {
        setUId(user.uid);
      } else {
      }
    });
    const querySnapshot = collection(db, "Blog");
    const data = await getDocs(query(querySnapshot, orderBy("timeStamp")));

    const blogsUser = data.docs.map((blog) => {
      return blog.data()?.uid;
    });

    Promise.all(blogsUser.map((userID) => getDoc(doc(db, "users", userID))))
      .then((response) => {
        const users = response?.map((user) => {
          return user.data();
        });
        const blogData = data.docs
          .map((blog) => {
            const findUser = users.find(
              (user) => blog?.data()?.uid === user.id
            );
            return { ...blog.data(), displayName: findUser.displayName };
          })
          .sort((a, b) => b.timeStamp - a.timeStamp);
        setIsLoading(true);
        setData(blogData);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (title === "" || desc === "") {
      alert("Please Fill The Details");
    } else {
      addDoc(collection(db, "Blog"), {
        Title: title,
        Description: desc,
        timeStamp: Date.now(),
        uid: uId,
      }).then((docResponse) => {
        const docRef = doc(db, "Blog", docResponse?.id);
        updateDoc(docRef, {
          id: docResponse?.id,
        })
          .then(() => {
            getBlogs();
          })
          .catch((err) => {
            toast.error(err);
          });
      });
      setTitle("");
      setDesc("");
      toast.success("Blog Added Successfully");
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  if (!isLoading) {
    return (
      <React.Fragment>
        <Container fluid>
          <ToastContainer />
          <div className="main">
            <Form>
              <div>
                <h3>Blog</h3>
              </div>
              <div>
                <Form.Group className="mb-3" controlId="formBasicTitle">
                  <Form.Control
                    type="text"
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                  />
                </Form.Group>
              </div>
              <div>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Control
                    placeholder="Description"
                    as="textarea"
                    onChange={(e) => setDesc(e.target.value)}
                    rows={3}
                    value={desc}
                  />
                </Form.Group>
              </div>
              <Form.Group
                className="d-grid gap-2"
                controlId="formBasicCheckbox"
              ></Form.Group>
              <div className="d-grid gap-2">
                <Button
                  id="btn"
                  variant="outline-primary"
                  onClick={handleSubmit}
                >
                  Add Blog
                </Button>
              </div>
            </Form>
          </div>
        </Container>
        <div className="text-center">Loading...</div>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <Container fluid>
          <ToastContainer />
          <div className="main">
            <Form>
              <div>
                <h3>Blog</h3>
              </div>
              <div>
                <Form.Group className="mb-3" controlId="formBasicTitle">
                  <Form.Control
                    type="text"
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                  />
                </Form.Group>
              </div>
              <div>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Control
                    placeholder="Description"
                    as="textarea"
                    onChange={(e) => setDesc(e.target.value)}
                    rows={3}
                    value={desc}
                  />
                </Form.Group>
              </div>
              <Form.Group
                className="d-grid gap-2"
                controlId="formBasicCheckbox"
              ></Form.Group>
              <div className="d-grid gap-2">
                <Button
                  id="btn"
                  variant="outline-primary"
                  onClick={handleSubmit}
                >
                  Add Blog
                </Button>
              </div>
            </Form>
          </div>
        </Container>
        {/* Map Method for data Showing */}
        <Container className="cards">
          {data.map((item) => {
            return (
              <div className="cards-inner">
                <Card style={{ width: "18rem", textAlign: "center" }}>
                  <Card.Body>
                    <Card.Text className="text">
                      By:
                      <b
                        className="text"
                        onClick={() => navigate(`AllProfiles/${item?.uid}`)}
                      >
                        {item.displayName}
                      </b>
                    </Card.Text>
                    <Card.Title>{item.Title}</Card.Title>
                    <Card.Text>{item.Description}</Card.Text>
                    <Button
                      variant="primary me-2"
                      onClick={() => navigate(`Blog/${item?.id}`)}
                    >
                      Blog Details
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            );
          })}
        </Container>
      </React.Fragment>
    );
  }
};

export default Home;
