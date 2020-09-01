export const actionTypes = {
  SET_ERROR: "rooms/SET_ERROR",
  SET_DATA: "rooms/SET_DATA",
  SET_SELECTED_DATA: "rooms/SET_SELECTED_DATA"
};

// const errorTypes = {
//   TOO_FEW: "rooms/error/TOO_FEW",
//   TOO_MANY: "rooms/error/TOO_MANY",
//   EMPTY: "rooms/error/EMPTY"
// };

export const setData = room => (dispatch, getState) => {
  try {
    let updatedRoom = room;
    const state = getState();
    const currData = state.rooms.data;
    const itemExists = currData.find(item => item.id === room.id);

    if (itemExists) {
      const itemIndex = currData.findIndex(item => item.id === room.id);
      updatedRoom = {
        ...itemExists,
        ...room,
        last_update: Date.now()
      };
      currData[itemIndex] = updatedRoom;
    } else {
      updatedRoom = {
        id: currData.length + 1,
        ...room,
        archived: false,
        last_update: Date.now()
      };

      currData.push(updatedRoom);
    }

    const updatedData = currData;

    dispatch({
      type: actionTypes.SET_DATA,
      payload: updatedData
    });

    return updatedRoom;
  } catch (err) {
    dispatch({
      type: actionTypes.SET_ERROR,
      payload: err.toString()
    });
  }
};

export const setSelected = room => (dispatch, getState) => {
  try {
    const state = getState();
    const currSelected = state.rooms.selected;
    // const totalGuests = state.details.total_guests;
    const itemExists = currSelected.find(item => item.id === room.id);

    if (itemExists) {
      const itemIndex = currSelected.findIndex(item => item.id === room.id);
      currSelected[itemIndex] = {
        ...itemExists,
        ...room
      };
    } else {
      currSelected.push(room);
    }

    const updatedSelected = currSelected.filter(room => Boolean(room.qty));

    dispatch({
      type: actionTypes.SET_SELECTED_DATA,
      payload: updatedSelected
    });

    // const totalSpaces = updatedSelected.reduce(
    //   (a, b) => a.total_guests + b.total_guests
    // );
    //
    // if (!totalSpaces) {
    //   throw errorTypes.EMPTY;
    // }
    //
    // if (totalGuests < totalSpaces) {
    //   throw errorTypes.TOO_FEW;
    // }
    //
    // if (totalGuests > totalSpaces) {
    //   throw errorTypes.TOO_MANY;
    // }
  } catch (err) {
    dispatch({
      type: actionTypes.SET_ERROR,
      payload: err.toString()
    });
  }
};
