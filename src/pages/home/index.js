import {
  updateDoc,
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  orderBy,
  where,
  documentId,
  addDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Container, Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../../firebase/config";
import "./homestyle.css";
import BlogCard from "../../Components/BlogCard";
import Comments from "../../Components/Comments";
import { useSelector } from "react-redux";

const Home = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [data, setData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [commentId, setCommentId] = useState(null);
  const userId = useSelector((uid) => uid?.user?.user?.uid);
  const navigate = useNavigate();

  const getBlogs = async () => {
    const querySnapshot = collection(db, "Blog");
    const data = await getDocs(query(querySnapshot, orderBy("timeStamp")));

    const blogsUser = data.docs.map((blog) => {
      return blog.data()?.uid;
    });

    const getBlogId = data.docs.map((blogId) => {
      return blogId.data()?.id;
    });

    const comments = await getDocs(
      query(collection(db, "Comments"), where("blogId", "in", getBlogId))
    );

    const blogComments = comments.docs.map((comment) => comment.data());

    const users = await getDocs(
      query(collection(db, "users"), where(documentId(), "in", blogsUser))
    );

    const blogUsers = users.docs.map((user) => user.data());

    const commentsData = data.docs
      .map((blog) => {
        const findUser = blogUsers.find(
          (user) => blog?.data()?.uid === user.id
        );
        const findComment = blogComments.filter(
          (comment) => comment.blogId === blog.data().id
        );
        return { ...findUser, comments: findComment, ...blog.data() };
      })
      .sort((a, b) => b.timeStamp - a.timeStamp);
    setIsLoading(true);
    setData(commentsData);
  };

  const handleOpenComments = (id) => {
    setModalShow(true);
    setCommentId(id);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (title === "" || desc === "") {
      alert("Please Fill The Details");
    } else {
      setTimeout(() => {
        addDoc(collection(db, "Blog"), {
          title: title,
          description: desc,
          timeStamp: Date.now(),
          uid: userId,
        }).then((docResponse) => {
          const docRef = doc(db, "Blog", docResponse?.id);
          updateDoc(docRef, {
            id: docResponse?.id,
            views: 0,
            likes: [],
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

  const handleLike = async (id) => {
    const docRef = doc(db, "Blog", id);
    const docSnap = await getDoc(docRef);
    const currentLikes = docSnap.data()?.likes;

    if (!currentLikes.includes(userId)) {
      updateDoc(docRef, {
        likes: [...currentLikes, userId],
      })
        .then((res) => {})
        .catch((err) => {});
      getBlogs();
    } else {
      const removedLikes = currentLikes.filter((item) => item !== userId);
      updateDoc(docRef, {
        likes: [...removedLikes],
      })
        .then((res) => {})
        .catch((err) => {});
      getBlogs();
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  const handleNavigate = async (id) => {
    const docRef = doc(db, "Blog", id);
    const docSnap = await getDoc(docRef);
    const currentView = docSnap.data()?.views;
    updateDoc(docRef, {
      views: currentView + 1,
    })
      .then((res) => {})
      .catch((err) => {});
    navigate(`/Blog/${id}`);
  };

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
              <Button id="btn" variant="outline-primary" onClick={handleSubmit}>
                Add Blog
              </Button>
            </div>
          </Form>
        </div>
        {/* Map Method for data Showing */}
        {!isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <Container className="cards">
            {data.map((item) => {
              var date = new Date(item.timeStamp);
              var title = item?.title;
              return (
                <div className="cards-inner" key={item?.id}>
                  <BlogCard
                    width={"25vw"}
                    title={
                      item?.title?.length >= 30
                        ? `${title.slice(0, 30)}...`
                        : item?.title
                    }
                    name={item.displayName}
                    description={
                      item?.description?.length >= 150
                        ? `${item.description.slice(0, 200)}...`
                        : item?.description
                    }
                    uid={item?.uid}
                    views={item?.views}
                    date={date.toLocaleString()}
                    id={item?.id}
                    liked={item?.likes?.includes(userId)}
                    likes={item?.likes?.length}
                    handleLike={() => handleLike(item?.id)}
                    handleNavigate={() => handleNavigate(item?.id)}
                    commentsLength={item?.comments?.length}
                    showEditDeleteButton={false}
                    handleOpenComments={() => handleOpenComments(item?.id)}
                  />
                </div>
              );
            })}
          </Container>
        )}
      </div>
      {/* Modal Code Start */}
      <React.Fragment>
        <Modal
          show={modalShow}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Comments id={commentId} getAllData={getBlogs} />
          <Modal.Footer>
            <Button show={modalShow} onClick={() => setModalShow(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
      {/* Modal Code End */}
    </React.Fragment>
  );
};

export default Home;
