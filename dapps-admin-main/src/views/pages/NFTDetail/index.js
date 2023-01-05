import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Container,
  Button,
  Typography,
  makeStyles,
  Grid,
  List,
  ListItem,
  Slide,
} from "@material-ui/core";
import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfig";
import { useLocation, useHistory } from "react-router";
import History from "./History";
import DataLoading from "src/component/DataLoading";
import moment from "moment";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { calculateTimeLeft, sortAddress } from "src/utils";

import ButtonCircularProgress from "src/component/ButtonCircularProgress";
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  LoginBox: {
    paddingTop: "110px",
    paddingBottom: "50px",
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
  NFTbg: {
    width: "100%",
    height: "500px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "40px",
    fontWeight: "500",
    color: "#fff",
    marginBottom: "20px",
    // backgroundImage: "linear-gradient(to bottom, #4fc5c5, #286363)",
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
  timeing: {
    display: "flex",
    "& li": {
      backgroundColor: "#fff",
      border: "solid 0.5px #e5e3dd",
      fontSize: "20px",
      textAlign: "center",
      width: "auto",
      padding: "10px 15px",
      marginLeft: "3px",
      color: "#141518",
      [theme.breakpoints.down("sm")]: {
        padding: "5px",
        fontSize: "12px",
      },
    },
  },
  labelText: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#000",
    alignItems: "center",
  },
  price: {
    fontSize: "45px",
    fontWeight: "normal",
    textAlign: "center",
    color: "#d15b5b",
  },
  masBox: {
    backdropFilter: " blur(15px)",
    border: "solid 0.5px #e5e3dd",
    backgroundColor: "#fff",
    padding: "40px 20px",
  },
  customModal: {
    "& .MuiDialog-paperWidthSm": {
      width: "1100px",
      minWidth: "300px",
      maxWidth: "100%",
    },
    "& .makeStyles-paper-70": {
      width: "1100px",
      minWidth: "300px",
      maxWidth: "100%",
    },
  },
  timeBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
  nftimg: {
    border: " solid 0.5px #e5e3dd",
    height: "500px",
    width: "100%",
    margin: "10px 0",
    "& img": {
      width: "100%",
      height: "100%",
    },
  },
  dilogBody2: {
    boxShadow: "0 1.5px 3px 0 rgb(0 0 0 / 16%)",
    backgroundImage: "linear-gradient(to bottom, #c04848, #480048)",
    borderRadius: "50px",
    overflow: "hidden",
  },
  dilogBody3: {
    backgroundColor: "#3e3e3e",
  },
  table: {
    "& th": {
      color: "#fff",
    },
    "& td": {
      color: "#fff",
    },
  },
}));
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Login() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [errpopup, seterrpopup] = React.useState(false);
  const [severity, setSeverity] = useState("info");
  const [errmsg, seterrmsg] = React.useState("");
  const [auctionDetails, setAuctionDetails] = useState();
  
  const [allBidList, setAllBidList] = useState([]);
  const classes = useStyles();
  const getAuctionDetails = async (id) => {
    // setIsLoading(true);
    await axios({
      method: "GET",
      url: Apiconfigs.listorderbyid + id,
      headers: {
        token: window.sessionStorage.getItem("AccessToken"),
      },
    })
      .then(async (res) => {
        
        if (res.data.statusCode === 200) {
          setAuctionDetails(res.data.result);
          getBidList(res.data.result.orderId._id);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        
      });
  };

  const getBidList = async (orderId) => {
    try {
      const res = await axios.get(Apiconfigs.listBid, {
        params: {
          orderId,
        },
        headers: {
          token: window.sessionStorage.getItem("AccessToken"),
        },
      });
      
      if (res.data.statusCode === 200) {
        setAllBidList(res.data.result);
      }
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const getDateDiff = (startDate, endDate) => {
    var delta = Math.abs(endDate - startDate) / 1000;

    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    var seconds = parseInt(delta % 60); // in theory the modulus is not required

    var difference = endDate - startDate;
    var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
    if (daysDifference < 0) {
      return {
        d: 0,
        h: 0,
        m: 0,
        s: 0,
      };
    } else {
      return {
        d: days,
        h: hours,
        m: minutes,
        s: seconds,
      };
    }
    return ` ${days} day(s)
    ${hours} h ${minutes} m ${seconds} s`;
  };

  useEffect(() => {
    const id = location.search.substring(1, location.search.length);
    if (id) {
      // mynft(id);
      getAuctionDetails(id);
    }
  }, []);

  try {
    var clienttimeoffset = new Date();
    var Time;

    Time = getDateDiff(clienttimeoffset, new Date(auctionDetails.time));
  } catch {
    var Time = "";
  }

  const errhandleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    seterrpopup(false);
  };
  const isVideo =
    auctionDetails?.nftId?.mediaType &&
    auctionDetails?.nftId?.mediaType === "mp4"
      ? true
      : false;
  const [closeTimeLeft, setCloseTimeLeft] = useState();

  useEffect(() => {
    const timer = setTimeout(() => {
      setCloseTimeLeft(calculateTimeLeft(new Date(auctionDetails?.time)));
    }, 1000);
    return () => clearTimeout(timer);
  });
  return (
    <Box className={classes.LoginBox}>
      {isLoading ? (
        <DataLoading />
      ) : (
        <>
          {!isLoading && !auctionDetails ? (
            <Box align="center" mt={4} mb={5}>
              <Typography
                // variant='h1'
                style={{ color: "#000", marginBottom: "10px" }}
              >
                NO DATA FOUND!!
              </Typography>
              {/* <img src='images/noresult.png' /> */}
            </Box>
          ) : (
            <>
              <Container maxWidth="lg">
                {isVideo ? (
                  <Box
                    id={`imagecard${auctionDetails?._id}`}
                    className={classes.nftImg}
                  >
                    <video width="100%" controls>
                      <source
                        src={auctionDetails.nftId.mediaUrl}
                        type="video/mp4"
                      />
                    </video>
                  </Box>
                ) : (
                  <Box className={classes.NFTbg}>
                    <img
                      src={auctionDetails?.nftId?.mediaUrl}
                      className={classes.nftimg}
                      width="400px"
                    />
                  </Box>
                )}{" "}
                <Typography variant="h3" className={classes.modaltitel}>
                  {auctionDetails.title}
                </Typography>
                <Box mb={3}>
                  <label className={classes.labelText}>Details:</label>
                  <Typography variant="body2" component="p">
                    {auctionDetails.details}
                  </Typography>
                </Box>
                <Grid container style={{ alignItems: "flex-end" }}>
                  <Grid item xs={12} md={1}>
                    <label className={classes.labelText}>Time left:</label>
                  </Grid>
                  <Grid item xs={12} md={11}>
                    {moment(auctionDetails.time).unix() < moment().unix() ? (
                      <List className={classes.timeing}>
                        <ListItem>Expired</ListItem>
                      </List>
                    ) : (
                      <List className={classes.timeing}>
                        <ListItem>{closeTimeLeft?.days} days</ListItem>
                        <ListItem>{closeTimeLeft?.hours}</ListItem>
                        <ListItem>{closeTimeLeft?.minutes}</ListItem>
                        <ListItem>{closeTimeLeft?.seconds}</ListItem>
                      </List>
                    )}
                  </Grid>
                </Grid>
                <Box align="center">
                  {" "}
                  <label className={classes.labelText} align="center">
                    starting price
                  </label>
                  <Typography
                    variant="body1"
                    component="p"
                    className={classes.price}
                  >
                    {auctionDetails.startingBid} MAS
                  </Typography>
                </Box>
                <Box mb={5}>
                  <History data={allBidList} auctionDetails={auctionDetails} />
                </Box>
              </Container>
              <Box mt={5}>{/* <Profile data={userdetails} /> */}</Box>
            </>
          )}{" "}
        </>
      )}
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
