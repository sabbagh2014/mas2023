import React, { useEffect, useState } from "react";

import {
  Grid,
  Box,
  Typography,
  Button,
  Divider,
  CircularProgress,
} from "@material-ui/core";
import { Container } from "@material-ui/core";

import axios from "axios";
import ApiConfigs from "src/Apiconfig/Apiconfig";

import Page from "src/component/Page";
import { Link, useLocation } from "react-router-dom";
// viewStaticPage

const ViewMilestone = () => {
  const Row = ({ field, value, image }) => (
    <Grid item container md={12}>
      <Grid item md={6}>
        <Box display="flex" justifyContent="space-between" pr={4}>
          <Typography variant="h5">
            <strong>{field}</strong>
          </Typography>
        </Box>
      </Grid>
      <Grid item md={6}>
        <Typography variant="body1">{value}</Typography>
        {image && <img src={image} alt="comp" width="90px" />}
      </Grid>
    </Grid>
  );
  const [selectedTab, setTab] = React.useState(0);

  const tabChange = (event, tabName) => {
    setTab(tabName);
  };

  const location = useLocation();
  const accessToken = window.sessionStorage.getItem("AccessToken");
  const [users, setUsers] = useState("");
  
  const ViewStatics = async () => {
    axios
      .get(
        ApiConfigs.viewStaticPage,

        {
          headers: {
            token: accessToken,
          },
          params: { type: location.state.id },
        }
      )
      .then((response) => {
        if (response.data.statusCode !== 200) {
        } else {
          // setDisplayname
          // console.log(result)
          setUsers(response.data.result);
          
        }
      })
      .catch((response) => {
        
      });
  };
  useEffect(() => {
    ViewStatics();
  }, [1]);
  
  
  return (
    <Container maxWidth="xl" style={{ marginTop: "50px" }}>
      {!users ? (
        <>
          <Box textAlign="center" pt={4}>
            <CircularProgress />
          </Box>
        </>
      ) : (
        <Page title="View User">
          <Box mb={2}>
            <Typography variant="h3" style={{ marginBottom: "8px" }}>
              <strong> {users?.title}</strong>
            </Typography>
            <Divider />
          </Box>
          {users?.description && (
            <span
              dangerouslySetInnerHTML={{
                __html: users?.description,
              }}
            ></span>
          )}{" "}
          {/* <Typography variant="body2">{users?.description}</Typography> */}
          <Box mt={2}>
            <Button
              variant="contained"
              size="medium"
              component={Link}
              to="/static-content-management"
            >
              Back
            </Button>
          </Box>
        </Page>
      )}
    </Container>
  );
};

export default ViewMilestone;
