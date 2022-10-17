import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../../firebase/config";

export const loginUser = ({ email, pass }) => {
  return (dispatch) => {
    signInWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        const user = userCredential.user;
        toast.success("Welcome Back!");
        dispatch({
          type: "LOGIN_USER",
          payload: user,
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
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({
          type: "LOGIN_USER",
          payload: user,
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
