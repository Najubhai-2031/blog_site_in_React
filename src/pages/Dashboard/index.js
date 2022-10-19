import React, { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  runTransaction,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { AiFillDelete } from "react-icons/ai";
import { BsCheckCircleFill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { MdCancel } from "react-icons/md";
import "./style.css";
import { toast, ToastContainer } from "react-toastify";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [uids, setUids] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const getAllUsers = async () => {
    const userss = await getDocs(
      query(collection(db, "users"), where("role", "==", "user"))
    );
    const blogUsers = userss.docs.map((user) => user.data());
    setUsers(blogUsers);
  };

  const deleteUsers = async (uid) => {
    await deleteDoc(doc(db, "users", uid));
    toast.error("User Deleted Successefully");
    getAllUsers();
  };

  const handleEditUserData = async (name, email, id) => {
    setEditMode(true);
    setId(id);
    setName(name);
    setEmail(email);
  };

  const handleUpdateUserData = async () => {
    const sfDocRef = doc(db, "users", id);
    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(sfDocRef);
        if (!sfDoc.exists()) {
          throw "Document does not exist!";
        }
        const newName = (sfDoc.data().displayName = name);
        const newEmail = (sfDoc.data().email = email);
        transaction.update(sfDocRef, {
          displayName: newName,
          email: newEmail,
        });
      });
      toast.success("User Info Updated Successefully");
      setEditMode(false);
      getAllUsers();
    } catch (e) {
      toast.error("Transaction failed: ", e);
    }
  };

  const multiUserDelete = () => {
    setDeleteMode(false);
    uids.forEach(async (singleUid) => {
      await deleteDoc(doc(db, "users", singleUid));
      toast.error("User Deleted Successefully");
      getAllUsers();
    });
  };

  const multiUserSelect = (id) => {
    setDeleteMode(true);
    const tempUids = [...uids];
    if (!uids.includes(id)) {
      tempUids.push(id);
    } else {
      const index = tempUids.findIndex((item) => item === id);
      tempUids.splice(index, 1);
    }
    setUids(tempUids);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <React.Fragment>
      <ToastContainer />
      <Container>
        {uids.length ? (
          <div className="text-right">
            <span
              style={{
                fontSize: "25px",
                color: "red",
                cursor: "pointer",
              }}
            >
              {deleteMode ? (
                <AiFillDelete onClick={() => multiUserDelete()} />
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
            {users.map((item, index) => {
              return (
                <React.Fragment>
                  <tr style={{ fontSize: "20px" }}>
                    <td>
                      <input
                        type="checkbox"
                        onClick={() => multiUserSelect(item?.id)}
                      />
                    </td>
                    <td>{index + 1}</td>

                    {!editMode ? (
                      <td>{item?.displayName}</td>
                    ) : (
                      <td>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </td>
                    )}

                    {!editMode ? (
                      <td>{item?.email}</td>
                    ) : (
                      <td>
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </td>
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
                                onClick={() => deleteUsers(item?.id)}
                              />
                            ) : (
                              <MdCancel onClick={() => setEditMode(false)} />
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
                                  handleEditUserData(
                                    item?.displayName,
                                    item?.email,
                                    item?.id
                                  )
                                }
                              />
                            ) : (
                              <BsCheckCircleFill
                                onClick={() => handleUpdateUserData()}
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
          </tbody>
        </Table>
      </Container>
    </React.Fragment>
  );
};

export default Dashboard;
