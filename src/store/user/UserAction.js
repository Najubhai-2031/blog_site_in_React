import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { auth, db } from "../../firebase/config";

export const loginUser = ({ email, pass }) => {
  return (dispatch) => {
    signInWithEmailAndPassword(auth, email, pass)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const docRef = doc(db, "users", user?.uid);
        const docSnap = await getDoc(docRef);
        dispatch({
          type: "LOGIN_USER",
          payload: { ...user, role: docSnap?.data().role },
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(`${errorCode} - ${errorMessage}`);
      });
  };
};

export const authState = () => {
  return (dispatch) => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      const docRef = doc(db, "users", user?.uid);
      const docSnap = await getDoc(docRef);
      if (user) {
        dispatch({
          type: "LOGIN_USER",
          payload: { ...user, role: docSnap?.data().role },
        });
      }
    });
  };
};

export const logout = () => {
  return (dispatch) => {
    signOut(auth)
      .then(() => {
        dispatch({
          type: "LOGOUT_USER",
          payload: null,
        });
      })
      .catch((error) => {});
  };
};
