export const actionTypes = {
  SET_ERROR: "matrix/SET_ERROR",
  SET_DATA: "matrix/SET_DATA"
};

export const setData = matrix => (dispatch, getState) => {
  try {
    let updatedMatrix = matrix;
    const state = getState();
    const currData = state.matrix.data;
    const itemExists = currData.find(item => item.id === matrix.id);

    if (itemExists) {
      const itemIndex = currData.findIndex(item => item.id === matrix.id);
      updatedMatrix = {
        ...itemExists,
        ...matrix,
        last_update: Date.now()
      };
      currData[itemIndex] = updatedMatrix;
    } else {
      updatedMatrix = {
        id: currData.length + 1,
        ...matrix,
        archived: false,
        last_update: Date.now()
      };
      currData.push(updatedMatrix);
    }

    const updatedData = currData;

    dispatch({
      type: actionTypes.SET_DATA,
      payload: updatedData
    });

    return updatedMatrix;
  } catch (err) {
    dispatch({
      type: actionTypes.SET_ERROR,
      payload: err.toString()
    });
  }
};
