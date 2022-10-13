import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FiEdit } from "react-icons/fi";
import { AiOutlineEye, AiFillDelete, AiFillLike } from "react-icons/ai";
import { FaPenNib } from "react-icons/fa";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  documentId,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  updateDoc,
  where,
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
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [isLading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [comments, setCommments] = useState([]);

  const getBlogDetail = async () => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user?.uid);
        setName(user?.displayName);
      } else {
      }
    });

    const querySnapshot = collection(db, "Blog");
    const data = await getDocs(
      query(querySnapshot, orderBy("timeStamp"), where("id", "==", id))
    );

    const blogsUser = data.docs.map((blog) => {
      return blog.data()?.uid;
    });

    const users = await getDocs(
      query(collection(db, "users"), where(documentId(), "in", blogsUser))
    );

    const blogUsers = users.docs.map((user) => user.data());
    const blogComments = data.docs.map((comment) => comment.data());

    const commentsData = data.docs.map((blog) => {
      const findUser = blogUsers.find((user) => user?.uId === user.uid);
      const findComment = blogComments.filter(
        (comment) => comment.blogId === blog.data().id
      );
      return { ...findUser, ...findComment, ...blog.data() };
    });
    setIsLoading(true);
    setData(commentsData);
  };

  const getComments = async () => {
    const querySnapshot = collection(db, "Comments");
    const data = await getDocs(
      query(querySnapshot, orderBy("timeStamp"), where("blogId", "==", id))
    );

    const getCommentUser = data.docs.map((userInfo) => {
      return userInfo.data()?.uId;
    });

    const users = await getDocs(
      query(collection(db, "users"), where(documentId(), "in", getCommentUser))
    );

    const blogUsers = users.docs.map((user) => user.data());
    const blogComments = data.docs.map((comment) => comment.data());

    const commentsData = data.docs
      .map((blog) => {
        const findUser = blogUsers.find((user) => user?.uId === user.uid);
        const findComment = blogComments.filter(
          (comment) => comment.blogId === blog.data().id
        );
        return { ...findUser, ...findComment, ...blog.data() };
      })
      .sort((a, b) => b.timeStamp - a.timeStamp);
    setIsLoading(true);
    setCommments(commentsData);
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
        const newTitle = (sfDoc.data().title = title);
        const newDescr = (sfDoc.data().description = desc);
        transaction.update(sfDocRef, {
          title: newTitle,
          description: newDescr,
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

  const handleAddComment = (event) => {
    event.preventDefault();
    if (comment === "") {
      alert("Please Fill The Details");
    } else {
      setTimeout(() => {
        addDoc(collection(db, "Comments"), {
          comment: comment,
          timeStamp: Date.now(),
          uId: uid,
          blogId: id,
        }).then((docResponse) => {
          const docRef = doc(db, "Comments", docResponse?.id);
          updateDoc(docRef, {
            id: docResponse?.id,
          })
            .then(() => {
              getComments();
            })
            .catch((err) => {});
        });
        setComment("");
        toast.success("Comment Submited Successfully");
      }, 500);
    }
  };

  const handleDeleteComments = async (commentId) => {
    let confirmationDelete = window.confirm("Are You Sure?");
    if (confirmationDelete === true) {
      toast.success("Comment Deleted Successefully");
      await deleteDoc(doc(db, "Comments", commentId));
      getComments();
    }
  };

  const handleLike = async (uid) => {
    const docRef = doc(db, "Blog", id);
    const docSnap = await getDoc(docRef);
    const currentLikes = docSnap.data()?.likes;

    if (!currentLikes.includes(uid)) {
      updateDoc(docRef, {
        likes: [...currentLikes, uid],
      })
        .then((res) => {})
        .catch((err) => {});
    } else {
      const removedLikes = currentLikes.filter((item) => item !== uid);
      updateDoc(docRef, {
        likes: [...removedLikes],
      })
        .then((res) => {})
        .catch((err) => {});
    }
    getBlogDetail();
  };

  useEffect(() => {
    getBlogDetail();
    getComments();
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
          {!isLading ? (
            <React.Fragment>
              <div>
                <p className="text-center">Loading...</p>
              </div>
            </React.Fragment>
          ) : (
            <Container>
              {data.map((item) => {
                var date = new Date(item.timeStamp);
                return (
                  <div>
                    <Card>
                      {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                      <Card.Body>
                        <Card.Text style={{ marginTop: "-15px" }}>
                          <AiOutlineEye />
                          <span style={{ fontSize: "12px", marginLeft: "5px" }}>
                            {item.views}
                          </span>
                        </Card.Text>
                        <Card.Text style={{ marginTop: "-20px" }}>
                          <span style={{ fontSize: "12px" }}>
                            {" "}
                            Published On:
                          </span>
                          <span style={{ fontWeight: "500", fontSize: "12px" }}>
                            {date.toLocaleString()}
                          </span>
                        </Card.Text>
                        <Card.Text
                          className="text"
                          onClick={() => navigate(`/Profile/${item?.uid}`)}
                        >
                          <FaPenNib />
                          &nbsp;
                          <b>{item.displayName}</b>
                        </Card.Text>
                        <Card.Title>{item.title}</Card.Title>
                        <Card.Text>{item.description}</Card.Text>
                        <Button
                          id="like-btn"
                          variant="primary me-1"
                          onClick={() => handleLike(uid)}
                          style={{ marginTop: "-10px" }}
                        >
                          <AiFillLike
                            style={{
                              textAlign: "center",
                              color: item?.likes?.includes(uid)
                                ? "red"
                                : "black",
                            }}
                          />
                        </Button>
                        <span style={{ fontSize: "18px" }}>
                          {item?.likes.length}
                        </span>
                        {uid === item.uid ? (
                          <div className="text-center">
                            <Button
                              id="delete-btn"
                              variant="primary me-2"
                              onClick={() => handleDeleteBlog(item.id)}
                            >
                              <AiFillDelete />
                            </Button>
                            <Button
                              id="edit-btn"
                              variant="primary"
                              onClick={() =>
                                handleGetDataforEdit(
                                  item.title,
                                  item.description
                                )
                              }
                            >
                              <FiEdit />
                            </Button>
                          </div>
                        ) : null}
                      </Card.Body>
                    </Card>
                  </div>
                );
              })}
            </Container>
          )}
        </div>
      </div>

      {/* Start -- Add Comments Section */}
      <div className="comment-div">
        <Container>
          <div>
            <h3>Write Comments</h3>
          </div>
          <Form onSubmit={handleAddComment}>
            <div className="comment-inner">
              <div
                className="name-show"
                onClick={() => navigate(`/Profile/${uid}`)}
              >
                <span> {name}</span>
              </div>
              <div className="write-comment">
                <Form.Group className="mb-3" controlId="formBasicDescription">
                  <Form.Control
                    type="text"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Start the discussion…"
                    as="textarea"
                  />
                </Form.Group>
              </div>
              <div className="gap-2 text-center">
                <Button
                  variant="primary"
                  type="submit"
                  className="update-btn me-2"
                >
                  Post Comment
                </Button>
              </div>
            </div>
          </Form>
        </Container>
      </div>
      {/* End -- Add Comments Section */}

      {/* Start -- Show Comments Section */}
      <div className="comments-show-div">
        {!isLading ? (
          <React.Fragment>
            <div>
              <p className="text-center">Loading...</p>
            </div>
          </React.Fragment>
        ) : (
          <Container>
            <h5>Comments</h5>
            {comments.map((item) => {
              var date = new Date(item?.timeStamp);
              return (
                <div className="each-comment">
                  <div>
                    <div
                      className="name-and-date"
                      onClick={() => navigate(`/Profile/${item?.uId}`)}
                    >
                      <span>{item?.displayName}</span>
                    </div>
                    <div
                      className="commented-on"
                      style={{ marginTop: "6px", marginBottom: "6px" }}
                    >
                      {" "}
                      <span style={{ fontWeight: "500" }}>Commented On: </span>
                      <span style={{ fontWeight: "600" }}>
                        {date.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <p>{item?.comment}</p>
                    </div>
                  </div>
                  {uid === item?.uId ? (
                    <div className="delete-comment">
                      <AiFillDelete
                        onClick={() => handleDeleteComments(item?.id)}
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </Container>
        )}
      </div>
      {/* End -- Show Comments Section */}
    </React.Fragment>
  );
};

export default BlogDetails;
