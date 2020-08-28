import { actionTypes } from "./actions";
import initialState from "./state";

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ERROR: {
      return {
        ...state,
        error: action.payload
      };
    }
    case actionTypes.SET_DATA: {
      return {
        ...state,
        data: action.payload
      };
    }
    default: {
      return state;
    }
  }
};
