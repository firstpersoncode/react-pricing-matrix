import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Box
} from "@material-ui/core";

export default function Modal({ open, actions, children, title, onClose }) {
  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      {title ? <DialogTitle>{title}</DialogTitle> : null}
      <DialogContent>
        <Box>{children}</Box>
      </DialogContent>
      {actions && actions.length ? (
        <DialogActions>{actions}</DialogActions>
      ) : null}
    </Dialog>
  );
}
