import React from "react";
import {
  Box,
  Container,
  Button,
  TextField,
  List,
  ListItem,
  Typography,
  makeStyles,
  Link,
} from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfig";
import { useLocation, useHistory } from "react-router";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import moment from "moment";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";

function createData(name, Bid, date, statues) {
  return { name, Bid, date, statues };
}
const useStyles = makeStyles((theme) => ({
  LoginBox: {
    "& h6": {
      fontWeight: "bold",
      marginBottom: "10px",
      "& span": {
        fontWeight: "300",
      },
    },
  },
  TokenBox: {
    border: "solid 0.5px #e5e3dd",
    padding: "5px",
  },
  labelText: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#000",
  },
  histortable: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
  },
  table: {
    background: " #f9f9f9",
    "& td": {
      border: "none",
    },
  },
  Paper: {
    boxShadow: "none",
  },
  btnBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
    "& button": {
      width: "180px ",
      maxWidth: "100%",
      [theme.breakpoints.down("sm")]: {
        marginLeft: "0 !important",
        marginBottom: "15px",
        width: "100%",
      },
    },
  },
}));
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Login({ data, auctionDetails }) {
  const classes = useStyles();
  const [errpopup, seterrpopup] = React.useState(false);
  const [errmsg, seterrmsg] = React.useState("");
  const history = useHistory();
  const [severity, setSeverity] = React.useState("error");
  const [isUpdateDelete, setIsUpdateDelete] = React.useState(false);
  const [isUpdateStop, setIsUpdateStop] = React.useState(false);
  const errhandleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    seterrpopup(false);
  };

  const stopAuctionHandler = async () => {
    setIsUpdateStop(true);
    axios({
      method: "PUT",
      url: Apiconfigs.stoporder,
      headers: {
        token: window.sessionStorage.getItem("AccessToken"),
      },
      params: {
        _id: auctionDetails._id,
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          setSeverity("success");
          seterrpopup(true);
          seterrmsg(res.data.responseMessage);
        } else {
          setSeverity("error");
          seterrpopup(true);
          seterrmsg(res.data.responseMessage);
        }
        setIsUpdateStop(false);
      })
      .catch((err) => {
        setIsUpdateStop(false);

        setSeverity("error");
        seterrpopup(true);
        if (err.response) {
          seterrmsg(err.response.data.responseMessage);
        } else {
          seterrmsg(err.message);
        }
        console.log(err.message);
      });
  };
  const deleteAuctionHandler = async () => {
    setIsUpdateDelete(true);
    axios({
      method: "DELETE",
      url: Apiconfigs.deleteorder,
      headers: {
        token: window.sessionStorage.getItem("AccessToken"),
      },
      params: {
        _id: auctionDetails.orderId._id,
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          history.push("/setting");
          setSeverity("success");
          seterrpopup(true);
          seterrmsg(res.data.responseMessage);
        } else {
          setSeverity("error");
          seterrpopup(true);
          seterrmsg(res.data.responseMessage);
        }
        setIsUpdateDelete(false);
      })
      .catch((err) => {
        setIsUpdateDelete(false);
        setSeverity("error");
        seterrpopup(true);
        if (err.response) {
          seterrmsg(err.response.data.responseMessage);
        } else {
          seterrmsg(err.message);
        }
        console.log(err.message);
      });
  };
  return (
    <Box className={classes.LoginBox}>
      <Container maxWidth="lg">
        <label className={classes.labelText}>History:</label>
        {data && data.length > 0 ? (
          <Box className={classes.histortable}>
            <TableContainer className={classes.Paper} component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {/* <TableCell align='Center'>Name</TableCell> */}
                    <TableCell align="Center">Bid</TableCell>
                    <TableCell align="Center">Date</TableCell>
                    <TableCell align="Center">Statues</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row) => (
                    <TableRow key={row.name}>
                      {/* <TableCell align='Center'>{row.name}</TableCell> */}
                      <TableCell align="Center">{row.bid}</TableCell>
                      <TableCell align="Center">
                        {moment(row.date).format("DD-MM-YYYY hh:mm A")}
                      </TableCell>
                      <TableCell align="Center">{row.bidStatus}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : (
          <Box align="center" mt={4} mb={5}>
            <Typography
              // variant='h1'
              style={{ color: "#000", marginBottom: "10px" }}
            >
              NO DATA FOUND!!
            </Typography>
            {/* <img src='images/noresult.png' /> */}
          </Box>
        )}
      </Container>

      <Snackbar
        open={errpopup}
        autoHideDuration={6000}
        onClose={errhandleClose}
      >
        <Alert onClose={errhandleClose} severity={severity}>
          {errmsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
