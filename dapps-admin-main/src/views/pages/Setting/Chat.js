import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Button,
  TextField,
  Typography,
  makeStyles,
  Grid,
} from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import Apiconfigs from "src/Apiconfig/Apiconfig";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Slide from "@material-ui/core/Slide";
import moment from "moment";
import PageLoading from "src/component/PageLoading";
import { sortAddress } from "src/utils";
const useStyles = makeStyles((theme) => ({
  LoginBox: {
    paddingTop: "50px",
    paddingBottom: "50px",
  },
  modaltitel: {
    fontSize: "30px",
    fontWeight: "600",
    marginBottom: "10px",
    textAlign: "center",
    color: "#141518",
    [theme.breakpoints.down("sm")]: {
      fontSize: "20px",
    },
  },
  input_fild: {
    backgroundColor: "#ffffff6e",
    borderRadius: "5.5px",
    border: " solid 0.5px #e5e3dd",
    color: "#141518",
    width: "100%",
    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "transparent",
      },
    },
    "& .MuiInputBase-input": {
      color: "#141518",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
      borderWidth: 0,
    },
  },
  paper: {
    maxWidth: "750px",
  },
  input_fild2: {
    width: "100%",
    "& input": {
      height: "45px",
    },
  },
}));
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export default function Login() {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [openBlock, setOpen1] = useState(false);
  const [chat, setchat] = useState([]);
  const [ids, setids] = useState("");
  const [idss, setidss] = useState("");
  const [errpopup, seterrpopup] = useState(false);
  const [errmsg, seterrmsg] = useState("");
  const [chatDetails, setChatDetails] = useState();
  const [severity, setSeverity] = useState("error");
  const [blockHours, setBlockHours] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [reportID, setReportID] = useState();
  const errhandleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    seterrpopup(false);
  };
  const [msg, setmsg] = useState(
    "Our policies don't agree with your ideas! So please check yourself."
  );
  const location = useLocation();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const warning = async (id) => {
    if (msg !== "" && reportID && id) {
      setIsLoading(true);
      axios({
        method: "POST",
        url: Apiconfigs.warning,
        headers: {
          token: window.sessionStorage.getItem("AccessToken"),
        },
        data: {
          text: msg,
          userId: id,
          chatId: location.search.substring(1, location.search.length),
          reportId: reportID,
        },
      })
        .then(async (res) => {
          setIsLoading(false);

          if (res.data.statusCode === 200) {
            setSeverity("info");
            seterrpopup(true);
            seterrmsg(res.data.responseMessage);
            handleClose();
            history.goBack();
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
          setIsLoading(false);
        });
    } else {
      setSeverity("error");
      seterrpopup(true);
      seterrmsg("Please enter message");
    }
  };

  const blockuser = async (id) => {
    if (msg !== "" && parseFloat(blockHours) > 0 && reportID) {
      setIsLoading(true);
      axios({
        method: "POST",
        url: Apiconfigs.blockuser,
        data: {
          _id: id,
          message: msg,
          time: blockHours,
          reportId: reportID,
        },
        headers: {
          token: window.sessionStorage.getItem("AccessToken"),
        },
      })
        .then(async (res) => {
          setIsLoading(false);
          if (res.data.statusCode === 200) {
            
            setSeverity("info");
            seterrpopup(true);
            seterrmsg(res.data.responseMessage);
            handleClose1();
            history.goBack();
          }
        })
        .catch((err) => {
          setIsLoading(false);
          
          setSeverity("error");
          seterrpopup(true);
          if (err.response) {
            seterrmsg(err.response.data.responseMessage);
          } else {
            seterrmsg(err.message);
          }
        });
    } else {
      setSeverity("error");
      seterrpopup(true);
      seterrmsg("Please enter valid data");
    }
  };
  const gethistory = async (id) => {
    setIsDataLoading(true);
    axios({
      method: "Post",
      url: Apiconfigs.chatlist,
      headers: {
        token: window.sessionStorage.getItem("AccessToken"),
      },
      data: {
        chatId: id,
      },
    })
      .then(async (res) => {
        setIsDataLoading(false);

        if (res.data.statusCode === 200) {
          setchat(res.data.result[0].messages);
          setids(res.data.result[0].messages[0].receiverId);
          setidss(res.data.result[0].senderId._id);
          setChatDetails(res.data.result[0]);
        }
      })
      .catch((err) => {
        setIsDataLoading(false);

        
      });
  };

  useEffect(() => {
    const id = location.search.substring(1, location.search.length);
    const reportId = location.hash.substring(1, location.hash.length);
    
    if (reportId) {
      setReportID(reportId);
    }
    if (id) {
      gethistory(id);
    }
  }, []);
  return (
    <>
      {isDataLoading ? (
        <PageLoading />
      ) : (
        <Box className={classes.LoginBox}>
          <Container maxWidth="lg">
            <Box mt={6}>
              <Typography
                variant="h1"
                style={{ color: "#141518" }}
                align="center"
              >
                Chat between{" "}
                <strong>
                  {chatDetails?.receiverId?.name
                    ? chatDetails?.receiverId?.name
                    : sortAddress(
                        chatDetails?.receiverId?.ethAccount
                          ? chatDetails?.receiverId?.ethAccount.address
                          : chatDetails?.receiverId?.walletAddress
                      )}
                </strong>{" "}
                and{" "}
                <strong>
                  {chatDetails?.senderId?.name
                    ? chatDetails?.senderId?.name
                    : sortAddress(
                        chatDetails?.senderId?.ethAccount
                          ? chatDetails?.senderId?.ethAccount.address
                          : chatDetails?.senderId?.walletAddress
                      )}
                </strong>
              </Typography>
              <Box className="chat-Box" mt={5} mb={2}>
                {chat?.map((data, i) => {
                  if (data.receiverId === ids) {
                    if (data.mediaType === "image") {
                      return (
                        <Box className="right-Box">
                          <Box>
                            <img src={data.message} width="100%" />
                          </Box>
                        </Box>
                      );
                    }
                    return (
                      <>
                        <Box className="right-Box">
                          <Box>
                            {data.message}
                            <span>{moment(data.createdAt).format("lll")}</span>
                          </Box>
                        </Box>
                      </>
                    );
                  } else {
                    if (data.mediaType === "image") {
                      return (
                        <Box className="left-Box">
                          <Box>
                            <img src={data.message} width="100%" />
                          </Box>
                        </Box>
                      );
                    }
                    return (
                      <Box className="left-Box">
                        <Box>
                          {data.message}
                          <span> {moment(data.createdAt).format("lll")}</span>
                        </Box>
                      </Box>
                    );
                  }
                })}
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Button
                    variant="contained"
                    size="large"
                    color="primery"
                    className="btn-block btnWidth removeredius"
                    onClick={handleClickOpen}
                  >
                    Send a warning message
                  </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    className="btn-block btnWidth removeredius"
                    onClick={handleClickOpen1}
                  >
                    Block from sending messages
                  </Button>
                </Grid>
              </Grid>
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

          {/* send msg modal start */}
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogContent className={classes.paper}>
              <DialogContentText id="alert-dialog-slide-description">
                <Typography variant="h3" className={classes.modaltitel}>
                  send a warning message
                </Typography>
                <Box>
                  <label> Message content:</label>
                  <TextField
                    placeholder="Our policies don't agree with your ideas! So please check yourself."
                    variant="outlined"
                    multiline
                    rows={6}
                    className={classes.input_fild}
                    onChange={(e) => setmsg(e.target.value)}
                  />
                </Box>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    size="large"
                    color="primery"
                    className="btn-block btnWidth mb-10"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    className="btn-block btnWidth mb-10"
                    onClick={() => warning(chatDetails?.senderId?._id)}
                    disabled={isLoading}
                  >
                    {chatDetails?.senderId?.name
                      ? chatDetails?.senderId?.name
                      : sortAddress(
                          chatDetails?.senderId?.ethAccount
                            ? chatDetails?.senderId?.ethAccount.walletAddress
                            : chatDetails?.senderId?.walletAddress
                        )}
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    className="btn-block btnWidth mb-10"
                    onClick={() => warning(chatDetails?.receiverId?._id)}
                    disabled={isLoading}
                  >
                    {chatDetails?.receiverId?.name
                      ? chatDetails?.receiverId?.name
                      : sortAddress(
                          chatDetails?.receiverId?.ethAccount
                            ? chatDetails?.receiverId?.ethAccount.walletAddress
                            : chatDetails?.receiverId?.walletAddress
                        )}
                  </Button>
                </Box>
              </DialogContentText>
            </DialogContent>
          </Dialog>

          {/* send msg modal end */}
          {/* block msg modal start */}
          <Dialog
            open={openBlock}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose1}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogContent className={classes.paper}>
              <DialogContentText id="alert-dialog-slide-description">
                <Typography variant="h3" className={classes.modaltitel}>
                  Block
                </Typography>
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <label>Block hours:</label>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <TextField
                        type="number"
                        id="standard-basic"
                        placeholder="24 hours"
                        className={classes.input_fild2}
                        onChange={(e) => setBlockHours(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box mb={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <label> Send a message:</label>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <TextField
                        id="standard-basic"
                        placeholder="bad language "
                        className={classes.input_fild2}
                        onChange={(e) => setmsg(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    size="large"
                    color="primery"
                    className="btn-block btnWidth mb-10"
                    onClick={handleClose1}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    className="btn-block btnWidth mb-10"
                    // component={Link}
                    // to='/SearchResult'
                    onClick={() => blockuser(chatDetails?.senderId?._id)}
                    disabled={isLoading}
                  >
                    Ban{" "}
                    {chatDetails?.senderId?.name
                      ? chatDetails?.senderId?.name
                      : sortAddress(
                          chatDetails?.senderId?.ethAccount
                            ? chatDetails?.senderId?.ethAccount.walletAddress
                            : chatDetails?.senderId?.walletAddress
                        )}
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    className="btn-block btnWidth mb-10"
                    // component={Link}
                    // to='/SearchResult'
                    onClick={() => blockuser(chatDetails?.receiverId?._id)}
                    disabled={isLoading}
                  >
                    Ban{" "}
                    {chatDetails?.receiverId?.name
                      ? chatDetails?.receiverId?.name
                      : sortAddress(
                          chatDetails?.receiverId?.ethAccount
                            ? chatDetails?.receiverId?.ethAccount.address
                            : chatDetails?.receiverId?.walletAddress
                        )}
                  </Button>
                </Box>
              </DialogContentText>
            </DialogContent>
          </Dialog>

          {/* block msg modal end */}
        </Box>
      )}
    </>
  );
}
