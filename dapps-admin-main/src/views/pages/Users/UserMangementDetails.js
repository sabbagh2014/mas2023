import {
  Button,
  Container,
  Grid,
  makeStyles,
  Typography,
  Box,
} from "@material-ui/core";
import React, { useState } from "react";
import UserDetails from "./UserDetails";
import ViewTransaction from "./viewUserTransaction";
import { useHistory, Link, useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  mainBox: {
    minHeight: "calc(100vh - 141px)",
    paddingTop: "100px",
    paddingBottom: "1rem",
  },
  btnbox1: {
    marginTop: "2rem",
    marginBottom: "2rem",
    "& button": {
      borderRadius: "10px",
      fontWeight: "600",
      fontSize: "14px",
      marginRight: "4px",
      "@media(max-width:767px)": {
        marginTop: "1rem",
      },
      "&.active": {
        color: "#fff",
        filter: "drop-shadow(0px 3px 3.5px rgba(0,0,0,0.16))",
        padding: "8px 22px",
        fontSize: "15px",
        background: "linear-gradient(180deg, #c04848 0%, #480048 100%)",
        borderRadius: "50px",
        "@media(max-width:767px)": {
          fontSize: "12px",
          color: "#fff",
          filter: "drop-shadow(0px 3px 3.5px rgba(0,0,0,0.16))",
          padding: "11px 22px",

          background: "linear-gradient(180deg, #c04848 0%, #480048 100%)",
          borderRadius: "50px",
        },
      },
    },
  },
}));

export default function UserMangementDetails() {
  const classes = useStyles();
  const location = useLocation();
  const [tabview, setTabView] = useState("Profile");

  return (
    <Box className={classes.mainBox}>
      <Container>
        <Box>
          <Typography variant="h3">User Management - User Details</Typography>
        </Box>
        <Grid container>
          <Grid>
            <Box className={classes.btnbox1}>
              <Button
                className={tabview === "Profile" ? "active" : ""}
                onClick={() => setTabView("Profile")}
              >
                General Information
              </Button>
              <Button
                className={tabview === "Transaction" ? "active" : ""}
                onClick={() => setTabView("Transaction")}
              >
                Transactions
              </Button>
            </Box>
          </Grid>
        </Grid>
        {tabview === "Profile" ? <UserDetails location={location} /> : ""}
        {tabview === "Transaction" ? (
          <ViewTransaction location={location} />
        ) : (
          ""
        )}
      </Container>
    </Box>
  );
}
