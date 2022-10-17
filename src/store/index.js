import { applyMiddleware, compose, createStore } from "redux";
import reduxThunk from "redux-thunk";
import userReducer from "./user/reducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  userReducer,
  composeEnhancers(applyMiddleware(reduxThunk))
);

store.subscribe(() => {
  console.log("store data:", store.getState());
});

export default store;
