export const actionTypes = {
  SET_ERROR: "details/SET_ERROR",
  SET_DATA: "details/SET_DATA"
};

// const errorTypes = {
//   REQUIRED: "details/error/REQUIRED"
// };

export const setData = (key, value) => (dispatch, getState) => {
  try {
    const state = getState();
    const currData = state.details;
    const updatedData = {
      ...currData,
      [key]: value
    };

    dispatch({
      type: actionTypes.SET_DATA,
      payload: updatedData
    });

    // const requiredFields = [
    //   "first_name",
    //   "last_name",
    //   "email",
    //   "country",
    //   "phone"
    // ];
    //
    // if (requiredFields.includes(key) && !updatedData[key]) {
    //   return dispatch({
    //     type: actionTypes.SET_ERROR,
    //     payload: errorTypes.REQUIRED
    //   })
    // }
  } catch (err) {
    dispatch({
      type: actionTypes.SET_ERROR,
      payload: err.toString()
    });
  }
};
