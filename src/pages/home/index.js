import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FaPenNib } from "react-icons/fa";
import { ArrowRight } from "react-bootstrap-icons";
import { AiOutlineEye } from "react-icons/ai";
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
import React, { useEffect, useRef, useState } from "react";
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
  const getValue = useRef();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [uId, setUId] = useState("");
  const [view, setView] = useState(0);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");
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
        setErr("No Data Found!!!");
      });
  };

  const viewsCounter = (id) => {
    var visitCount = localStorage.getItem(`page_view${id}`);
    if (visitCount) {
      visitCount = Number(visitCount) + 1;
      localStorage.setItem(`page_view${id}`, visitCount);
    } else {
      visitCount = 1;
      localStorage.setItem(`page_view${id}`, 1);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (title === "" || desc === "") {
      alert("Please Fill The Details");
    } else {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setName(user?.displayName);
        } else {
        }
      });
      setTimeout(() => {
        addDoc(collection(db, "Blog"), {
          Title: title,
          Description: desc,
          timeStamp: Date.now(),
          uid: uId,
          writenBy: name,
        }).then((docResponse) => {
          const docRef = doc(db, "Blog", docResponse?.id);
          updateDoc(docRef, {
            id: docResponse?.id,
            views: view,
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
      }, 500);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  if (!isLoading) {
    return (
      <React.Fragment>
        <div className="main">
          <Container fluid>
            <ToastContainer />
            <Form>
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
          </Container>
        </div>
        <div className="text-center">Loading...</div>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <div className="div-body">
          <div className="main">
            <ToastContainer />
            <Form>
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
          {/* Map Method for data Showing */}
          <Container className="cards">
            {data.map((item) => {
              var date = new Date(item.timeStamp);
              return (
                <div className="cards-inner">
                  <Card>
                    <Card.Body>
                      <div className="content-div title-div">
                        <Card.Title>{item.Title}</Card.Title>
                      </div>
                      <div className="content-div profile-div">
                        <Card.Text className="text">
                          <FaPenNib />
                          <b
                            onClick={() => navigate(`AllProfiles/${item?.uid}`)}
                          >
                            {item.displayName}
                          </b>
                        </Card.Text>
                      </div>
                      <div className="content-div description-div">
                        <Card.Text
                          ref={getValue}
                          value={desc}
                          id="sort-description"
                        >
                          {`${item.Description.slice(0, 50)}...`}
                        </Card.Text>
                      </div>
                      <div className="content-div">
                        <AiOutlineEye />
                        &nbsp;
                        {item?.views}
                      </div>
                      <div className="content-div readmore-div">
                        <div className="last-text">
                          <Card.Text>{date.toLocaleString()}</Card.Text>
                        </div>
                        <div className="last-text">
                          <Card.Text
                            className="read-more text-right"
                            onClick={() => {
                              viewsCounter(item?.id);
                              setTimeout(() => {
                                navigate(`Blog/${item?.id}`);
                              }, 1000);
                            }}
                          >
                            Continue Reading <ArrowRight />
                          </Card.Text>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              );
            })}
          </Container>
        </div>
      </React.Fragment>
    );
  }
};

export default Home;
