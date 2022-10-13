import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { HiOutlineMail } from "react-icons/hi";
import { MdAlternateEmail } from "react-icons/md";
import profile from "../Images/profile.png";
import Card from "react-bootstrap/Card";
import { useNavigate, useParams } from "react-router";
import "./style.css";
import { Container } from "react-bootstrap";
import {
  collection,
  documentId,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { AiFillLike, AiOutlineEye } from "react-icons/ai";
import { FaComment, FaPenNib } from "react-icons/fa";
import { ArrowRight } from "react-bootstrap-icons";

const Profile = () => {
  const { uid } = useParams();
  const [data, setData] = useState([]);
  const [user, setUser] = useState("");
  const [isLading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getUserData = async () => {
    const blogQuery = collection(db, "Blog");
    const data = await getDocs(
      query(blogQuery, orderBy("timeStamp"), where("uid", "==", uid))
    );

    const blogsUser = data.docs.map((blog) => {
      return blog.data()?.uid;
    });

    const users = await getDocs(
      query(collection(db, "users"), where(documentId(), "in", blogsUser))
    );

    const blogUsers = users.docs.map((user) => user.data());

    const findUser = blogUsers.find((user) => user.id === uid);
    setIsLoading(true);
    setUser(findUser);
  };

  const getAllData = async () => {
    const blogQuery = collection(db, "Blog");
    const data = await getDocs(
      query(blogQuery, orderBy("timeStamp"), where("uid", "==", uid))
    );

    const blogsUser = data.docs.map((blog) => {
      return blog.data()?.uid;
    });

    const getBlogId = data.docs.map((blogId) => {
      return blogId.data()?.id;
    });

    const users = await getDocs(
      query(collection(db, "users"), where(documentId(), "in", blogsUser))
    );

    const comments = await getDocs(
      query(collection(db, "Comments"), where("blogId", "in", getBlogId))
    );

    const blogUsers = users.docs.map((user) => user.data());
    const blogComments = comments.docs.map((comment) => comment.data());

    const blogData = data.docs.map((blog) => {
      const findUser = blogUsers.find((user) => user.id === blog.data().uid);
      const findComment = blogComments.filter(
        (comment) => comment.blogId === blog.data().id
      );
      return { ...findUser, comments: findComment, ...blog.data() };
    });
    setIsLoading(true);
    setData(blogData);
  };

  useEffect(() => {
    getAllData();
    getUserData();
  }, [uid]);

  if (!isLading) {
    return (
      <React.Fragment>
        <div>
          <p className="text-center">Loading...</p>
        </div>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <div className="profile-inner">
          <Card
            className="card"
            style={{
              border: "none",
              borderBottom: "1px solid #cbc4c4",
              borderRadius: "0px",
            }}
          >
            <Container className="profile">
              <Card.Body>
                <div className="username-div">
                  <Card.Img src={profile}></Card.Img>
                  <Card.Text>
                    <span style={{ fontWeight: "500" }}>
                      <MdAlternateEmail />
                      {user?.displayName}
                    </span>
                  </Card.Text>
                </div>
                <div className="name-div">
                  <Card.Text className="text">Enter Full Name</Card.Text>
                </div>
                <div className="email-div">
                  <Card.Text id="sort-description">
                    {" "}
                    <HiOutlineMail />
                    {user?.email}
                  </Card.Text>
                </div>
                <div className="bio-div">Bio</div>
              </Card.Body>
            </Container>
          </Card>
          <div>
            <Container>
              <div>
                <h1>Posts</h1>
              </div>
            </Container>
          </div>
        </div>
        <div>
          <Container>
            <div>
              <Container className="card">
                {data.map((item) => {
                  var date = new Date(item.timeStamp);
                  return (
                    <div className="cards-inner" key={item?.id}>
                      <Card>
                        <Card.Body>
                          <div className="content-div title-div">
                            <Card.Title>{item.title}</Card.Title>
                          </div>
                          <div className="content-div profile-div">
                            <Card.Text className="text">
                              <FaPenNib />
                              <b
                                onClick={() =>
                                  navigate(`/Profile/${item?.uid}`)
                                }
                              >
                                {item.displayName}
                              </b>
                            </Card.Text>
                          </div>
                          <div className="content-div description-div">
                            <Card.Text id="sort-description">
                              {`${item.description.slice(0, 555)}...`}
                            </Card.Text>
                          </div>
                          <div className="content-div like-comment-view-div">
                            <div>
                              <AiOutlineEye style={{ marginLeft: "5px" }} />
                              {item?.views}
                            </div>
                            <div>
                              <FaComment />
                              {item?.comments?.length}
                            </div>
                            <div>
                              <AiFillLike />
                              {item?.likes?.length}
                            </div>
                          </div>
                          <div className="content-div readmore-div">
                            <div className="last-text">
                              <Card.Text>{date.toLocaleString()}</Card.Text>
                            </div>
                            <div className="last-text">
                              <Card.Text
                                className="read-more text-right"
                                onClick={() => navigate(`/Blog/${item?.id}`)}
                              >
                                Continue Reading
                                <ArrowRight />
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
          </Container>
        </div>
      </React.Fragment>
    );
  }
};

export default Profile;
