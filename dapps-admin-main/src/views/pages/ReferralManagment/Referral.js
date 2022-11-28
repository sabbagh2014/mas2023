import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  TextField,
  Box,
  Typography,
  Button,
  InputAdornment,
} from "@material-ui/core";
import { ToastContainer, toast } from "react-toastify";

import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfig";
import { usePagination } from "@material-ui/lab/Pagination";
import Pagination from "@material-ui/lab/Pagination";
import { useHistory, useLocation } from "react-router-dom";
import BlockIcon from "@material-ui/icons/Block";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Switch from "@material-ui/core/Switch";

import Page from "src/component/Page";
import { makeStyles } from "@material-ui/core/styles";
import DataLoading from "src/component/DataLoading";
import NoDataFound from "src/component/NoDataFound";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import Loader from "src/component/Loader";
// import { DataGrid } from '@material-ui/data-grid';
const accessToken = window.sessionStorage.getItem("AccessToken");
const useStyles = makeStyles({
  table: {
    minWidth: 320,
  },
  pdbt: {
    paddingBottom: 68,
    minWidth: "1050px",
    width: "auto",
  },

  button: {
    minWidth: "initial",
    padding: "6px",
    marginLeft: "7px",
  },
  table: {
    border: "1px solid #e5e3dd",
    "& th": {
      border: "1px solid #e5e3dd",
    },
    "& td": {
      border: "1px solid #e5e3dd",
    },
  },
  tbody: {
    "&:nth-of-type(even)": {
      backgroundColor: "#f3f3f3",
    },
  },
  mainbox: { minHeight: "calc(100vh - 141px)" },
  btnsec: {
    display: "flex",
    justifyContent: "space-between",
  },
  bannerSectionBody: {
    padding: "80px 0px",
    minHeight: "770px",
    "& h3": {
      colors: "#000",
    },
  },
  dailogTitle: {
    textAlign: "Center",
    "& h2": {
      color: "#141518",
      fontSize: "23px",
    },
  },
  input_fild2: {
    width: "100%",
    "& input": {
      height: "30px",
      paddingTop: "22px",
    },
  },
  UploadBox: {
    border: "solid 0.5px #707070",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "110px",
  },
  input_fild22: {
    width: "100%",
    "& input": {
      height: "45px",
      border: 0,
    },
    "& .MuiInput-underline:before": {
      border: 0,
    },
  },
  newbox: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "center",
  },
  buttonGroup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: "12px",
    "& button": {
      margin: "0px 3px",
    },
  },
});

export default function Referral(props) {
  const history = useHistory();
  const classes = useStyles();
  const [isSubmit, setIsSubmit] = useState(false);
  const [isUpdatingFee, setIsUpdatingFee] = useState(false);
  const [referralBalances, setReferralBalances] = useState({});
  const [formData, setFormData] = useState({
    holderBeneifts: 0,
    userBenefits: 0,
  });
  const getInputFieldValues = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const temp = { ...formData, [name]: value };
    setFormData(temp);
  };
  const updateRefferalFeehandler = async () => {
    setIsSubmit(true);
    if (formData.holderBeneifts > 0 && formData.userBenefits > 0) {
      setFormData(false);
      setIsUpdatingFee(true);
      try {
        const res = await axios({
          method: "PUT",
          url: Apiconfigs.referralSetting,
          headers: {
            token: accessToken,
          },
          data: {
            _id: referralBalances?._id,
            referralAmount: parseFloat(formData?.userBenefits),
            refereeAmount: parseFloat(formData?.holderBeneifts),
          },
        });
        if (res.data.statusCode == 200) {
          toast.success("Referral fee has been updated successfully");
          setIsUpdatingFee(false);
          getReferralFeeHandler();
        }
      } catch (error) {
        console.log(error);
        setIsUpdatingFee(false);
      }
    } else {
      toast.error("You can not enter negative amount and zero");
    }
  };
  const getReferralFeeHandler = async () => {
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.referralSetting,
        headers: {
          token: accessToken,
        },
      });
      if (res.data.statusCode === 200) {
        setReferralBalances(res.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getReferralFeeHandler();
  }, []);
  useEffect(() => {
    if (referralBalances) {
      setFormData({
        holderBeneifts: referralBalances?.refereeAmount
          ? referralBalances?.refereeAmount
          : "",
        userBenefits: referralBalances?.referralAmount
          ? referralBalances?.referralAmount
          : "",
      });
    }
  }, [referralBalances]);

  return (
    <Container maxWidth="xl">
      <Box className={classes.mainbox}>
        <Page title="Referral Management">
          <Box mb={1} style={{ marginTop: "100px" }}>
            <Box className={classes.btnsec}>
              <Typography variant="h3">Referral Management</Typography>
            </Box>
          </Box>
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <label>Referee Amount :</label>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  type="number"
                  name="holderBeneifts"
                  placeholder="Enter amount in MAS"
                  className={classes.input_fild2}
                  // onChange={getInputFieldValues}
                  onKeyPress={(event) => {
                    if (event?.key != "-" || event?.key === "+") {
                      getInputFieldValues(event);
                    }
                  }}
                  onChange={(e) => {
                    if (e.target.value && e.target.value != "-") {
                      getInputFieldValues(e);
                    } else {
                      getInputFieldValues(e);
                    }
                  }}
                  error={isSubmit && formData.holderBeneifts === ""}
                  value={formData.holderBeneifts}
                  helperText={
                    isSubmit &&
                    formData.holderBeneifts === "" &&
                    "Please enter amount"
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography>MAS</Typography>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <label>Referral Amount :</label>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  type="number"
                  name="userBenefits"
                  placeholder="Enter amount in MAS"
                  className={classes.input_fild2}
                  onKeyPress={(event) => {
                    if (event?.key != "-" || event?.key === "+") {
                      getInputFieldValues(event);
                    }
                  }}
                  onChange={(e) => {
                    if (e.target.value && e.target.value != "-") {
                      getInputFieldValues(e);
                    } else {
                      getInputFieldValues(e);
                    }
                  }}
                  error={isSubmit && formData.userBenefits === ""}
                  value={formData.userBenefits}
                  helperText={
                    isSubmit &&
                    formData.userBenefits === "" &&
                    "Please enter amount"
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography>MAS</Typography>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}></Grid>
              <Grid item xs={12} md={9}>
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  onClick={() => history.push("/")}
                  style={{ marginRight: "10px" }}
                  disabled={isUpdatingFee}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  onClick={updateRefferalFeehandler}
                  disabled={isUpdatingFee}
                >
                  Submit
                  {isUpdatingFee && <ButtonCircularProgress />}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Page>
      </Box>
    </Container>
  );
}
