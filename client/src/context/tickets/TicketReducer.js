export default (state, action) => {
  switch (action.type) {
    case 'LOAD_USER_TICKETS_SUCCESS':
      return {
        ...state,
        tickets: action.payload,
        isLoading: false,
        errors: null,
      };
    case 'LOAD_TICKET_SUCCESS':
    case 'UPDATE_TICKET_SUCCESS':
      return {
        ...state,
        ticket: action.payload,
        isLoading: false,
        errors: null,
      };
    case 'CREATE_TICKET_SUCCESS':
      return {
        ...state,
        isLoading: false,
        errors: null,
      };
      // case 'LOAD_PROJECT_FOR_TICKET_SUCCESS':
      //   return {
      //     ...state,
      //     isLoading: false,
      //     project: action.payload,
      //     errors: null,
      //   };
    case 'CLEAR_TICKET':
      return {
        ...state,
        ticket: null
      };
      case 'CLEAR_TICKETS':
        return {
          ...state,
          tickets: [],
        }
    case 'LOAD_USER_TICKETS_FAILURE':
    case 'LOAD_TICKET_FAILURE':
    case 'CREATE_TICKET_FAILURE':
    case 'TICKET_DELETED':
    case 'UPDATE_TICKET_FAILURE':
      return {
        ...state,
        isLoading: false,
        errors: action.payload,
      };
      // case 'LOAD_PROJECT_FOR_TICKET_FAILURE':
      //       return {
      //           ...state,
      //           isLoading: false,
      //           project: null,
      //           errors: null,
      //         };
    default:
      return state;
  }
};
