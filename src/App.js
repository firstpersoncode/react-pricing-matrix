import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Container, Button } from "@material-ui/core";

import useSupplierState from "./hooks/useSupplierState";
import useActivityState from "./hooks/useActivityState";
import useRoomState from "./hooks/useRoomState";
import useSeasonState from "./hooks/useSeasonState";

import Panel, { TabPanel } from "./components/Panel";
import TablePanel from "./components/TablePanel";

function useAppState() {
  return useSelector(state => ({
    matrix: state.matrix.data
  }));
}

function App() {
  const { matrix } = useAppState();

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
  } = useSupplierState();

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
  } = useActivityState();

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
  } = useRoomState();

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
  } = useSeasonState();

  return (
    <Container maxWidth="lg">
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
                headers={["id", "name", "dive", "last_update"]}
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
                headers={["id", "name", "occupancy", "last_update"]}
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
                  "name",
                  "from",
                  "to",
                  "supplier_id",
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
    </Container>
  );
}

export default App;
