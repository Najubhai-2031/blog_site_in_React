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
import "./style.css";
import { toast, ToastContainer } from "react-toastify";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [idd, setIdd] = useState("");
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
    setIdd(id);
    setName(name);
    setEmail(email);
  };

  const handleUpdateUserData = async () => {
    const sfDocRef = doc(db, "users", idd);
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

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <React.Fragment>
      <ToastContainer />
      <Container>
        <Table striped bordered hover style={{ marginTop: "20px" }}>
          <thead>
            <tr>
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
                    <td>{index + 1}</td>

                    {!editMode ? (
                      <td id="oldName">{item?.displayName}</td>
                    ) : (
                      <td id="newName">
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </td>
                    )}

                    {!editMode ? (
                      <td id="oldEmail">{item?.email}</td>
                    ) : (
                      <td id="newEmail">
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </td>
                    )}
                    <td>
                      <div className="delete-and-edit-div">
                        <div onClick={() => deleteUsers(item?.id)}>
                          <span
                            style={{
                              fontSize: "25px",
                              color: "red",
                              cursor: "pointer",
                            }}
                          >
                            <AiFillDelete />
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
