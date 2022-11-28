import {
  Box,
  Container,
  Grid,
  Typography,
  makeStyles,
} from "@material-ui/core";

import axios from "axios";
import moment from "moment";
import React, { useState, useEffect } from "react";
import Apiconfigs from "src/Apiconfig/Apiconfig";
import { FaRegCopy } from "react-icons/fa";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import Loader from "src/component/Loader";
import { sortAddress } from "../../../utils";

const useStyles = makeStyles((theme) => ({
  imgSectionMain: {
    "@media(max-width:600px)": {
      display: "flex",
      justifyContent: "center",
    },
  },
  imgSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
    background: "linear-gradient(180deg, #c04848 0%, #480048 100%)",
    width: "170px",
    height: "170px",

    "& img": {
      width: "150px",
      height: "145px",
      borderRadius: "100%",
    },
  },
  contentSection: {
    border: "solid 0.5px #e5e3dd",

    background: "linear-gradient(180deg, #c04848 0%, #480048 100%)",
    boxShadow: "5px 10px 5px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    paddingTop: "1rem",
    paddingBottom: "1rem",
    padding: "0 3px",
    height: "135px",
    color: "#fff !important",
  },
  detailsSection: {
    "& h6": {
      paddingTop: "1rem",
      "@media(max-width:550px)": {
        fontSize: "10px",
      },
    },
  },
  detailsSectionBox: {
    marginTop: "1.5rem",
    "@media(max-width:380px)": {
      marginTop: "2.7rem",
    },
    "& h6": {
      paddingTop: "1rem",
      "@media(max-width:550px)": {
        fontSize: "10px",
      },
    },
  },
}));

export default function UserDetails(props) {
  const classes = useStyles();
  const { location } = props;
  const [userList, setUserList] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const viewUserHandler = async (viewId) => {
    setIsLoading(true);
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.viewUser + viewId,
        headers: {
          token: sessionStorage.getItem("AccessToken"),
        },
      });
      if (res.data.statusCode === 200) {
        setUserList(res.data.result);
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const id = location.search.split("?");
    viewUserHandler(id[1]);
  },[]);
  return (
    <Box>
      {isLoading && <Loader />}
      <Container>
        <Grid container spacing={2}>
          <Grid item lg={4} md={4} sm={4} xs={12}>
            <Box className={classes.imgSectionMain}>
              <Box className={classes.imgSection}>
                <img
                  src={
                    userList?.profilePic
                      ? userList?.profilePic
                      : "images/user-profile.png"
                  }
                  alt="profile"
                />
              </Box>
            </Box>
          </Grid>
          <Grid item lg={8} md={8} sm={8} xs={12}>
            <Grid container spacing={3}>
              <Grid item lg={3} md={3} sm={6} xs={12}>
                <Box className={classes.contentSection}>
                  <Box>
                    <Typography>Total Bundles Created</Typography>
                    <Typography style={{ paddingTop: ".5rem" }}>
                      {userList?.noOfBundle ? userList?.noOfBundle : "0"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item lg={3} md={3} sm={6} xs={12}>
                <Box className={classes.contentSection}>
                  <Box>
                    <Typography>Total Subscribers</Typography>
                    <Typography style={{ paddingTop: ".5rem" }}>
                      {userList?.subscriberCount
                        ? userList?.subscriberCount
                        : "0"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item lg={3} md={3} sm={6} xs={12}>
                <Box className={classes.contentSection}>
                  <Box>
                    <Typography>Total NFT</Typography>
                    <Typography style={{ paddingTop: ".5rem" }}>
                      {userList?.subscriberCount
                        ? userList?.subscriberCount
                        : "0"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item lg={3} md={3} sm={6} xs={12}>
                <Box className={classes.contentSection}>
                  <Box>
                    <Typography>Total Auction NFT&apos;s </Typography>
                    <Typography style={{ paddingTop: ".5rem" }}>
                      {userList?.subscriberCount
                        ? userList?.subscriberCount
                        : "0"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={4} md={4} sm={6} xs={6}>
            <Box className={classes.detailsSection}>
              <Typography variant="h5" style={{ textDecoration: "underline" }}>
                User Information
              </Typography>
              <Container>
                <Typography variant="h6">Name : </Typography>
                <Typography variant="h6">Email Addreass : </Typography>
                <Typography variant="h6">Wallet Address : </Typography>
                <Typography variant="h6">Registration Date & Time :</Typography>

                <Typography variant="h6">Profile Badge : </Typography>
                <Typography variant="h6">Referral : </Typography>
              </Container>
            </Box>
          </Grid>
          <Grid item lg={8} md={8} sm={6} xs={6}>
            <Box className={classes.detailsSectionBox}>
              <Container>
                <Typography variant="h6">
                  {" "}
                  {userList?.name ? userList?.name : "N/A"}
                </Typography>
                <Typography variant="h6">
                  {" "}
                  {userList?.email ? userList?.email : "N/A"}
                </Typography>
                <Typography variant="h6">
                  {sortAddress(
                    userList?.ethAccount?.address
                      ? userList?.ethAccount?.address
                      : "N/A"
                  )}

                  <CopyToClipboard text={userList?.ethAccount?.address}>
                    <FaRegCopy
                      size={14}
                      style={{
                        cursor: "pointer",
                        width: "15px",
                        height: "15px",
                        padding: "0",
                      }}
                      onClick={() => toast.info("Copied")}
                    />
                  </CopyToClipboard>
                </Typography>

                <Typography variant="h6">
                  {moment(
                    userList?.updatedAt ? userList?.updatedAt : "N/A"
                  ).format("DD-MM-YYYY hh:mm A")}
                </Typography>

                <Typography variant="h6">
                  {userList?.planType ? userList?.planType : ""}
                </Typography>
                <Typography variant="h6">
                  {userList?.referralCode ? userList?.referralCode : ""}
                </Typography>
              </Container>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
