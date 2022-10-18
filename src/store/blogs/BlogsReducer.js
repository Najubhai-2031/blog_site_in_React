const initalState = {
  blogs: [],
  isLoading: true,
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
      return { ...state, blogs: [...state.blogs, ...action?.payload] };
    default:
      return state;
  }
};

export default blogReducer;
