import { useState } from "react";
import { bindActionCreators } from "redux";
import { useSelector, useDispatch } from "react-redux";

import { setData as setRoomData } from "../store/reducers/rooms/actions";
import { setData as setMatrixData } from "../store/reducers/matrix/actions";
import {
  makeGetRooms,
  makeGetRoomById
} from "../store/reducers/rooms/selectors";
import { makeGetMatrix } from "../store/reducers/matrix/selectors";

export default function useRoomState() {
  const getRooms = makeGetRooms();
  const getRoomById = makeGetRoomById();
  const getMatrix = makeGetMatrix();

  const { rooms, roomById, matrix } = useSelector(state => ({
    rooms: getRooms(state),
    roomById: getRoomById(state),
    matrix: getMatrix(state)
  }));

  const dispatch = useDispatch();
  const { setRoom, setMatrix } = bindActionCreators(
    { setRoom: setRoomData, setMatrix: setMatrixData },
    dispatch
  );

  const [dialogAddRoom, setDialogAddRoom] = useState(false);

  const toggleDialogAddRoom = () => {
    setRoomFields({ name: "", supplier_id: 0, occupancy: 0, matrix: {} });
    setDialogAddRoom(!dialogAddRoom);
  };

  const [roomFields, setRoomFields] = useState({});
  const updateRoomFields = field => {
    return e => {
      if (field === "archived") {
        const { checked } = e.target;
        setRoomFields(state => ({ ...state, [field]: checked }));
        return;
      }

      if (field === "matrix") {
        setRoomFields(state => ({ ...state, [field]: e }));
        return;
      }

      const { value } = e.target;
      if (field === "supplier_id" || field === "occupancy") {
        setRoomFields(state => ({ ...state, [field]: Number(value) }));
        return;
      }

      setRoomFields(state => ({ ...state, [field]: value }));
    };
  };

  const submitRoomData = e => {
    e.preventDefault();
    let newRoomFields = {};
    for (let field in roomFields) {
      if (field !== "matrix") {
        newRoomFields = {
          ...newRoomFields,
          [field]: roomFields[field]
        };
      }
    }
    const newRoom = setRoom({ ...newRoomFields });
    let { matrix } = roomFields;

    const counters = Object.keys(matrix.pricing);

    for (let counter of counters) {
      for (let row of matrix.pricing[counter]) {
        setMatrix({
          supplier_id: parseInt(roomFields.supplier_id),
          season_id: parseInt(row.season_id),
          counter: parseInt(counter),
          price: parseInt(row.price),
          owner: "room",
          owner_id: parseInt(newRoom.id)
        });
      }
    }

    setDialogAddRoom(false);
    setRoomFields({});
  };

  const [selectedRoomId, setSelectedRoomId] = useState(0);
  const [dialogEditRoom, setDialogEditRoom] = useState(false);

  const toggleDialogEditRoom = async id => {
    if (!isNaN(id)) {
      setSelectedRoomId(id);
      const room = roomById(id);

      const fields = ["name", "supplier_id", "occupancy", "archived"];
      for (let field in room) {
        if (fields.includes(field)) {
          await setRoomFields(state => ({
            ...state,
            [field]: room[field]
          }));
        }
      }

      const matchPricing = matrix("room", room.id);
      // console.log(matchPricing);
      let matrixObject = {};
      for (let pricing of matchPricing) {
        const matchPricingByCounter = matchPricing
          .filter(p => p.counter === pricing.counter)
          .map(p => ({
            id: p.id,
            season_id: p.season_id,
            price: p.price
          }));

        matrixObject = {
          ...matrixObject,
          pricing: {
            ...matrixObject.pricing,
            [pricing.counter]: matchPricingByCounter
          }
        };
      }
      let headers = [];
      for (let pricing of matchPricing) {
        headers = [...headers, pricing.season_id];
      }
      matrixObject = {
        ...matrixObject,
        headers: headers.filter((value, index, self) => {
          return self.indexOf(value) === index;
        })
      };

      setRoomFields(state => ({
        ...state,
        matrix: matrixObject
      }));
    }

    setDialogEditRoom(!dialogEditRoom);
  };

  const updateRoomData = e => {
    e.preventDefault();
    const room = roomById(selectedRoomId);
    let updateRoomFields = {};
    for (let field in roomFields) {
      if (field !== "matrix") {
        updateRoomFields = {
          ...updateRoomFields,
          [field]: roomFields[field]
        };
      }
    }

    let matrixFields = roomFields.matrix;
    const counters = Object.keys(matrixFields.pricing);
    const matchPricing = matrix("room", room.id);
    const currPricingIds = matchPricing.map(pricing => pricing.id);

    let availablePricingIds = [];
    for (let counter of counters) {
      for (let row of matrixFields.pricing[counter]) {
        const pricing = setMatrix({
          ...(row.id ? { id: parseInt(row.id) } : {}),
          supplier_id: parseInt(updateRoomFields.supplier_id),
          season_id: parseInt(row.season_id),
          counter: parseInt(counter),
          price: parseInt(row.price),
          owner: "room",
          owner_id: parseInt(room.id)
          // archived
        });

        availablePricingIds = [...availablePricingIds, pricing.id];
      }
    }

    if (currPricingIds.length) {
      for (let pricingId of currPricingIds) {
        setMatrix({
          id: pricingId,
          archived:
            !availablePricingIds.length ||
            !availablePricingIds.includes(pricingId)
        });
        // if (!availablePricingIds.length) {
        //   setMatrix({
        //     id: pricingId,
        //     archived: true
        //   });
        // } else if (
        //   availablePricingIds.length &&
        //   !availablePricingIds.includes(pricingId)
        // ) {
        //   setMatrix({
        //     id: pricingId,
        //     archived: true
        //   });
        // }
      }
    }

    setRoom({
      ...room,
      ...updateRoomFields
    });

    setDialogEditRoom(false);
    setRoomFields({});
  };

  const [dialogDeleteRoom, setDialogDeleteRoom] = useState(false);

  const toggleDialogDeleteRoom = id => {
    if (!isNaN(id)) {
      setSelectedRoomId(id);
    }
    setDialogDeleteRoom(!dialogDeleteRoom);
  };

  const deleteRoomData = () => {
    const room = roomById(selectedRoomId);
    setRoom({
      ...room,
      archived: true
    });
    setDialogDeleteRoom(false);
  };

  return {
    rooms,
    toggleDialogAddRoom,
    toggleDialogEditRoom,
    toggleDialogDeleteRoom,
    dialogAddRoom,
    dialogEditRoom,
    dialogDeleteRoom,
    submitRoomData,
    updateRoomData,
    deleteRoomData,
    updateRoomFields,
    roomFields,
    selectedRoomId
  };
}
