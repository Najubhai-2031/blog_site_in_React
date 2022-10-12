import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AiOutlineEye } from "react-icons/ai";
import { FaPenNib } from "react-icons/fa";
import {
  deleteDoc,
  doc,
  getDoc,
  runTransaction,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast, ToastContainer } from "react-toastify";
import { Card, Container } from "react-bootstrap";
import "./style.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [uid, setUid] = useState("");
  const [desc, setDesc] = useState("");
  const [data, setData] = useState([]);

  const getBlogDetail = async () => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user?.uid);
      } else {
      }
    });
    const docRef = doc(db, "Blog", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const currentView = docSnap.data()?.views;
      setData(docSnap.data());
      const docRef = doc(db, "Blog", docSnap.data().id);
      updateDoc(docRef, {
        id: docSnap.data()?.id,
        views: currentView + 1,
      })
        .then((res) => {})
        .catch((err) => {});
    } else {
      console.log("No such document!");
    }
  };

  const handleGetDataforEdit = (Title, Description) => {
    setTitle(Title);
    setDesc(Description);
    document.getElementById("frm").style.display = "block";
  };

  const handleEditedAddData = async (event) => {
    event.preventDefault();
    const sfDocRef = doc(db, "Blog", id);
    document.getElementById("frm").style.display = "none";
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
      toast.success("Blog Updated Successefully");
      setTitle("");
      setDesc("");
      getBlogDetail();
    } catch (e) {
      toast.error("Transaction failed: ", e);
    }
  };

  const handleUpdateDataCancle = (event) => {
    event.preventDefault();
    document.getElementById("frm").style.display = "none";
    getBlogDetail();
  };

  const handleDeleteBlog = async (Id) => {
    let confirmationDelete = window.confirm("Are You Sure?");
    if (confirmationDelete === true) {
      toast.success("Blog Deleted Successefully");
      await deleteDoc(doc(db, "Blog", Id));
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  };

  useEffect(() => {
    getBlogDetail();
  }, [id]);

  return (
    <React.Fragment>
      <ToastContainer />
      <div id="frm">
        <div className="main">
          <Form>
            <Form.Group className="mb-3" controlId="formBasicTitle">
              <Form.Control
                type="text"
                placeholder="Title *"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicDescription">
              <Form.Control
                type="text"
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Description *"
                as="textarea"
              />
            </Form.Group>
            <div className="gap-2 text-center">
              <Button
                variant="primary"
                type="button"
                onClick={handleEditedAddData}
                className="update-btn me-2"
              >
                Update
              </Button>
              <Button
                variant="primary"
                type="button"
                onClick={handleUpdateDataCancle}
                className="update-btn"
              >
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </div>
      <div className="cards">
        <div className="cards-inner">
          <Container>
            <Card>
              {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
              <Card.Body>
                <Card.Text>
                  <AiOutlineEye /> &nbsp;
                  {data.views}
                </Card.Text>
                <Card.Text
                  className="text"
                  onClick={() => navigate(`/AllProfiles/${data?.uid}`)}
                >
                  <FaPenNib />
                  &nbsp;
                  <b>{data.writenBy}</b>
                </Card.Text>
                <Card.Title>{data.Title}</Card.Title>
                <Card.Text>{data.Description}</Card.Text>
                {uid === data.uid ? (
                  <div className="text-center">
                    <Button
                      id="delete-btn"
                      variant="primary me-2"
                      onClick={() => handleDeleteBlog(data.id)}
                    >
                      Delete Blog
                    </Button>
                    <Button
                      id="edit-btn"
                      variant="primary"
                      onClick={() =>
                        handleGetDataforEdit(data.Title, data.Description)
                      }
                    >
                      Edit Blog
                    </Button>
                  </div>
                ) : null}
              </Card.Body>
            </Card>
          </Container>
        </div>
      </div>
    </React.Fragment>
  );
};

export default BlogDetails;
