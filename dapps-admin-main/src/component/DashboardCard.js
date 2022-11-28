import React from "react";
import {
  Typography,
  Box,
  makeStyles,
  Avatar,
  Grid,
  Button,
  Link,
} from "@material-ui/core";
import { FaEllipsisV } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { BsClockHistory } from "react-icons/bs";

const useStyles = makeStyles((theme) => ({
  cards: {
    border: "solid 0.5px #e5e3dd",
    background: "linear-gradient(180deg, #c04848 0%, #480048 100%)",
    borderRadius: "8px",
    boxShadow: "5px 10px 5px",
    padding: "10px 20px 20px 20px",
    // textAlign: 'center',
    "& span": {
      fontSize: "14px",
      color: "#fff",
    },
    "& h2": {
      fontSize: "25px",
      color: "#fff",
      fontWeight: "bold",
      lineHeight: "1.52",
      wordBreak: "break-word",
    },
  },
}));

export default function UsersCard({ name, value }) {
  const classes = useStyles();

  return (
    <Box className={classes.cards}>
      <Typography variant="body2" component="span">
        {name}
      </Typography>
      <Typography variant="h2" component="h2">
        {value}
      </Typography>
    </Box>
  );
}
