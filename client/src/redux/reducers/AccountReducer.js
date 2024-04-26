let authState = {
  status: false,
  userLogin: null,
};

export const authReducer = (state = authState, action) => {
  switch (action.type) {
    case "set_auth": {
      authState = {...action.value};
      return authState;
    }
    default: {
      return state;
    }
  }
};

export default authReducer;
