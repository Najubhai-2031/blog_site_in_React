import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc,
  runTransaction,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
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
  const [id, setId] = useState("");
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

  const handleGetDataforEdit = (id, Title, Description) => {
    setTitle(Title);
    setDesc(Description);
    setId(id);
    document.getElementById("update-btn").style.display = "block";
    document.getElementById("btn").style.display = "none";
  };

  const handleEditedAddData = async () => {
    const sfDocRef = doc(db, "Blog", id);
    document.getElementById("update-btn").style.display = "none";
    document.getElementById("btn").style.display = "block";
    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(sfDocRef);
        if (!sfDoc.exists()) {
          throw "Document does not exist!";
        }

        const newTitle = (sfDoc.data().Title = title);
        const newDescr = (sfDoc.data().Description = desc);
        transaction.update(sfDocRef, {
          Title: newTitle,
          Description: newDescr,
        });
      });
      setTitle("");
      setDesc("");
      getBlogs();
      toast.success("Blog Updated Successefully");
    } catch (e) {
      console.log("Transaction failed: ", e);
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
              <Button id="btn" variant="outline-primary" onClick={handleSubmit}>
                Add Blog
              </Button>
              <Button
                id="update-btn"
                variant="outline-primary"
                onClick={handleEditedAddData}
              >
                Update
              </Button>
            </div>
          </Form>
        </div>
      </div>
      {/* Map Method for data Showing */}
      <div className="cards">
        {data.map((item) => {
          return (
            <div className="cards-inner">
              <Card style={{ width: "18rem", textAlign: "center" }}>
                <Card.Body>
                  <Card.Title>{item.Title}</Card.Title>
                  <Card.Text>{item.Description}</Card.Text>
                  <Button
                    variant="primary me-2"
                    onClick={() => navigate(`Blog/${item.id}`)}
                  >
                    Blog Details
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() =>
                      handleGetDataforEdit(
                        item.id,
                        item.Title,
                        item.Description
                      )
                    }
                  >
                    Edit Blog
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
