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

const BlogsForAdmin = () => {
  const [blogs, setBlogs] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ids, setIds] = useState([]);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const getAllBlogs = async () => {
    const blogs = await getDocs(query(collection(db, "Blog")));
    const allBlogs = blogs.docs.map((blog) => blog.data());
    setBlogs(allBlogs);
    setIsLoading(true);
  };

  const deleteBlog = async (id) => {
    await deleteDoc(doc(db, "Blog", id));
    toast.error("Blog Deleted Successefully");
    getAllBlogs();
  };

  const handleEditBlogData = async (title, description, id) => {
    setEditMode(true);
    setId(id);
    setTitle(title);
    setDescription(description);
  };

  const multiBlogsDelete = () => {
    setDeleteMode(false);
    ids.forEach(async (singleid) => {
      toast.error("Blog Deleted Successefully");
      await deleteDoc(doc(db, "Blog", singleid));
      getAllBlogs();
    });
  };

  const multiBlogsSelect = (id) => {
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

  const handleUpdateBlogData = async () => {
    const sfDocRef = doc(db, "Blog", id);
    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(sfDocRef);
        if (!sfDoc.exists()) {
          throw "Document does not exist!";
        }
        const newTitle = (sfDoc.data().title = title);
        const newDescription = (sfDoc.data().description = description);
        transaction.update(sfDocRef, {
          title: newTitle,
          description: newDescription,
        });
      });
      toast.success("Blog Updated Successefully");
      setEditMode(false);
      getAllBlogs();
    } catch (e) {
      toast.error(e);
    }
  };

  useEffect(() => {
    getAllBlogs();
  }, []);

  if (!isLoading) {
    return (
      <React.Fragment>
        <ToastContainer />
        <div className="margin-left">
          <div>
            <h3>Blogs</h3>
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
            <h3>Blogs</h3>
            <span style={{ fontWeight: "500" }}>Total Blogs: </span>
            {blogs.length}
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
                  <AiFillDelete onClick={() => multiBlogsDelete()} />
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
                <th>Username</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {blogs.length ? (
                <>
                  {blogs.map((item, index) => {
                    return (
                      <React.Fragment>
                        <tr style={{ fontSize: "20px" }}>
                          <td>
                            <input
                              type="checkbox"
                              onClick={() => multiBlogsSelect(item?.id)}
                            />
                          </td>
                          <td>{index + 1}</td>

                          {!editMode ? (
                            <td>{`${item?.title.slice(0, 20)}...`}</td>
                          ) : item?.id === id ? (
                            <td>
                              <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                              />
                            </td>
                          ) : (
                            <td>{`${item?.title.slice(0, 20)}...`}</td>
                          )}

                          {!editMode ? (
                            <td>{`${item?.description.slice(0, 30)}...`}</td>
                          ) : item?.id === id ? (
                            <td>
                              <input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                              />
                            </td>
                          ) : (
                            <td>{`${item?.description.slice(0, 30)}...`}</td>
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
                                      onClick={() => deleteBlog(item?.id)}
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
                                        handleEditBlogData(
                                          item?.title,
                                          item?.description,
                                          item?.id
                                        )
                                      }
                                    />
                                  ) : (
                                    <BsCheckCircleFill
                                      onClick={() => handleUpdateBlogData()}
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
                      <h5>No Blogs Found!!!</h5>
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

export default BlogsForAdmin;
