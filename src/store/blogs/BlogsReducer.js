const initalState = {
  blogs: [],
};

const blogReducer = (state = initalState, action) => {
  switch (action.type) {
    case "BLOG_LIST":
      return {
        ...state,
        blogs: [...action?.payload],
        isLoading: false,
      };
    case "ADD_BLOG":
      return { ...state, blogs: [action?.payload, ...state.blogs] };
    default:
      return state;
  }
};

export default blogReducer;
