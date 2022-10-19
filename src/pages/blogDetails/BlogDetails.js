import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
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
import { db } from "../../firebase/config";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast, ToastContainer } from "react-toastify";
import { Container, Modal } from "react-bootstrap";
import "./style.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Comments from "../../Components/Comments";
import BlogCard from "../../Components/BlogCard";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [uid, setUid] = useState("");
  const [desc, setDesc] = useState("");
  const [show, setShow] = useState(false);
  const [isLading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const getBlogDetail = async () => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user?.uid);
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

    const getBlogId = data.docs.map((blogId) => {
      return blogId.data()?.id;
    });

    const comments = await getDocs(
      query(collection(db, "Comments"), where("blogId", "in", getBlogId))
    );

    const users = await getDocs(
      query(collection(db, "users"), where(documentId(), "in", blogsUser))
    );

    const blogUsers = users.docs.map((user) => user.data());
    const blogComments = comments.docs.map((comment) => comment.data());

    const commentsData = data.docs.map((blog) => {
      const findUser = blogUsers.find((user) => user?.uId === user.uid);
      const findComment = blogComments.filter(
        (comment) => comment.blogId === blog.data().id
      );
      return {
        ...findUser,
        ...findComment,
        comments: findComment,
        ...blog.data(),
      };
    });
    setIsLoading(true);
    setData(commentsData);
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

  const handleDeleteBlog = async () => {
    setShow(true);
  };

  const handleConfirmDeleteBlog = async (Id) => {
    toast.success("Blog Deleted Successefully");
    await deleteDoc(doc(db, "Blog", Id));
    navigate("/");
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
                  <div className="card-with-three-dot" key={item?.id}>
                    <BlogCard
                      width={"77vw"}
                      title={item?.title}
                      name={item?.displayName}
                      description={item?.description}
                      uid={item?.uid}
                      views={item?.views}
                      date={date?.toLocaleString()}
                      id={item?.id}
                      handleLike={() => handleLike(uid)}
                      liked={item?.likes?.includes(uid)}
                      commentsLength={item?.comments?.length}
                      likes={item?.likes?.length}
                      showContinueButton={false}
                      handleDeleteBlog={() => handleDeleteBlog(item?.id)}
                      handleGetDataforEdit={() =>
                        handleGetDataforEdit(item.title, item.description)
                      }
                      getAllData={getBlogDetail}
                    />
                  </div>
                );
              })}
            </Container>
          )}
        </div>
      </div>
      <Comments id={id} getAllData={getBlogDetail} />

      <React.Fragment>
        <Modal show={show} onHide={() => setShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Blog</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you wan't to delete this Blog?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => handleConfirmDeleteBlog(id)}
            >
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    </React.Fragment>
  );
};

export default BlogDetails;
