import React, { useState } from "react";
import moment from "moment";
import { bindActionCreators } from "redux";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Grid,
  Card,
  CardActionArea,
  Button,
  Divider
} from "@material-ui/core";
import { Add, Remove } from "@material-ui/icons";

import { setData as setDetailsData } from "../store/reducers/details/actions";
import { setSelected as setActivitiesSelectedData } from "../store/reducers/activities/actions";
import { setSelected as setRoomsSelectedData } from "../store/reducers/rooms/actions";

import {
  makeGetSuppliers,
  makeGetSelectedSupplier
} from "../store/reducers/suppliers/selectors";
import {
  makeGetActivities,
  makeGetSelectedActivities,
  makeGetSelectedActivityById
} from "../store/reducers/activities/selectors";
import {
  makeGetRooms,
  makeGetSelectedRooms,
  makeGetSelectedRoomById
} from "../store/reducers/rooms/selectors";
import { makeGetTotalDays } from "../store/reducers/details/selectors";
import { makeGetSelectedSeasons } from "../store/reducers/seasons/selectors";

import DatePicker from "../components/DatePicker";
import BookActivityCard from "../components/BookActivityCard";
import BookRoomCard from "../components/BookRoomCard";
import Modal from "../components/Modal";

export default function Book() {
  const getSuppliers = makeGetSuppliers();
  const getSelectedSupplier = makeGetSelectedSupplier();
  const getActivities = makeGetActivities();
  const getSelectedActivities = makeGetSelectedActivities();
  const getSelectedActivity = makeGetSelectedActivityById();
  const getRooms = makeGetRooms();
  const getSelectedRooms = makeGetSelectedRooms();
  const getSelectedRoom = makeGetSelectedRoomById();
  const getTotalDays = makeGetTotalDays();
  const getSelectedSeasons = makeGetSelectedSeasons();

  const {
    suppliers,
    selectedSupplier,
    details,
    activities,
    selectedActivities,
    selectedActivityById,
    rooms,
    selectedRooms,
    selectedRoomById,
    totalDays,
    selectedSeasons
  } = useSelector(state => ({
    suppliers: getSuppliers(state),
    selectedSupplier: getSelectedSupplier(state),
    details: state.details,
    activities: getActivities(state),
    selectedActivities: getSelectedActivities(state),
    selectedActivityById: getSelectedActivity(state),
    rooms: getRooms(state),
    selectedRooms: getSelectedRooms(state),
    selectedRoomById: getSelectedRoom(state),
    totalDays: getTotalDays(state),
    selectedSeasons: getSelectedSeasons(state)
  }));

  const dispatch = useDispatch();
  const {
    setDetails,
    setActivitiesSelected,
    setRoomsSelected
  } = bindActionCreators(
    {
      setDetails: setDetailsData,
      setActivitiesSelected: setActivitiesSelectedData,
      setRoomsSelected: setRoomsSelectedData
    },
    dispatch
  );

  const handleUpdateDetails = (key, value) => {
    if (key === "supplier_id") {
      value = parseInt(value);
    }
    setDetails(key, value);
  };

  const addActivityQty = id => () => {
    const selected = selectedActivityById(id);

    setActivitiesSelected({
      id,
      qty: Boolean(selected) ? selected.qty + 1 : 1
    });
  };

  const subtractActivityQty = id => () => {
    const selected = selectedActivityById(id);

    if (Boolean(selected)) {
      setActivitiesSelected({
        id: selected.id,
        qty: selected.qty - 1
      });
    }
  };

  const addRoomQty = id => () => {
    const selected = selectedRoomById(id);

    setRoomsSelected({
      id,
      qty: Boolean(selected) ? selected.qty + 1 : 1
    });
  };

  const subtractRoomQty = id => () => {
    const selected = selectedRoomById(id);

    if (Boolean(selected)) {
      setRoomsSelected({
        id: selected.id,
        qty: selected.qty - 1
      });
    }
  };

  const getTotalPrice = () => {
    const activitiesPrice = selectedActivities.length
      ? selectedActivities
          .map(activity => activity.total_price)
          .reduce((a, b) => a + b)
      : 0;

    const roomsPrice = selectedRooms.length
      ? selectedRooms.map(room => room.total_price).reduce((a, b) => a + b)
      : 0;

    return activitiesPrice + roomsPrice;
  };

  const [dialogSeasons, setDialogSeasons] = useState(false);

  const toggleDialogSeasons = () => {
    setDialogSeasons(!dialogSeasons);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={8} lg={8}>
        <Box bgcolor="grey.50" p={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <DatePicker
                label="Departure"
                value={details.from_date}
                onChange={date => handleUpdateDetails("from_date", date)}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <DatePicker
                label="Return"
                value={details.to_date}
                onChange={date => handleUpdateDetails("to_date", date)}
              />
            </Grid>
          </Grid>
        </Box>
        {suppliers.length ? (
          <Box my={3} bgcolor="grey.50" p={3}>
            <h1>Select resort</h1>
            <Grid container spacing={3}>
              {suppliers.map((supplier, i) => (
                <Grid key={i} item xs={12} sm={12} md={6} lg={4}>
                  <Card>
                    <CardActionArea
                      onClick={() =>
                        handleUpdateDetails("supplier_id", supplier.id)
                      }
                    >
                      <Box
                        p={3}
                        bgcolor={
                          parseInt(details.supplier_id) ===
                          parseInt(supplier.id)
                            ? "#ffe2cc"
                            : "white"
                        }
                      >
                        <h3>{supplier.name}</h3>
                      </Box>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : null}

        {totalDays && details.supplier_id ? (
          <>
            {activities.length ? (
              <Box my={3} bgcolor="grey.50" p={3}>
                <h1>Select activity(s)</h1>
                <Grid container spacing={3}>
                  {activities.map((activity, i) => (
                    <Grid key={i} item xs={12} sm={12} md={6} lg={6}>
                      <BookActivityCard activity={activity}>
                        <Box
                          display="flex"
                          justifyContent="flex-end"
                          alignItems="center"
                        >
                          {Boolean(selectedActivityById(activity.id)) ? (
                            <>
                              <Button
                                variant="contained"
                                style={{ minWidth: 0, width: 40, height: 40 }}
                                color="primary"
                                size="small"
                                onClick={subtractActivityQty(activity.id)}
                              >
                                <Remove />
                              </Button>
                              <Box p={2}>
                                {selectedActivityById(activity.id).qty} pax
                              </Box>
                              <Button
                                variant="contained"
                                style={{ minWidth: 0, width: 40, height: 40 }}
                                color="primary"
                                size="small"
                                onClick={addActivityQty(activity.id)}
                              >
                                <Add />
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={addActivityQty(activity.id)}
                              startIcon={<Add />}
                            >
                              Add
                            </Button>
                          )}
                        </Box>
                      </BookActivityCard>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : null}

            {rooms.length ? (
              <Box my={3} bgcolor="grey.50" p={3}>
                <h1>Select room(s)</h1>
                <Grid container spacing={3}>
                  {rooms.map((room, i) => (
                    <Grid key={i} item xs={12} sm={12} md={6} lg={6}>
                      <BookRoomCard room={room}>
                        <Box
                          display="flex"
                          justifyContent="flex-end"
                          alignItems="center"
                        >
                          {Boolean(selectedRoomById(room.id)) ? (
                            <>
                              <Button
                                variant="contained"
                                style={{ minWidth: 0, width: 40, height: 40 }}
                                color="primary"
                                size="small"
                                onClick={subtractRoomQty(room.id)}
                              >
                                <Remove />
                              </Button>
                              <Box p={2}>
                                {selectedRoomById(room.id).qty}{" "}
                                {selectedRoomById(room.id).qty > 1
                                  ? "rooms"
                                  : "room"}
                              </Box>
                              <Button
                                variant="contained"
                                style={{ minWidth: 0, width: 40, height: 40 }}
                                color="primary"
                                size="small"
                                onClick={addRoomQty(room.id)}
                              >
                                <Add />
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={addRoomQty(room.id)}
                              startIcon={<Add />}
                            >
                              Add
                            </Button>
                          )}
                        </Box>
                      </BookRoomCard>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : null}
          </>
        ) : null}
      </Grid>

      <Grid item xs={12} sm={12} md={4} lg={4}>
        <Card>
          <Box p={3}>
            {totalDays && details.supplier_id ? (
              <>
                <h2>{selectedSupplier.name}</h2>
                <p>
                  {moment(details.from_date, "YYYY-MM-DD").format("D MMM YYYY")}{" "}
                  - {moment(details.to_date, "YYYY-MM-DD").format("D MMM YYYY")}{" "}
                  / <strong>{totalDays} days</strong>
                </p>

                {selectedSeasons.length ? (
                  <>
                    <Button color="primary" onClick={toggleDialogSeasons}>
                      <strong>See included seasons</strong>
                    </Button>
                    <Modal
                      maxWidth="sm"
                      open={dialogSeasons}
                      onClose={toggleDialogSeasons}
                    >
                      <p>
                        Departure at{" "}
                        {moment(details.from_date, "YYYY-MM-DD").format(
                          "D MMM YYYY"
                        )}
                      </p>
                      <p>
                        Return at{" "}
                        {moment(details.to_date, "YYYY-MM-DD").format(
                          "D MMM YYYY"
                        )}
                      </p>

                      <p>
                        Total days: <strong>{totalDays} days</strong>
                      </p>
                      <h3>Included</h3>
                      <ul>
                        {selectedSeasons.map((season, i) => (
                          <li key={i}>
                            <h4>
                              <strong>{season.name}</strong>{" "}
                              <small style={{ fontWeight: "normal" }}>
                                (
                                {moment(season.from, "YYYY-MM-DD").format(
                                  "D MMM YYYY"
                                )}{" "}
                                -{" "}
                                {moment(season.to, "YYYY-MM-DD").format(
                                  "D MMM YYYY"
                                )}
                                )
                              </small>
                            </h4>

                            <p>
                              Total days within selected dates:{" "}
                              <strong>{season.total_days} days</strong>
                            </p>
                          </li>
                        ))}
                      </ul>
                    </Modal>
                  </>
                ) : null}
                <Divider />
                {selectedActivities.length ? (
                  <>
                    <h3>Activities:</h3>
                    <ul>
                      {selectedActivities.map((activity, i) => (
                        <li key={i}>
                          <Box display="flex">
                            <Box minWidth={30}>
                              <strong>{activity.qty} X</strong>
                            </Box>
                            <Box flexGrow={1}>{activity.name}</Box>
                            <p style={{ marginTop: 0 }}>
                              <strong>US${activity.total_price}</strong>
                            </p>
                          </Box>
                        </li>
                      ))}
                    </ul>
                    <Divider />
                  </>
                ) : null}
                {selectedRooms.length ? (
                  <>
                    <h3>Rooms:</h3>
                    <ul>
                      {selectedRooms.map((room, i) => (
                        <li key={i}>
                          <Box display="flex">
                            <Box minWidth={30}>
                              <strong>{room.qty} X</strong>
                            </Box>
                            <Box flexGrow={1}>{room.name}</Box>
                            <p style={{ marginTop: 0 }}>
                              <strong>US${room.total_price}</strong>
                            </p>
                          </Box>
                        </li>
                      ))}
                    </ul>
                    <Divider />
                  </>
                ) : null}
                <Box display="flex" justifyContent="space-between">
                  <h3>Total:</h3>
                  <h3>US${getTotalPrice()}</h3>
                </Box>
              </>
            ) : (
              <p>Select booking dates and supplier</p>
            )}
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}
