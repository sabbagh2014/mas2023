import React, { useState, useEffect, useContext } from "react";
import { Button, Grid, Box, Typography } from "@material-ui/core";

import Page from "src/component/Page";

import { makeStyles } from "@material-ui/core";
import { Link, useLocation } from "react-router-dom";

import { useHistory } from "react-router-dom";
import InstagramIcon from "@material-ui/icons/Instagram";
import YouTubeIcon from "@material-ui/icons/YouTube";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import axios from "axios";
import apiConfig from "src/Apiconfig/Apiconfig";
import { FaMediumM, FaTelegram } from "react-icons/fa";
import Loader from "src/component/Loader";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingRight: 0,
  },
  inputAdornment: {
    backgroundColor: "#f5d5da",
    height: 40,
    maxHeight: 40,
    paddingRight: 10,
    paddingLeft: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  mainbox: {
    padding: "50px 0 30px",
  },

  iconcolor: {
    backgroundColor: "#f5f5f5",
    padding: "16px",
    color: "#8a3ab9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  iconcolor2: {
    cursor: "pointer",
    backgroundColor: "#00acee",
    padding: "16px",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  iconcolor3: {
    cursor: "pointer",
    backgroundColor: "#ff0000",
    padding: "16px",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  iconcolor4: {
    cursor: "pointer",
    backgroundColor: "#3b5998",
    padding: "16px",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  iconcolor5: {
    cursor: "pointer",
    backgroundColor: "#f5f5f5",
    padding: "16px",
    color: "#54b6e7",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  iconcolor6: {
    cursor: "pointer",
    backgroundColor: "#7d9bff",
    padding: "16px",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  mainSocail: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "10px",
    display: "flex",

    "& input": {
      border: "none",
      outline: "none",
      padding: "8px",
      minWidth: "352px",
      width: "100%",
      color: "#9a9a9a",
      "@media(max-width:441px)": {
        minWidth: "265px",
      },
      "@media(max-width:330px)": {
        minWidth: "200px",
      },
    },
  },
  subsocial: {
    cursor: "pointer",
    display: "flex",
    border: "1px solid #80808038",
  },
  iconPart: {
    color: "hsl(198deg 86% 53%)",
    background: "hsl(0deg 0% 96%)",
    padding: "8px",
  },
  iconPart1: {
    color: "hsl(1deg 93% 56%)",
    background: "hsl(0deg 0% 96%)",
    padding: "8px",
  },
  iconPart2: {
    color: "hsl(221deg 44% 41%)",
    background: "hsl(0deg 0% 96%)",
    padding: "8px",
  },
  iconPart3: {
    color: "hsl(279deg 45% 68%)",
    background: "hsl(0deg 0% 96%)",
    padding: "8px",
  },
  btnmargin: {
    marginTop: "30px",

    "@media(max-width:767px)": {
      marginTop: "20px",
    },
  },
  boxbutton: {
    display: "flex",
    alignItems: "center",
    marginTop: "10px",

    justifyContent: "center",
    paddingRight: "50px",
    "@media(max-width:960px)": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    "@media(max-width:375px)": {
      // display: 'grid',
      alignItems: "center",
      justifyContent: "center",
    },
  },
  btnmain: {
    textAlign: "center",
  },
  devicelistHeading: {
    "& h3": {
      color: theme.palette.text.black,
    },
  },
}));

export default function ViewSocial() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  
  const [link, setLink] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const socialLink = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(apiConfig.viewSocial, {
        headers: {
          token: window.sessionStorage.getItem("token"),
        },
        params: {
          title: location.state.id,
        },
      });
      if (res.data.statusCode === 200) {
        setLink(res.data.result);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("ERROR", error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    socialLink();
  }, []);

  // social link update

  return (
    <Page title="Social">
      <container maxWeight="sm">
        <Box className={classes.mainbox}>
          <Grid container spacing={4} align="center">
            <Grid item xs={12} sm={12} md={12}>
              <Box className={classes.devicelistHeading} mb={4} align="left">
                <Typography variant="h3">Social Links</Typography>
              </Box>
              <hr />
              {isLoading && <Loader />}
              <Box mt={6}>
                <Typography>{link?.title}</Typography>
                <Box className={classes.mainSocail}>
                  <Box className={classes.subsocial}>
                    {link?.title == "Facebook" && (
                      <>
                        <FacebookIcon className={classes.iconPart} />
                        <input
                          placeholder="https:facebook.com"
                          value={link?.link}
                        />
                      </>
                    )}
                    {link?.title == "Twitter" && (
                      <>
                        <TwitterIcon className={classes.iconPart} />
                        <input
                          placeholder="https:twitter.com"
                          value={link?.link}
                        />
                      </>
                    )}
                    {link?.title == "Telegram" && (
                      <>
                        <FaTelegram className={classes.iconPart} />
                        <input
                          placeholder="https:telegram.com"
                          value={link?.link}
                        />
                      </>
                    )}
                    {link?.title == "Youtube" && (
                      <>
                        <YouTubeIcon className={classes.iconPart} />
                        <input
                          placeholder="https:youtube.com"
                          value={link?.link}
                        />
                      </>
                    )}
                    {link?.title == "Medium" && (
                      <>
                        <FaMediumM className={classes.iconPart} />
                        <input
                          placeholder="https:medium.com"
                          value={link?.link}
                        />
                      </>
                    )}
                  </Box>
                </Box>
              </Box>

              <Box mb={0} className={classes.btnmargin}>
                <Box className={classes.boxbutton}>
                  <Box textAlign="center" style={{ margin: "0px 10px" }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      component={Link}
                      to="/static-content-management"
                    >
                      BACK
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </container>
    </Page>
  );
}
