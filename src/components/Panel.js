import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Tab, Tabs, Typography, Box } from "@material-ui/core";
import { Storage } from "@material-ui/icons";

export function TabPanel({ children, title, active, index, ...other }) {
  return (
    <div
      className="tab-panel"
      role="tabpanel"
      hidden={active !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {active === index && children}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: "flex",
    border: `1px solid ${theme.palette.divider}`,
    // height: 224
    "& .tab-panel": {
      // overflowY: "auto",
      flexGrow: 1
    }
  },
  tabs: {
    backgroundColor: theme.palette.grey[200]
  }
}));

export default function Panel({ children, tabs }) {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        color="white"
        bgcolor="primary.main"
        p={2}
      >
        <Storage />
        <Box ml={2}>
          <Typography variant="h4">Resources</Typography>
        </Box>
      </Box>
      <Box className={classes.root}>
        <Tabs
          orientation="vertical"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          className={classes.tabs}
        >
          {tabs.map((tab, i) => (
            <Tab key={i} label={tab} {...a11yProps(i)} />
          ))}
        </Tabs>
        {children(value)}
      </Box>
    </>
  );
}
