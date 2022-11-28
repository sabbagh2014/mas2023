import React, { useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Link, useHistory } from "react-router-dom";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {
  Box,
  Button,
  Typography,
  Dialog,
  Slide,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
// import { Link } from "react-router-dom";
import BlockIcon from "@material-ui/icons/Block";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Apiconfig from "src/Apiconfig/Apiconfig";

import axios from "axios";

function createData(title, description) {
  return { title, description };
}

const rows = [
  createData(
    "Disclaimer",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate."
  ),
  createData(
    "Legal Notice",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate. "
  ),
  createData(
    "Terms & Conditions",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate,"
  ),
  createData(
    "Privacy & policy",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, "
  ),
  createData(
    "Cookies Policy",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate."
  ),
];
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
  table: {
    minWidth: 400,
  },
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: "#e0e0e0",
    },
  },

  button: {
    minWidth: "initial",
    padding: "6px",
    marginLeft: "7px",
  },
  btn: {
    color: "white",
    backgroundColor: "#1273eb",
  },
});

export default function Index() {
  const classes = useStyles();
  const history = useHistory();
  const [userlist, setuserlist] = React.useState([]);
  const accessToken = window.sessionStorage.getItem("AccessToken");
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // useEffect(() => {
  //   TermCondition();
  // }, []);

  // const TermCondition = async () => {
  //   await axios
  //     .get(Apiconfig.listStaticContent, {
  //       headers: {
  //         token: `${accessToken}`,
  //       },
  //     })

  //     .then(async (res) => {
  //       console.log(res);
  //       if (res.data.response_code === 200) {
  //         // const result = res.data.result.filter(
  //         // (data) => data.userType != "ADMIN"
  //         // );
  //         setuserlist(res.data.result);
  //         // setNumpages(res.data.result.pages);
  //       } else if (res.data.response_code === 404) {
  //         console.log("Not found.");
  //       }
  //     });
  // };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <Box pl={5} mt={4}>
          {" "}
          <Typography variant="h3" style={{ fontWeight: "1000" }}>
            {" "}
            Static Content Management
          </Typography>{" "}
        </Box>
        <Box style={{ marginTop: "34px" }} pr={4}>
          {" "}
          <Link style={{ textDecoration: "none" }} to="/Add-Content">
            {" "}
            <Button type="submit" className={classes.btn} variant="contained">
              Add New
            </Button>{" "}
          </Link>{" "}
        </Box>
      </Box>
      {/* <Box pl={5} mt={4}> <Typography variant="h3" style={{fontWeight:"1000"}}>  Static Content Management </Typography> </Box>
       */}

      <Box mt={4} ml={4} mr={4}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ color: "white", backgroundColor: "#252d47" }}
                  align="left"
                >
                  ID
                </TableCell>
                <TableCell
                  style={{
                    color: "white",
                    backgroundColor: "#252d47",
                    minWidth: "400px",
                  }}
                >
                  Type
                </TableCell>
                <TableCell
                  style={{ color: "white", backgroundColor: "#252d47" }}
                >
                  Title
                </TableCell>
                {/* <TableCell
                  style={{
                    color: "white",
                    backgroundColor: "#252d47",
                    minWidth: "400px",
                  }}
                >
                  Description
                </TableCell> */}

                <TableCell
                  style={{ color: "white", backgroundColor: "#252d47" }}
                  align="center"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      </Box>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete the content?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Yes
          </Button>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
