export default (state, action) => {
    switch (action.type) {
      case 'LOAD_PROFILES_SUCCESS':
        return {
          ...state,
          profiles: action.payload,
          isLoading: false,
          errors: null,
        };
      case 'LOAD_USER_PROFILE_SUCCESS':
      case 'UPDATE_USER_PROFILE_SUCCESS':
      case 'ADD_COMMENT_SUCCESS':
        return {
          ...state,
          profile: action.payload,
          isLoading: false,
          errors: null,
        };
      case 'CLEAR_USER_PROFILE':
        return {
          ...state,
          profile: null,
        };
        case 'CLEAR_PROFILES':
        return {
          ...state,
          profiles: [],
        };
      case 'CREATE_USER_PROFILE_SUCCESS':
        return {
          ...state,
          isLoading: false,
          errors: null,
        };
      case 'LOAD_PROFILES_FAILURE':
      case 'CREATE_USER_PROFILE_FAILURE':
      case 'LOAD_USER_PROFILE_FAILURE':
      case 'ADD_COMMENT_FAILURE':
      case 'UPDATE_USER_PROFILE_FAILURE':
        return {
          ...state,
          // profile: null,
          isLoading: false,
          errors: action.payload,
        };
        case 'PROFILE_DELETED':
          return {
            ...state,
            profile: null,
            isLoading: false,
            errors: action.payload,
          };
      default:
        return state;
    }
  };
  