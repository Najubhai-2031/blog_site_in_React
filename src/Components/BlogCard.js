import React from "react";
import "./style.css";
import { Card, Dropdown } from "react-bootstrap";
import { ArrowRight } from "react-bootstrap-icons";
import { AiFillDelete, AiFillLike, AiOutlineEye } from "react-icons/ai";
import { FaComment, FaPenNib } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const BlogCard = (props) => {
  const userUid = useSelector((state) => state?.user?.user?.uid);
  const { showContinueButton = true } = props;
  const { showEditDeleteButton = true } = props;
  const navigate = useNavigate("");

  return (
    <React.Fragment>
      <Card style={{ marginTop: "-20px" }}>
        <Card.Body>
          <div style={{ width: `${props?.width}` }}>
            <div className="card-and-three-dot">
              <div>
                <div className="content-div title-div">
                  <Card.Title>{props?.title}</Card.Title>
                </div>
                <div className="content-div profile-div">
                  <Card.Text className="text">
                    <FaPenNib />
                    <b onClick={() => navigate(`/Profile/${props?.uid}`)}>
                      {props?.name}
                    </b>
                  </Card.Text>
                </div>
                <div
                  className="content-div description-div"
                  style={{ width: `${props?.width}` }}
                >
                  <Card.Text id="sort-description">
                    {props?.description}
                  </Card.Text>
                </div>
                <div
                  className="content-div like-comment-view-div"
                  style={{ width: `${props?.width}` }}
                >
                  <div>
                    <AiOutlineEye style={{ marginLeft: "5px" }} />
                    {props?.views}
                  </div>
                  <div onClick={props?.handleOpenComments}>
                    <FaComment />
                    {props?.commentsLength}
                  </div>
                  <div onClick={props?.handleLike}>
                    <AiFillLike
                      style={{
                        cursor: "pointer",
                        textAlign: "center",
                        color: props?.liked ? "red" : "black",
                      }}
                    />
                    {props?.likes}
                  </div>
                </div>
                <div
                  className="content-div readmore-div "
                  style={{ width: `${props?.width}` }}
                >
                  <div className="last-text">
                    <Card.Text>{props?.date}</Card.Text>
                  </div>
                  <div className="last-text">
                    {showContinueButton ? (
                      <Card.Text
                        className="read-more text-right"
                        onClick={props?.handleNavigate}
                      >
                        Continue Reading
                        <ArrowRight />
                      </Card.Text>
                    ) : null}
                  </div>
                </div>
              </div>
              <div>
                {showEditDeleteButton ? (
                  <div>
                    {props?.uid === userUid ? (
                      <div className="three-dot">
                        <Dropdown>
                          <Dropdown.Toggle>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-three-dots-vertical"
                              viewBox="0 0 16 16"
                            >
                              <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                            </svg>
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item
                              id="delete-btn"
                              variant="primary"
                              onClick={props?.handleDeleteBlog}
                            >
                              <span style={{ fontSize: "15px" }}>
                                <AiFillDelete />
                                Delete
                              </span>
                            </Dropdown.Item>
                            <Dropdown.Item
                              id="edit-btn"
                              variant="primary"
                              onClick={props?.handleGetDataforEdit}
                            >
                              <span style={{ fontSize: "15px" }}>
                                <FiEdit /> Edit
                              </span>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

export default BlogCard;
