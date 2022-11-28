import React, { useContext } from "react";
import {
  Box,
  Container,
  Button,
  TextField,
  Typography,
  makeStyles,
  Grid,
  Link,
} from "@material-ui/core";
import Tokens from "./Tokens";
import Fees from "./Fees";
import Moderators from "./Moderators";
import Reports from "./Reports";
import Auction from "./Auction";
import { AuthContext } from "src/context/Auth";
const useStyles = makeStyles((theme) => ({
  LoginBox: {
    paddingTop: "110px",
    paddingBottom: "50px",
    minHeight: "calc(100vh - 201px)",
  },
  websiteButton: {
    border: "solid 0.5px #707070",
    backgroundColor: "#fff",
    textAlign: "center",
    fontSize: "17.5px",
    color: "#141518",
    width: "100%",
    borderRadius: "0",
  },
}));

export default function Login() {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  return (
    <Box className={classes.LoginBox}>
      {/* <Tokens /> */}
      <Fees />
      {/* <Moderators /> */}
      {auth.permissions?.viewAndBlockMessages && <Reports />}
      <Auction />
      {/* <Container maxWidth='xl'>
        <Box className='5'>
          <Grid container>
            <Grid item xs='12' md='4'>
              <Button className={classes.websiteButton}>restart website</Button>
            </Grid>
            <Grid item xs='12' md='4'>
              <Button className={classes.websiteButton}>
                shutdown website
              </Button>
            </Grid>
            <Grid item xs='12' md='4'>
              <Button className={classes.websiteButton}>start website</Button>
            </Grid>
          </Grid>
        </Box>
      </Container> */}
    </Box>
  );
}
