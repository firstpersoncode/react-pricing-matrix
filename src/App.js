import React from "react";
import {
  Container,
  Box,
  Breadcrumbs,
  Link as MuiLink
} from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Book from "./pages/Book";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Router>
      <Container maxWidth="lg">
        <Box p={3}>
          <Breadcrumbs aria-label="breadcrumb">
            <MuiLink component={Link} color="inherit" to="/">
              Resources
            </MuiLink>
            <MuiLink component={Link} color="inherit" to="/book">
              Book
            </MuiLink>
          </Breadcrumbs>
        </Box>
        <Box px={3}>
          <Switch>
            <Route path="/book">
              <Book />
            </Route>
            <Route exact path="/">
              <Dashboard />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </Box>
      </Container>
    </Router>
  );
}
