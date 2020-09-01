import React, { useEffect } from "react";
import { bindActionCreators } from "redux";
import { useSelector, useDispatch } from "react-redux";
import { Container, Button } from "@material-ui/core";

import { setData as setDetailsData } from "../store/reducers/details/actions";

import useDashboardSupplierState from "../hooks/useDashboardSupplierState";
import useDashboardActivityState from "../hooks/useDashboardActivityState";
import useDashboardRoomState from "../hooks/useDashboardRoomState";
import useDashboardSeasonState from "../hooks/useDashboardSeasonState";

import Panel, { TabPanel } from "../components/Panel";
import TablePanel from "../components/TablePanel";

export default function Dashboard() {
  const { details } = useSelector(state => ({
    details: state.details
  }));
  const dispatch = useDispatch();
  const { setDetails } = bindActionCreators(
    { setDetails: setDetailsData },
    dispatch
  );
  useEffect(() => {
    if (details.supplier_id) {
      setDetails("supplier_id", 0);
    }
  });

  const {
    suppliers,
    toggleDialogAddSupplier,
    toggleDialogEditSupplier,
    toggleDialogDeleteSupplier,
    dialogAddSupplier,
    dialogEditSupplier,
    dialogDeleteSupplier,
    submitSupplierData,
    updateSupplierData,
    deleteSupplierData,
    updateSupplierFields,
    supplierFields,
    selectedSupplierId
  } = useDashboardSupplierState();

  const {
    activities,
    toggleDialogAddActivity,
    toggleDialogEditActivity,
    toggleDialogDeleteActivity,
    dialogAddActivity,
    dialogEditActivity,
    dialogDeleteActivity,
    submitActivityData,
    updateActivityData,
    deleteActivityData,
    updateActivityFields,
    activityFields,
    selectedActivityId
  } = useDashboardActivityState();

  const {
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
  } = useDashboardRoomState();

  const {
    seasons,
    toggleDialogAddSeason,
    toggleDialogEditSeason,
    toggleDialogDeleteSeason,
    dialogAddSeason,
    dialogEditSeason,
    dialogDeleteSeason,
    submitSeasonData,
    updateSeasonData,
    deleteSeasonData,
    updateSeasonFields,
    seasonFields,
    selectedSeasonId
  } = useDashboardSeasonState();

  return (
    <Panel tabs={["Suppliers", "Activities", "Rooms", "Seasons"]}>
      {active => (
        <>
          <TabPanel title="Suppliers" active={active} index={0}>
            <TablePanel
              name="Supplier"
              headers={["id", "name", "last_update"]}
              rows={suppliers}
              fields={[
                ...Object.keys(supplierFields).map(field => ({
                  name: field,
                  value: supplierFields[field],
                  label: field,
                  type: field === "archived" ? "checkbox" : "text"
                }))
              ]}
              selectedId={selectedSupplierId}
              dialog={{
                add: dialogAddSupplier,
                edit: dialogEditSupplier,
                delete: dialogDeleteSupplier
              }}
              onAdd={toggleDialogAddSupplier}
              onEdit={toggleDialogEditSupplier}
              onDelete={toggleDialogDeleteSupplier}
              onSubmitAdd={submitSupplierData}
              onSubmitEdit={updateSupplierData}
              onSubmitDelete={deleteSupplierData}
              onChangeFields={updateSupplierFields}
            />
          </TabPanel>
          <TabPanel title="Activities" active={active} index={1}>
            <TablePanel
              name="Activity"
              headers={["id", "supplier_id", "name", "dive", "last_update"]}
              rows={activities}
              fields={[
                ...Object.keys(activityFields).map(field => ({
                  name: field,
                  value: activityFields[field],
                  label: field,
                  type:
                    field === "supplier_id"
                      ? "select"
                      : field === "matrix"
                      ? "matrix"
                      : field === "archived"
                      ? "checkbox"
                      : field === "dive"
                      ? "number"
                      : "text",
                  ...(field === "supplier_id"
                    ? {
                        options: suppliers.map(supplier => ({
                          value: supplier.id,
                          text: supplier.name
                        }))
                      }
                    : field === "matrix"
                    ? {
                        options: seasons.map(season => ({
                          value: season.id,
                          text: season.name,
                          supplier_id: season.supplier_id
                        }))
                      }
                    : {})
                }))
              ]}
              selectedId={selectedActivityId}
              dialog={{
                add: dialogAddActivity,
                edit: dialogEditActivity,
                delete: dialogDeleteActivity
              }}
              onAdd={toggleDialogAddActivity}
              onEdit={toggleDialogEditActivity}
              onDelete={toggleDialogDeleteActivity}
              onSubmitAdd={submitActivityData}
              onSubmitEdit={updateActivityData}
              onSubmitDelete={deleteActivityData}
              onChangeFields={updateActivityFields}
            />
          </TabPanel>
          <TabPanel title="Rooms" active={active} index={2}>
            <TablePanel
              name="Room"
              headers={[
                "id",
                "supplier_id",
                "name",
                "occupancy",
                "last_update"
              ]}
              rows={rooms}
              fields={[
                ...Object.keys(roomFields).map(field => ({
                  name: field,
                  value: roomFields[field],
                  label: field,
                  type:
                    field === "supplier_id"
                      ? "select"
                      : field === "matrix"
                      ? "matrix"
                      : field === "archived"
                      ? "checkbox"
                      : field === "occupancy"
                      ? "number"
                      : "text",
                  ...(field === "supplier_id"
                    ? {
                        options: suppliers.map(supplier => ({
                          value: supplier.id,
                          text: supplier.name
                        }))
                      }
                    : field === "matrix"
                    ? {
                        options: seasons.map(season => ({
                          value: season.id,
                          text: season.name,
                          supplier_id: season.supplier_id
                        }))
                      }
                    : {})
                }))
              ]}
              selectedId={selectedRoomId}
              dialog={{
                add: dialogAddRoom,
                edit: dialogEditRoom,
                delete: dialogDeleteRoom
              }}
              onAdd={toggleDialogAddRoom}
              onEdit={toggleDialogEditRoom}
              onDelete={toggleDialogDeleteRoom}
              onSubmitAdd={submitRoomData}
              onSubmitEdit={updateRoomData}
              onSubmitDelete={deleteRoomData}
              onChangeFields={updateRoomFields}
            />
          </TabPanel>

          <TabPanel title="Seasons" active={active} index={3}>
            <TablePanel
              name="Season"
              headers={[
                "id",
                "supplier_id",
                "name",
                "from",
                "to",
                "last_update"
              ]}
              rows={seasons}
              fields={[
                ...Object.keys(seasonFields).map(field => ({
                  name: field,
                  value: seasonFields[field],
                  label: field,
                  type:
                    field === "supplier_id"
                      ? "select"
                      : field === "archived"
                      ? "checkbox"
                      : field === "from" || field === "to"
                      ? "date"
                      : "text",
                  ...(field === "supplier_id"
                    ? {
                        options: suppliers.map(supplier => ({
                          value: supplier.id,
                          text: supplier.name
                        }))
                      }
                    : {})
                }))
              ]}
              selectedId={selectedSeasonId}
              dialog={{
                add: dialogAddSeason,
                edit: dialogEditSeason,
                delete: dialogDeleteSeason
              }}
              onAdd={toggleDialogAddSeason}
              onEdit={toggleDialogEditSeason}
              onDelete={toggleDialogDeleteSeason}
              onSubmitAdd={submitSeasonData}
              onSubmitEdit={updateSeasonData}
              onSubmitDelete={deleteSeasonData}
              onChangeFields={updateSeasonFields}
            />
          </TabPanel>
        </>
      )}
    </Panel>
  );
}
