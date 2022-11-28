import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import * as yup from "yup";
import { Formik } from "formik";
import {
  Container,
  Divider,
  Box,
  Card,
  Grid,
  CardContent,
  Typography,
  Button,
  Dialog,
  TextField,
  FormHelperText,
  MenuItem,
  FormControl,
  Paper,
  OutlinedInput,
  makeStyles,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Page from "src/component/Page";
import axios from "axios";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Apiconfigs from "src/Apiconfig/Apiconfig";
import PageLoading from "src/component/PageLoading";
import { toast } from "react-toastify";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const useStyles = makeStyles({
  form: {
    "& .MuiOutlinedInput-input": {
      padding: "13px 14px",
    },
  },
  btn: {
    backgroundColor: "#311499",
    color: "white",
    borderRadius: "40px",
    width: "130px",
    height: "6vh",
    "@media(max-width:768px)": {
      width: "87px",
      height: "50px",
    },
  },
  btn2: {
    backgroundColor: "#686869",
    color: "white",
    borderRadius: "40px",
    width: "130px",
    height: "6vh",
    "@media(max-width:768px)": {
      width: "87px",
      height: "50px",
    },
  },
  buttonIcon: {
    "@media(max-width:768px)": {
      display: "flex",
    },
  },
});

const EditProduct = (props) => {
  const classes = useStyles();

  const [unit, setUnit] = React.useState("CORPORATE");
  const [isConfirm, setConfirm] = React.useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loader1, setLoader1] = useState(false);
  const [countryCode, setCountryCode] = useState();
  const [bannerTitle, setbannerTitle] = useState("");
  const [bannerDescription, setbannerDescription] = useState("");

  const [coverurl, setcoverurl] = useState(user.userProfileData?.usercover);
  const [profile, setprofile] = useState();
  console.log("countryCode", countryCode);
  const openConfirm = () => {
    setConfirm(true);
  };

  const closeConfirm = () => {
    setConfirm(false);
  };
  const history = useHistory();
  const handleChange = (event) => {
    setUnit(event.target.value);
  };
  const getBase64 = (file, cb) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (err) {
      console.log("Error: ", err);
    };
  };
  const accessToken = window.sessionStorage.getItem("AccessToken");


  const addBanner = async () => {
    if (chainId == ACTIVE_NETWORK) {
      if (bannerTitle === "") {
        toast.error("Empty banner title");
        return;
      }
      if (bannerDescription === "") {
        toast.error("Empty banner description");
        return;
      }
      if (profile === "") {
        toast.error("Empty banner image");
        return;
      }
      setprocess(true);
      setLoader1(true)
      try {
        const formData = new FormData();
        formData.append("bannerTitle", bannerTitle);
        formData.append("bannerDescription", bannerDescription);
        formData.append("bannerImage", profile);


        const res = await axios.post(
          Apiconfigs.addBanner,
          formData,
          {
            headers: {
              token:accessToken,
            },
          }
        );
        if (res.data.statusCode === 200) {
      setLoader1(false)

          toast.success("working")
        } else {
      setLoader1(false)

          setprocess(false);
          toast.error(res.data.responseMessage);
        }
      } catch (error) {
      setLoader1(false)

        setprocess(false);
        toast.error(error.message);
      }
    } else {
      toast.error(`Please switch network ${NetworkContextName}`);
    }
  };

  return (
    <Page title="Create Plan">
      <Box mb={5}>
        <Typography variant="h3" style={{ marginBottom: "8px" }}>
          <strong> Add Banner</strong>
        </Typography>
        <Divider />
      </Box>

      <Box>
        
        
            <form
              noValidate
              onSubmit={addBanner}
              style={{ width: "100%" }}
              className={classes.form}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong> Banner Title :</strong>
                  </Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    type="text"
                    name="firstName"
                    value={bannerTitle}
                    onChange={(e)=>setbannerTitle(e.target.value)}
                    // error={Boolean(touched.firstName && errors.firstName)}
                  />
                  {/* <FormHelperText error>
                    {touched.firstName && errors.firstName}
                  </FormHelperText> */}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong> Banner Description :</strong>
                  </Typography>

                  <TextField
                    variant="outlined"
                    fullWidth
                    type="text"
                    name="lastName"
                    value={bannerDescription}
                    onChange={(e)=>setbannerDescription(e.target.value)}
                    // error={Boolean(touched.lastName && errors.lastName)}
                  />
                  {/* <FormHelperText error>
                    {touched.lastName && errors.lastName}
                  </FormHelperText> */}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong> Validator email : </strong>
                  </Typography>
                  <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              // setcover(e.target.files[0]);
              setcoverurl(URL.createObjectURL(e.target.files[0]));
              getBase64(e.target.files[0], (result) => {
                setprofile(result);

              });
            }}
          />
                  <FormHelperText error>
                    {touched.email && errors.email}
                  </FormHelperText>
                </Grid>
                <Grid item xs={12} className={classes.buttonIcon}>
                  <Button type="submit" variant="contained" size="medium" color="primary" disabled={loader1}>
                    Submit
                    {loader1 && <ButtonCircularProgress />}
                  </Button>
                  <Button
                    variant="contained"
                    size="medium"
                    color="secondary"
                    component={Link}
                    to="/validator-management"
                    style={{ marginLeft: "10px" }}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </form>
         
        
      </Box>
    </Page>
  );
};

export default EditProduct;
