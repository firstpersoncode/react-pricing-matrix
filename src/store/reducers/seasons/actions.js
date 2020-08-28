export const actionTypes = {
  SET_ERROR: "seasons/SET_ERROR",
  SET_DATA: "seasons/SET_DATA"
};

export const setData = season => (dispatch, getState) => {
  try {
    const state = getState();
    const currData = state.seasons.data;
    const itemExists = currData.find(item => item.id === season.id);

    if (itemExists) {
      const itemIndex = currData.findIndex(item => item.id === season.id);
      currData[itemIndex] = {
        ...itemExists,
        ...season,
        last_update: Date.now()
      };
    } else {
      currData.push({
        id: currData.length + 1,
        ...season,
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
