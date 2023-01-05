import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  makeStyles,
  Avatar,
  Grid,
  Button,
  List,
  ListItem,
} from "@material-ui/core";

import { Link, useHistory } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { BsClockHistory } from "react-icons/bs";
import moment from "moment";
import { calculateTimeLeft, sortAddress } from "src/utils";

const useStyles = makeStyles((theme) => ({
  cards: {
    border: "solid 0.5px #e5e3dd",
    backgroundColor: "#fff",
    paddingTop: "20px",
    borderRadius: "10px",
    "& span": {
      fontSize: "12px",
      color: "#141518",
    },
    "& h2": {
      marginTop: "25px",
      fontSize: "25px",
      color: "#141518",
      fontWeight: "bold",
      lineHeight: "1.52",
      wordBreak: "break-word",
    },
  },
  NFTbg: {
    width: "100%",
    height: "150px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "40px",
    fontWeight: "500",
    color: "#fff",
    marginBottom: "20px",
    backgroundImage: "linear-gradient(to bottom, #4fc5c5, #286363)",
  },
  contantCard: {
    padding: "15px",
    borderTop: "solid 0.5px #e5e3dd",
    position: "relative",
    "& h5": {
      display: "flex",
      alignItems: "center",
    },
  },
  timeing: {
    display: "flex",
    position: "absolute",
    top: " -22px",
    right: "0",
    "& li": {
      backgroundColor: "#fff",
      border: "solid 0.5px #e5e3dd",
      fontSize: "10px",
      textAlign: "center",
      width: "auto",
      padding: "5px",
      marginLeft: "3px",
      color: "#141518",
    },
  },
  nftImg: {
    width: "100%",
    // height: "165px",
    overflow: "hidden",
    backgroundPosition: "center !important",
    backgroundSize: "cover !important",
    backgroundRepeat: " no-repeat !important",
    // borderRadius: "40px 40px 10px 10px",
    // borderRadius: "18px",
    backgroundColor: "#ccc !important",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: " solid 0.5px #e5e3dd",
  },
}));

export default function UsersCard({ data, index }) {
  const classes = useStyles();
  const [date, setdate] = useState(data.duration);
  const history = useHistory();
  const [h, seth] = useState("");
  const [m, setm] = useState("");
  const [s, sets] = useState("");
  const [d, setd] = useState("");
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
      setd("0");
      seth("0");
      setm("0");
      sets("0");
    } else {
      setd(days);
      seth(hours);
      setm(minutes);
      sets(seconds);
    }
    // return  ` ${days} day(s)
    // ${hours} h ${minutes} m ${seconds} s`
    //   ;
  };

  const dating = (date) => {
    try {
      var clienttimeoffset = new Date();
      var Time;
      Time = getDateDiff(clienttimeoffset, new Date(date));
      
    } catch {
      var Time = "";
    }
  };

  useEffect(() => {
    dating(date);
  }, [date]);

  const updateDimensions = () => {
    if (data?._id) {
      let offsetWidth = document.getElementById(
        "imagecard" + data?._id
      ).offsetWidth;
      let newoofsetWidth = offsetWidth - 60;
      document.getElementById("imagecard" + data?._id).style.height =
        newoofsetWidth + "px";
    }
  };
  const isVideo =
    data.nftId?.mediaType && data.nftId?.mediaType === "mp4" ? true : false;
  useEffect(() => {
    updateDimensions();
  }, [data, index]);
  const [closeTimeLeft, setCloseTimeLeft] = useState();

  useEffect(() => {
    const timer = setTimeout(() => {
      setCloseTimeLeft(calculateTimeLeft(new Date(data?.time)));
    }, 1000);
    return () => clearTimeout(timer);
  });
  return (
    <Box className={classes.cards}>
      {/* <Typography variant="body2" component="span">{data.title}</Typography>
            <Typography variant="h2" component="h2">{data.data}</Typography> */}
      <Box
        style={{ cursor: "pointer" }}
        onClick={() => {
          history.push({
            pathname: "/NFT-detail",
            search: data?._id,
          });
        }}
      >
        {" "}
        <Box className={classes.NFTbg} style={{ overflow: "hidden" }}>
          {isVideo ? (
            <Box id={`imagecard${data?._id}`} className={classes.nftImg}>
              <video width="100%" controls>
                <source src={data.nftId.mediaUrl} type="video/mp4" />
              </video>
            </Box>
          ) : (
            <Box
              id={`imagecard${data?._id}`}
              className={classes.nftImg}
              style={{
                background: "url(" + data?.nftId?.mediaUrl + ")",
                cursor: "pointer",
              }}
            ></Box>
          )}
        </Box>
      </Box>
      <Box className={classes.contantCard}>
        {moment(data.time).unix() < moment().unix() ? (
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
        {/* <List className={classes.timeing}>
          <ListItem>{d} days</ListItem>
          <ListItem>{h}</ListItem>
          <ListItem>{m}</ListItem>
          <ListItem>{s}</ListItem>
        </List> */}
        <Typography
          variant="h5"
          component="h5"
          style={{
            color: "#141518",
            marginBottom: "10px",
            wordBreak: "break-all",
          }}
        >
          {data ? data.title : data.nftId.title}
        </Typography>
        <Grid container alignItems="center">
          <Grid item xs={8} md={8}>
            <Typography
              variant="h5"
              component="h5"
              style={{ color: "#707070" }}
            >
              {data.userId ? data.userId.userName : ""} &nbsp;
              {data?.userId?.planType === "Gold" && (
                <img
                  src="images/gold-check.svg"
                  style={{ width: "30px", marginLeft: "5px" }}
                />
              )}
              {data?.userId?.planType === "Diamond" && (
                <img
                  src="images/blue-check.svg"
                  style={{ width: "30px", marginLeft: "5px" }}
                />
              )}
              {data?.userId?.planType === "Silver" && (
                <img
                  src="images/white_check.svg"
                  style={{ width: "30px", marginLeft: "5px" }}
                />
              )}
              {data?.userId?.planType === "Mas Plus" && (
                <img
                  src="images/icon.png"
                  style={{ width: "30px", marginLeft: "5px" }}
                />
              )}
            </Typography>
          </Grid>
          <Grid item xs={4} md={4}>
            <Typography variant="h5" component="span" style={{ color: "#000" }}>
              Starting price
            </Typography>
            <Typography
              variant="h4"
              component="h5"
              style={{
                color: "#701848",
                textAlign: "center",
                fontSize: "16px",
              }}
            >
              {data.startingBid}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
