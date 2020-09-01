import React from "react";
import { Box } from "@material-ui/core";

export default function NotFound() {
  return (
    <Box
      display="flex"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <h5>Oops, the page not found</h5>
    </Box>
  );
}
