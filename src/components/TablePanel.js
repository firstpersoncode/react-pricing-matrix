import React, { useState } from "react";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableSortLabel,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  Fab,
  Button
} from "@material-ui/core";
import { Add, Edit, Delete, FilterList } from "@material-ui/icons";

import Modal from "./Modal";
import Form from "./Form";

const useStyles = makeStyles({
  container: {
    width: "100%",
    height: "100%"
  }
});

export default function TablePanel({
  name,
  headers,
  rows,
  onAdd,
  onEdit,
  onDelete,
  onSubmitAdd,
  onSubmitEdit,
  onSubmitDelete,
  onChangeFields,
  fields,
  selectedId,
  dialog
}) {
  const classes = useStyles();
  const [filter, setFilter] = useState({});
  const [filterBy, setFilterBy] = useState(null);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("last_update");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = property => event => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Box height="75vh">
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {headers.map((header, i) => (
                  <TableCell
                    key={i}
                    sortDirection={orderBy === header ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === header}
                      direction={orderBy === header ? order : "asc"}
                      onClick={handleRequestSort(header)}
                    >
                      <strong>{header.toUpperCase()}</strong>
                    </TableSortLabel>
                  </TableCell>
                ))}

                <TableCell align="right">
                  <IconButton>
                    <FilterList />
                  </IconButton>
                  <Fab onClick={onAdd} color="primary" size="small">
                    <Add />
                  </Fab>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTable(
                stableSort(rows, getComparator(order, orderBy)),
                filterBy
              )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => {
                  return (
                    <TableRow key={i}>
                      {headers.map((header, i) => (
                        <TableCell key={i}>
                          {header === "last_update"
                            ? moment(row[header]).format("YYYY-MM-DD HH:mm")
                            : String(row[header])}
                        </TableCell>
                      ))}
                      <TableCell align="right">
                        <IconButton onClick={() => onEdit(row.id)}>
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => onDelete(row.id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box bgcolor="grey.200">
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Box>
      </Box>

      <Modal
        maxWidth={name !== "Supplier" ? "lg" : "sm"}
        open={dialog.add}
        onClose={onAdd}
        actions={[
          <Button
            key="add"
            color="primary"
            variant="contained"
            onClick={onSubmitAdd}
          >
            Submit
          </Button>,
          <Button key="add-cancel" color="secondary" onClick={onAdd}>
            Close
          </Button>
        ]}
      >
        New {name}
        <Form
          onSubmit={onSubmitAdd}
          onChange={onChangeFields}
          fields={fields}
        />
      </Modal>

      <Modal
        maxWidth={name !== "Supplier" ? "lg" : "sm"}
        open={dialog.edit}
        onClose={() => onEdit()}
        actions={[
          <Button
            key="edit"
            color="primary"
            variant="contained"
            onClick={onSubmitEdit}
          >
            Submit
          </Button>,
          <Button key="edit-cancel" color="secondary" onClick={() => onEdit()}>
            Close
          </Button>
        ]}
      >
        Edit {name} ID: <strong>{selectedId}</strong>
        <Form
          onSubmit={onSubmitEdit}
          onChange={onChangeFields}
          fields={fields}
        />
      </Modal>

      <Modal
        maxWidth="sm"
        open={dialog.delete}
        onClose={() => onDelete()}
        actions={[
          <Button
            key="delete"
            color="secondary"
            variant="contained"
            onClick={onSubmitDelete}
          >
            Delete
          </Button>,
          <Button
            key="delete-cancel"
            color="secondary"
            onClick={() => onDelete()}
          >
            Close
          </Button>
        ]}
      >
        Delete {name} ID: <strong>{selectedId}</strong> ?
      </Modal>
    </>
  );
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function filteredTable(rows, filter, filterBy) {
  if (!filterBy) {
    return rows;
  }

  return rows.filter(row => {
    return row[filterBy] === filter[filterBy];
  });
}
