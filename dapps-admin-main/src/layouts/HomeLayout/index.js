import React from "react";
import { makeStyles } from "@material-ui/core";
import TopBar from "./TopBar";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fff",
  },
  MainLayout: {
    minHeight: "calc(100vh - 415px)",
  },
}));

const MainLayout = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <TopBar />

      <div className={classes.MainLayout}>{children}</div>
    </div>
  );
};

export default MainLayout;
