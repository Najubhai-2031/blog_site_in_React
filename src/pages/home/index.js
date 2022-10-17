import { updateDoc, doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Container, Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../../firebase/config";
import "./style.css";
import BlogCard from "../../Components/BlogCard";
import Comments from "../../Components/Comments";
import { useDispatch, useSelector } from "react-redux";
import {
  addBlogs,
  getBlogList,
  likeBlogs,
} from "../../store/blogs/BlogsAction";

const Home = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [uId, setUId] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [commentId, setCommentId] = useState(null);
  const dispatch = useDispatch();

  const blogList = useSelector((blogsList) => blogsList?.blog.blogs);
  const userId = useSelector((uid) => uid?.user?.user?.uid);
  const navigate = useNavigate();

  const getBlogs = () => {
    dispatch(getBlogList());
  };

  const handleOpenComments = (id) => {
    setModalShow(true);
    setCommentId(id);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(addBlogs({ title, desc, userId }));
  };

  const handleLike = (id) => {
    dispatch(likeBlogs({ id, userId }));
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
        {blogList?.blog?.isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <Container className="cards">
            {blogList.map((item) => {
              var date = new Date(item.timeStamp);
              var title = item?.title;
              return (
                <div className="cards-inner" key={item?.id}>
                  <BlogCard
                    title={`${title.slice(0, 25)}...`}
                    name={item.displayName}
                    description={`${item.description.slice(0, 150)}...`}
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
