import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

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
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  const getBlogs = async () => {
    const querySnapshot = collection(db, "Blog");
    const data = await getDocs(query(querySnapshot, orderBy("timeStamp")));
    setData([]);
    const newData = data.docs.map((doc) => ({
      ...doc.data(),
    }));
    const sorted = newData?.sort((a, b) => b.timeStamp - a.timeStamp);
    setData(sorted);
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
      }).then((docResponse) => {
        const docRef = doc(db, "Blog", docResponse?.id);
        updateDoc(docRef, {
          id: docResponse?.id,
        })
          .then((response) => {
            getBlogs();
          })
          .catch((err) => {
            console.log("err", err);
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

  return (
    <React.Fragment>
      <div>
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
              <Button variant="outline-primary" onClick={handleSubmit}>
                Add Blog
              </Button>
            </div>
          </Form>
        </div>
      </div>
      {/* Map Method for data Showing */}
      <div className="cards">
        {data.map((item) => {
          // console.log("item", item)
          return (
            <div className="cards-inner">
              <Card style={{ width: "18rem", textAlign: "center" }}>
                <Card.Body>
                  <Card.Title>{item.Title}</Card.Title>
                  <Card.Text>{item.Description}</Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => navigate(`Blog/${item?.id}`)}
                  >
                    Go somewhere
                  </Button>
                </Card.Body>
              </Card>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};

export default Home;
