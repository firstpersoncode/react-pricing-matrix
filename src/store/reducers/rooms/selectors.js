import { createSelector } from "reselect";
import { makeGetSelectedSupplier } from "../suppliers/selectors";
import { makeGetPricing } from "../matrix/selectors";

const dataRooms = state => state.rooms.data;
const selectedRooms = state => state.rooms.selected;

export const makeGetRooms = () =>
  createSelector(
    [makeGetPricing(), makeGetSelectedSupplier(), dataRooms],
    (pricing, supplier, data) => {
      data = data.filter(room => !room.archived);

      if (supplier.id) {
        data = data.filter(room => room.supplier_id === supplier.id);
      }

      return data
        .map(room => {
          const matchPricing = pricing("room", room.id, 1, room.supplier_id);
          if (matchPricing.length) {
            const totalPrice = matchPricing
              .map(pricing => pricing.total_price)
              .reduce((a, b) => a + b);

            return {
              ...room,
              pricing: matchPricing,
              total_price: totalPrice
            };
          }

          return {
            ...room
          };
        })
        .sort((a, b) => (a.total_price > b.total_price ? 1 : -1));
    }
  );

export const makeGetRoomById = () =>
  createSelector([makeGetRooms()], data => roomId =>
    data.find(room => room.id === roomId)
  );

export const makeGetSelectedRooms = () =>
  createSelector(
    [makeGetRoomById(), selectedRooms],
    (roomById, selectedData) => {
      return selectedData
        .filter(selected => Boolean(roomById(selected.id)))
        .map(selected => {
          const selectedRoom = roomById(selected.id);
          return {
            ...selectedRoom,
            ...selected,
            total_price: selectedRoom
              ? selectedRoom.total_price * selected.qty
              : 0
          };
        });
    }
  );

export const makeGetSelectedRoomById = () =>
  createSelector([makeGetSelectedRooms()], selectedData => roomId =>
    selectedData.find(selected => selected.id === roomId)
  );
