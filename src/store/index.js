import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import reduxThunk from "redux-thunk";
import blogReducer from "./blogs/BlogsReducer";
import userReducer from "./user/UserReducer";

const reducer = combineReducers({
  user: userReducer,
  blog: blogReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(reduxThunk))
);

store.subscribe(() => {
  // console.log("store data:", store.getState());
});

export default store;
