import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  runTransaction,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Table, ToastContainer } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { BsCheckCircleFill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { MdCancel } from "react-icons/md";
import { toast } from "react-toastify";
import { db } from "../../../../firebase/config";

const CommentsForAdmin = () => {
  const [commentData, setCommentData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [ids, setIds] = useState([]);
  const [id, setId] = useState("");
  const [comment, setComment] = useState("");

  const getAllComments = async () => {
    const comments = await getDocs(query(collection(db, "Comments")));
    const allComments = comments.docs.map((com) => com.data());
    setCommentData(allComments);
    setIsLoading(true);
  };

  const deleteComment = async (id) => {
    await deleteDoc(doc(db, "Comments", id));
    toast.error("Comment Deleted Successefully");
    getAllComments();
  };

  const handleEditCommentData = async (comment, id) => {
    setEditMode(true);
    setId(id);
    setComment(comment);
  };

  const handleUpdateCommentData = async () => {
    const sfDocRef = doc(db, "Comments", id);
    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(sfDocRef);
        if (!sfDoc.exists()) {
          throw "Document does not exist!";
        }
        const newComment = (sfDoc.data().comment = comment);
        transaction.update(sfDocRef, {
          comment: newComment,
        });
      });
      toast.success("Comment Updated Successefully");
      setEditMode(false);
      getAllComments();
    } catch (e) {
      toast.error(e);
    }
  };

  const multiCommentsDelete = () => {
    setDeleteMode(false);
    ids.forEach(async (singleid) => {
      toast.error("Comment Deleted Successefully");
      await deleteDoc(doc(db, "Comments", singleid));
      getAllComments();
    });
  };

  const multiCommentsSelect = (id) => {
    setDeleteMode(true);
    const tempIds = [...ids];
    if (!ids.includes(id)) {
      tempIds.push(id);
    } else {
      const index = tempIds.findIndex((item) => item === id);
      tempIds.splice(index, 1);
    }
    setIds(tempIds);
  };

  useEffect(() => {
    getAllComments();
  }, []);

  if (!isLoading) {
    return (
      <React.Fragment>
        <div className="margin-left">
          <div>
            <h3>Comments</h3>
          </div>
          <div className="text-center">
            <h5>Loading...</h5>
          </div>
        </div>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <ToastContainer />
        <div className="margin-left">
          <div>
            <h3>Comments</h3>
            <span style={{ fontWeight: "500" }}>Total Comments: </span>
            {commentData.length}
          </div>
          {ids.length ? (
            <div className="text-right">
              <span
                style={{
                  fontSize: "25px",
                  color: "red",
                  cursor: "pointer",
                }}
              >
                {deleteMode ? (
                  <AiFillDelete onClick={() => multiCommentsDelete()} />
                ) : null}
              </span>
              {deleteMode ? (
                <span
                  style={{
                    fontSize: "25px",
                    color: "green",
                    cursor: "pointer",
                  }}
                >
                  <MdCancel onClick={() => setDeleteMode(false)} />
                </span>
              ) : null}
            </div>
          ) : null}

          <Table striped bordered hover style={{ marginTop: "20px" }}>
            <thead>
              <tr>
                <th>Select</th>
                <th>No.</th>
                <th>Comments</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {commentData.length ? (
                <>
                  {commentData.map((item, index) => {
                    return (
                      <React.Fragment>
                        <tr style={{ fontSize: "20px" }}>
                          <td>
                            <input
                              type="checkbox"
                              onClick={() => multiCommentsSelect(item?.id)}
                            />
                          </td>
                          <td>{index + 1}</td>

                          {!editMode ? (
                            <td>{`${item?.comment.slice(0, 65)}...`}</td>
                          ) : item?.id === id ? (
                            <td>
                              <input
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                              />
                            </td>
                          ) : (
                            <td>{`${item?.comment.slice(0, 65)}...`}</td>
                          )}
                          <td>
                            <div className="delete-and-edit-div">
                              <div>
                                <span
                                  style={{
                                    fontSize: "25px",
                                    color: "red",
                                    cursor: "pointer",
                                  }}
                                >
                                  {!editMode ? (
                                    <AiFillDelete
                                      onClick={() => deleteComment(item?.id)}
                                    />
                                  ) : (
                                    <MdCancel
                                      onClick={() => setEditMode(false)}
                                    />
                                  )}
                                </span>
                              </div>
                              <div>
                                <hr
                                  style={{
                                    transform: "rotate(90deg)",
                                    width: "25px",
                                  }}
                                />
                              </div>
                              <div>
                                <span
                                  style={{
                                    fontSize: "25px",
                                    color: "green",
                                    cursor: "pointer",
                                  }}
                                >
                                  {!editMode ? (
                                    <FiEdit
                                      onClick={() =>
                                        handleEditCommentData(
                                          item?.comment,
                                          item?.id
                                        )
                                      }
                                    />
                                  ) : (
                                    <BsCheckCircleFill
                                      onClick={() => handleUpdateCommentData()}
                                    />
                                  )}
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </>
              ) : (
                <React.Fragment>
                  <div className="margin-left">
                    <div className="text-center">
                      <h5>No Comments Found!!!</h5>
                    </div>
                  </div>
                </React.Fragment>
              )}
            </tbody>
          </Table>
        </div>
      </React.Fragment>
    );
  }
};

export default CommentsForAdmin;
