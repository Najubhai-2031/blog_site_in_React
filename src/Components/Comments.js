import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  documentId,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import { db } from "../firebase/config";

const Comments = (props) => {
  const user = useSelector((state) => state?.user?.user);
  const [comment, setComment] = useState("");
  const [isLading, setIsLoading] = useState(true);
  const [comments, setCommments] = useState([]);
  const navigate = useNavigate("");

  const handleAddComment = (event) => {
    event.preventDefault();
    if (comment === "") {
      alert("Please Fill The Details");
    } else {
      addDoc(collection(db, "Comments"), {
        comment: comment,
        timeStamp: Date.now(),
        uId: user?.uid,
        blogId: props?.id,
      }).then((docResponse) => {
        const docRef = doc(db, "Comments", docResponse?.id);
        updateDoc(docRef, {
          id: docResponse?.id,
        })
          .then(() => {
            getComments();
            props?.getAllData();
          })
          .catch((err) => {});
      });
      toast.success("Comment Submited Successfully");
      setComment("");
    }
  };

  const getComments = async () => {
    const querySnapshot = collection(db, "Comments");
    const data = await getDocs(
      query(
        querySnapshot,
        orderBy("timeStamp"),
        where("blogId", "==", props?.id)
      )
    );

    const getCommentUser = data.docs.map((userInfo) => {
      return userInfo.data()?.uId;
    });

    if (getCommentUser?.length) {
      const users = await getDocs(
        query(
          collection(db, "users"),
          where(documentId(), "in", getCommentUser)
        )
      );

      const blogUsers = users.docs.map((user) => user.data());
      const blogComments = data.docs.map((comment) => comment.data());

      const commentsData = data.docs
        .map((comment) => {
          const findUser = blogUsers.find((user) => {
            return user?.id === comment?.data().uId;
          });
          const findComment = blogComments.filter(
            (current) => current.blogId === comment.data().id
          );
          return { ...findUser, ...findComment, ...comment.data() };
        })
        .sort((a, b) => b.timeStamp - a.timeStamp);
      setIsLoading(false);
      setCommments(commentsData);
      props?.getAllData();
    } else {
      setIsLoading(false);
      setCommments([]);
    }
  };

  const handleDeleteComments = async (commentId) => {
    let confirmationDelete = window.confirm("Are You Sure?");
    if (confirmationDelete === true) {
      await deleteDoc(doc(db, "Comments", commentId));
      toast.success("Comment Deleted Successefully");
      setCommments((prevState) => {
        return prevState?.filter((comment) => comment?.id !== commentId);
      });
      props?.getAllData();
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <React.Fragment>
      <ToastContainer />
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
                onClick={() => navigate(`/Profile/${user?.uid}`)}
              >
                <span> {user?.displayName}</span>
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
                  Post
                </Button>
              </div>
            </div>
          </Form>
        </Container>
      </div>
      {/* End -- Add Comments Section */}

      {/* Start -- Show Comments Section */}
      <div className="comments-show-div">
        {isLading ? (
          <React.Fragment>
            <div>
              <p className="text-center">Loading...</p>
            </div>
          </React.Fragment>
        ) : (
          <Container>
            <div>
              <h5>Comments</h5>
            </div>
            {comments.length ? (
              <Container>
                {comments.map((item) => {
                  var date = new Date(item?.timeStamp);
                  return (
                    <div className="each-comment" key={item?.id}>
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
                          <span style={{ fontWeight: "500" }}>
                            Commented On:{" "}
                          </span>
                          <span style={{ fontWeight: "600" }}>
                            {date.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <p>{item?.comment}</p>
                        </div>
                      </div>
                      {user?.uid === item?.uId ? (
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
            ) : (
              <div>
                <h2>No comments Found</h2>
              </div>
            )}
          </Container>
        )}
      </div>
      {/* End -- Show Comments Section */}
    </React.Fragment>
  );
};

export default Comments;
