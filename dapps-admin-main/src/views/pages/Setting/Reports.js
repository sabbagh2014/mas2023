import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Button,
  TextField,
  Typography,
  Grid,
  makeStyles,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import Apiconfigs from "src/Apiconfig/Apiconfig";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import axios from "axios";
import { sortAddress } from "src/utils";

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
  report: {
    borderBottom: "solid 0.5px #e5e3dd",
    padding: "8px",
    "& h5": {
      fontSize: "18px",
      color: "#141518",
    },
  },
  root: {
    display: "flex",
    justifyContent: "right",
    width: "100%",
    "& > *": {
      marginTop: theme.spacing(2),
    },
  },

  btnBox: {
    display: "flex",
    alignItems: "center",
  },
  MainRectangle: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "10px",
  },
  Rectangle: {
    width: "27.5px",
    height: "27.5px",
    border: "solid 0.5px #d15b5b",
    backgroundColor: "#792034",
    textAlign: "center",
    justifyContent: "center",
    color: "white",
    padding: "5px",
    margin: "10px",
    float: "right",
  },
  Pageno: {
    display: "flex",
    margin: "10px",
    alignItems: "center",
    justifyContent: "center",
  },
}));
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Login() {
  const classes = useStyles();
  const history = useHistory();
  const [list, setlist] = useState();
  const [errpopup, seterrpopup] = useState(false);
  const [errmsg, seterrmsg] = useState("");
  const [severity, setSeverity] = useState("error");
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState(1);
  const errhandleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    seterrpopup(false);
  };
  const delrep = async (id) => {
    console.log(id);
    axios({
      method: "DELETE",
      url: Apiconfigs.delreport,
      headers: {
        token: window.sessionStorage.getItem("AccessToken"),
      },
      params: {
        _id: id,
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          listing();
          setSeverity("info");
          seterrpopup(true);
          seterrmsg(res.data.responseMessage);
        } else {
          setSeverity("error");
          seterrpopup(true);
          seterrmsg(res.data.responseMessage);
        }
      })
      .catch((err) => {
        setSeverity("error");
        seterrpopup(true);
        if (err.response) {
          seterrmsg(err.response.data.responseMessage);
        } else {
          seterrmsg(err.message);
        }
      });
  };
  const listing = async () => {
    axios({
      method: "GET",
      url: Apiconfigs.report,
      params: {
        page: page,
        limit: 5,
      },
      headers: {
        token: window.sessionStorage.getItem("AccessToken"),
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          if (res.data.result.docs) {
            setlist(res.data.result.docs);
            setNoOfPages(res.data.result.pages);
          } else {
            setlist([]);
          }
        } else {
          setlist([]);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    listing();
  }, [page]);

  return (
    <Box className={classes.LoginBox} mt={3}>
      <Container maxWidth="xl">
        <Box>
          <Typography variant="h6">Reports:</Typography>
          <Box className={classes.TokenBox} mb={4}>
            <Box className={classes.report}>
              {list?.map((data, i) => {
                var d = data.chatId._id;
                return (
                  <Grid key={i} container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <Typography variant="h5">
                        {data.userId.userName
                          ? data.userId.userName
                          : data.userId.userType === "User"
                          ? sortAddress(data.userId.walletAddress)
                          : sortAddress(data.userId.ethAccount.address)}{" "}
                        has reports a chat
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Button
                        variant="contained"
                        size="large"
                        color="primery"
                        className="btn-block btnWidth removeredius"
                        onClick={() => delrep(data._id)}
                      >
                        Delete report
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Button
                        variant="contained"
                        size="large"
                        color="secondary"
                        onClick={() => {
                          history.push({
                            pathname: "/chat",
                            search: d,
                            hash: data._id,
                          });
                        }}
                        to="/chat"
                        className="btn-block btnWidth removeredius"
                      >
                        Check messages
                      </Button>
                    </Grid>
                  </Grid>
                );
              })}
            </Box>
            {list && list.length === 0 && (
              <Box textAlign={"center"} mt={3} mb={3}>
                <Typography textAlign={"center"}>Data not found</Typography>
              </Box>
            )}
          </Box>
          <div className={classes.MainRectangle}>
            <span className={classes.Pageno}>
              {page} of {noOfPages}
            </span>
            <div>
              {Array.from({ length: parseInt(noOfPages) }).map((data, i) => {
                let value = noOfPages - i;
                return (
                  <div
                    onClick={() => setPage(value)}
                    className={classes.Rectangle}
                    key={i}
                  >
                    <span>{value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Box>
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
