
const initialState = {
    eventsOffline: []
};

export default ClockInOutReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ClockInOutOffline":
      return { ...state, eventsOffline: action.events };
    default:
      return state;
  }
};
