export const actionTypes = {
  SET_ERROR: "activities/SET_ERROR",
  SET_DATA: "activities/SET_DATA",
  SET_SELECTED_DATA: "activities/SET_SELECTED_DATA"
};

const errorTypes = {
  TOO_FEW: "activities/error/TOO_FEW",
  TOO_MANY: "activities/error/TOO_MANY",
  EMPTY: "activities/error/EMPTY"
};

export const setData = activity => (dispatch, getState) => {
  try {
    let updatedActivity = activity;
    const state = getState();
    const currData = state.activities.data;
    const itemExists = currData.find(item => item.id === activity.id);

    if (itemExists) {
      const itemIndex = currData.findIndex(item => item.id === activity.id);
      updatedActivity = {
        ...itemExists,
        ...activity,
        last_update: Date.now()
      };
      currData[itemIndex] = updatedActivity;
    } else {
      updatedActivity = {
        id: currData.length + 1,
        ...activity,
        archived: false,
        last_update: Date.now()
      };
      currData.push(updatedActivity);
    }

    const updatedData = currData;

    dispatch({
      type: actionTypes.SET_DATA,
      payload: updatedData
    });

    return updatedActivity;
  } catch (err) {
    dispatch({
      type: actionTypes.SET_ERROR,
      payload: err.toString()
    });
  }
};

export const setSelected = activity => (dispatch, getState) => {
  try {
    const state = getState();
    const currSelected = state.activities.selected;
    const totalGuests = state.details.total_guests;
    const itemExists = currSelected.find(item => item.id === activity.id);

    if (itemExists) {
      const itemIndex = currSelected.findIndex(item => item.id === activity.id);
      currSelected[itemIndex] = {
        ...itemExists,
        ...activity
      };
    } else {
      currSelected.push(activity);
    }

    const updatedSelected = currSelected.filter(activity =>
      Boolean(activity.qty)
    );

    dispatch({
      type: actionTypes.SET_SELECTED_DATA,
      payload: updatedSelected
    });

    const totalActivities = updatedSelected.reduce((a, b) => a.qty + b.qty);

    if (!totalActivities) {
      throw errorTypes.EMPTY;
    }

    if (totalGuests < totalActivities) {
      throw errorTypes.TOO_FEW;
    }

    if (totalGuests > totalActivities) {
      throw errorTypes.TOO_MANY;
    }
  } catch (err) {
    dispatch({
      type: actionTypes.SET_ERROR,
      payload: err.toString()
    });
  }
};
