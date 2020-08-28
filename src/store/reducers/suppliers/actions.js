export const actionTypes = {
  SET_ERROR: "suppliers/SET_ERROR",
  SET_DATA: "suppliers/SET_DATA"
};

export const setData = supplier => (dispatch, getState) => {
  try {
    const state = getState();
    const currData = state.suppliers.data;
    const itemExists = currData.find(item => item.id === supplier.id);

    if (itemExists) {
      const itemIndex = currData.findIndex(item => item.id === supplier.id);
      currData[itemIndex] = {
        ...itemExists,
        ...supplier,
        last_update: Date.now()
      };
    } else {
      currData.push({
        id: currData.length + 1,
        ...supplier,
        archived: false,
        last_update: Date.now()
      });
    }

    const updatedData = currData;

    dispatch({
      type: actionTypes.SET_DATA,
      payload: updatedData
    });
  } catch (err) {
    dispatch({
      type: actionTypes.SET_ERROR,
      payload: err.toString()
    });
  }
};
