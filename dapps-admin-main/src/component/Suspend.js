import React from "react";
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
import Slider from "react-slick";
import SuspendCard from "src/component/SuspendCard";
const walletdetails = [
  {
    img: "images/card/1.png",
    songname: "Doja Cat-Planet",
    singername: "Junkyard Army",
    bid: "0.2",
    days: "5 days left",
    likes: "0",
  },
  {
    img: "images/card/2.png",
    songname: "Doja Cat-Planet",
    singername: "Junkyard Army",
    bid: "0.2",
    days: "5 days left",
    likes: "0",
  },
  {
    img: "images/card/3.png",
    songname: "Doja Cat-Planet",
    singername: "Junkyard Army",
    bid: "0.2",
    days: "5 days left",
    likes: "0",
  },
  {
    img: "images/card/4.png",
    songname: "Doja Cat-Planet",
    singername: "Junkyard Army",
    bid: "0.2",
    days: "5 days left",
    likes: "0",
  },
  {
    img: "images/card/5.png",
    songname: "Doja Cat-Planet",
    singername: "Junkyard Army",
    bid: "0.2",
    days: "5 days left",
    likes: "0",
  },
];
const useStyles = makeStyles((theme) => ({
  input_fild: {
    backgroundColor: "#ffffff6e",
    borderRadius: "5.5px",
    border: " solid 0.5px #e5e3dd",
    color: "#141518",
    height: "48px",
    width: "100%",
    maxWidth: "500px",
    margin: "0 auto",
    borderRadius: "20px",
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
  MuiNativeSelect: {
    icon: {
      color: "#777575",
    },
    select: {
      padding: "30px",
      paddingBottom: "30px",
    },
  },
}));

export default function Login() {
  const settings = {
    dots: false,
    slidesToShow: 3,
    slidesToScroll: 2,
    arrows: true,
    centerMode: true,
    centerPadding: "60px",
    className: "recomended",
    autoplay: false,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 2,
          centerMode: true,
          centerPadding: "50px",
          autoplay: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "20px",
          autoplay: false,
        },
      },
      // {
      //   breakpoint: 451,
      //   settings: {
      //     slidesToShow: 1,
      //     centerMode: true,
      //     centerPadding: "70px",
      //     autoplay: false,
      //   },
      // },
    ],
  };
  const classes = useStyles();
  return (
    <Box className={classes.LoginBox} mb={5}>
      <Grid container spacing={2}>
        <Slider {...settings} className="width100">
          {walletdetails.map((data, i) => {
            return (
              <Grid item xs={12} md={12} lg={12} key={i} className="walletSet">
                <SuspendCard />
              </Grid>
            );
          })}
        </Slider>
      </Grid>
    </Box>
  );
}
