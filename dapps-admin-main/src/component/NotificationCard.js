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
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { BsClockHistory } from "react-icons/bs";

const useStyles = makeStyles((theme) => ({
    NftImg: {
        borderRadius: 10,
        display: "block",
        miHeight: "300px",
        position: "relative",
    },
    bottomblock: {
        display: "flex",
        justifyContent: "space-between",
        alignContent: "center",
    },
    bottomTop: {
        display: "flex",
        justifyContent: "space-between",
        alignContent: "center",
        margin: "10px 0 0",
    },
    playbutton: {
        position: "absolute",
        bottom: 5,
        right: 10,
    },
    NotificationBox: {
        display: "flex",
        alignContent: "center",
        '& div': {
            '& h5': {
                fontWeight: "500",
                fontSize: "14px",
                lineHeight: "21px",
                color: "#039BE3",
            },
            '& p': {
                fontWeight: "500",
                fontSize: "12px",
                lineHeight: "18px",
                color: "#3D3D3D",
            },
            '& small': {
                fontWeight: "500",
                fontSize: "12px",
                lineHeight: "18px",
                color: "#979797",
            },
        },
    },
    Notificationimg: {
        width: "70px",
        marginRight: "30px",
        '@media(maxWidth:767px)':{
            Notificationimg: {
                marginRight: "10px",
            },
        },
        '& img': {
            width: "100%",
        },
    },
}));

export default function UsersCard(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const { type, data } = props;
    const classes = useStyles();

    return (
            <Box className={classes.NotificationBox}>
            <figure className={classes.Notificationimg}>
                <img src={data.img} alt="" />
            </figure>
            <Box>
                <Typography variant="h5">  {data.title}</Typography>
                <Typography variant="body2" component="p">{data.discription}</Typography>
                <Typography variant="body2" component="small">{data.time}</Typography>
             <Box mt={2} mb={3}>

             <Button
          variant="contained"
          size="large"
          color="secondary"
        >
        ACCEPT
        </Button>
        <Button
          variant="contained"
          size="large"
          color="primery"
        >
         REJECT
        </Button>
             </Box>
           
            </Box>
        </Box>
    );
}
