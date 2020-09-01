import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Box,
  IconButton
} from "@material-ui/core";

import { Close } from "@material-ui/icons";

export default function Modal({
  open,
  actions,
  children,
  title,
  onClose,
  maxWidth
}) {
  return (
    <Dialog fullWidth maxWidth={maxWidth || "md"} open={open} onClose={onClose}>
      <Box position="relative">
        <Box position="absolute" top={0} right={0}>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        {title ? <DialogTitle>{title}</DialogTitle> : null}
        <DialogContent>
          <Box py={3}>{children}</Box>
        </DialogContent>
        {actions && actions.length ? (
          <DialogActions>{actions}</DialogActions>
        ) : null}
      </Box>
    </Dialog>
  );
}
