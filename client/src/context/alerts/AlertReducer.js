export default (state, action) => {
    switch (action.type) {
      case 'SHOW_ALERT':
        return [...state, action.payload];
      case 'REMOVE_ALERT':
        return state.filter((el) => el.id !== action.payload)
      default:
        return state;
    }
  };
  