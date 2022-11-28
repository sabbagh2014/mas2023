import React from "react";
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
import { Link } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { BsClockHistory } from "react-icons/bs";

const useStyles = makeStyles((theme) => ({
    cards: {
        border: "solid 0.5px #e5e3dd",
        backgroundColor: "#fff",
        padding: "10px",
        borderRadius: "10px",
        margin: "0 10px",
    },
    NFTbg: {
        width: "100%",
        height: "100px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "12px",
        fontWeight: "500",
        color: "#fff",
        marginBottom: "20px",
        backgroundImage: "linear-gradient(to bottom, #c04848, #480048)",
    },
    contantCard: {
        textAlign: "left",
        '& h6': {
            marginBottom: "2px !important",
            fontSize: "14px",
        },
        '& p': {
            fontSize: "12px",
        },
    },
    contantCard2: {
        textAlign: "left",
        position: "relative",
        paddingTop: "10px",
        borderTop: "solid 0.5px #707070",
        '&::after': {
            position: "absolute",
            border: " solid 0.5px #707070",
            content: "''",
            left: "50%",
            top: "0",
            transform: "translatex(-50%)",
        },
    },
    btnBox: {
        display: "flex",
        alignItems: "center",
        '& button':{
            fontSize:"8px !important",
        },
    },
}));

export default function UsersCard(props) {
    const classes = useStyles();

    return (
        <Box className={classes.cards} >
            <Link to="/NFT-detail"> <Box className={classes.NFTbg}>This is a photo/video</Box></Link>
            <Box className={classes.contantCard}>
                <Typography variant="h6" component="h6" style={{ color: "#792034", }}>Bundle I</Typography>
                <Typography variant="h6" component="h6" style={{ color: "#000", }}>15  <span style={{ color: "#707070", fontWeight: "bold", }}>MAS</span></Typography>
                <Typography variant="h6" component="h6" style={{ color: "#000", }}><span style={{ color: "#707070", fontWeight: "bold", }}>Valid till </span>07/11/2021  </Typography>
                <Typography variant="body2" component="span" style={{ color: "#000", }}> Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </Typography>
            </Box>
            <Box mt={2} className={classes.contantCard2}>
                <Typography variant="body2" component="span" style={{ color: "#000", fontWeight: "bold", }}> subscribtions:<span style={{ color: "#707070", }}> &nbsp;500</span></Typography><br />
                <Typography variant="body2" component="span" style={{ color: "#000", fontWeight: "bold", }}> created:<span style={{ color: "#707070", }}>&nbsp; 1/12/2021</span></Typography>
            </Box>
            <Box mt={2} className={classes.btnBox} >
                            <Button
                                variant="contained"
                                size="large"
                                color="primery"
                                className="btn-block removeredius"
                               
                            >
                              Unsuspend bundle
                            </Button>
                            <Button
                                variant="contained"
                                size="large"
                                color="secondary"
                                className="btn-block removeredius ml-10"
                               
                            >
                               Suspend bundle
                            </Button>
                        </Box>
        </Box>
    );
}


