import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  Paper,
  Container,
} from "@material-ui/core";
import { ToastContainer, toast } from "react-toastify";
import Apiconfig from "../../../config/APIConfig";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { withStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  btn: {
    backgroundColor: "#1273eb",
    color: "white",
    borderRadius: "40px",
    width: "130px",
    height: "6vh",
  },
  btn2: {
    // backgroundColor:"#686869",
    // color:"white",
    borderRadius: "40px",
    width: "130px",
    height: "6vh",
  },
});

const Showcontent = (props) => {
  const classes = useStyles();
  // const { data } = props;
  // console.log("hellomydata", data);
  const location = useLocation();
  const accessToken = window.sessionStorage.getItem("AccessToken");
  const [showdata, setshowdata] = React.useState([]);

  console.log("mydatatdata", showdata);

  const showTermConditionapi = async (id) => {
    console.log("mydataid", id);
    await axios
      .get(Apiconfig.getStaticContent, {
        params: {
          staticId: id,
        },
        // {
        //   headers: {
        //     token: `${accessToken}`,
        //   },
        // }
      })
      .then(async (res) => {
        if (res.data.response_code === 200) {
          setshowdata(res.data.result);
          console.log("%%%44554%%%", res.data.result);
        }
      });
  };

  useEffect(() => {
    if (location.search.substring(1, location.search.length)) {
      const id = location.search.substring(1, location.search.length);
      showTermConditionapi(id);
    }
  }, [location]);

  return (
    <Container maxWidth="md">
      {" "}
      <Paper
        style={{ margin: "25px", padding: "10px", paddingBottom: "20px" }}
        elevation={2}
      >
        <Box>
          <Typography
            variant="h3"
            style={{ marginTop: "20px", marginLeft: "15px" }}
          >
            {showdata.title}
          </Typography>
          <Box style={{ marginTop: "40px", marginLeft: "15px" }}>
            <Grid>
              <Typography variant="body1">
                {/* {showdata.description} */}
                <div
                  dangerouslySetInnerHTML={{ __html: showdata.description }}
                />
              </Typography>
            </Grid>
            <Box mt={2}>
              {" "}
              <Grid container justify="center" spacing={2}>
                {/* <Grid item>
                  {" "}
                  <Link to="/Edit-Content" style={{ textDecoration: "none" }}>
                    <Button
                      type="submit"
                      className={classes.btn}
                      variant="contained"
                    >
                      {" "}
                      Edit
                    </Button>{" "}
                  </Link>{" "}
                </Grid> */}

                <Grid item>
                  {" "}
                  <Link to="/Termsof-Use" style={{ textDecoration: "none" }}>
                    <Button
                      type="submit"
                      className={classes.btn2}
                      variant="outlined"
                    >
                      {" "}
                      Back
                    </Button>{" "}
                  </Link>{" "}
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Showcontent;
