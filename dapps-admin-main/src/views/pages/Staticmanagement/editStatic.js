import React, { useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";
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
  MenuItem,
  FormControl,
} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Page from "src/component/Page";
import axios from "axios";
import ApiConfigs from "src/Apiconfig/Apiconfig";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClassNames } from "@emotion/react";
import JoditEditor from "jodit-react";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";

// import { isValidAlphabet, isValidationEmail, isValidContact } from '../../../Validation/Validation';
const useStyles = makeStyles({
  texbox: {
    rows: "5",
    overflow: "hidden",
    height: "auto",
    resize: "none",
  },
  UploadBox: {
    border: "solid 0.5px #bdbdbd",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "110px",
    borderRadius: "6px",
  },
  input_fild22: {
    width: "100%",
    padding: "17px",
    "& input": {
      height: "45px",
      border: 0,
    },
    "& .MuiInput-underline:before": {
      border: 0,
    },
  },
});

const EditPlan = (props) => {
  const location = useLocation();
  const classes = useStyles();
  console.log("location.state.id", location.state.id);
  const [unit, setUnit] = React.useState("CORPORATE");
  const [isConfirm, setConfirm] = React.useState(false);
  const planId = props?.location?.state?.id || null;
  const openConfirm = () => {
    setConfirm(true);
  };

  const closeConfirm = () => {
    setConfirm(false);
  };
  const history = useHistory();

  const accessToken = window.sessionStorage.getItem("AccessToken");

  const statics = location.state.id;

  const [isEdit, setIsEdit] = React.useState(true);
  const [prodImg, setProductImgBuild] = useState(null);
  const [baseImg, setBaseImage] = useState(null);
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

  const _onProfilePicChange = (e) => {
    console.log("eeee", e);
    const name = e.target.name;
    const value = URL.createObjectURL(e.target.files[0]);
    setProductImgBuild(value); //will give displayable image use it for preview also
    getBase64(e.target.files[0], (result) => {
      console.log("result", result);
      setBaseImage(result); //will give base64
      const temp = { ...formData, [name]: result };
      console.log("temp", temp);
      setFormData(temp);
    });
  };
  const [bannerDescription, setbannerDescription] = useState(
    statics?.description
  );
  const [formData, setFormData] = useState({
    amount: statics?.description,
    title: statics?.title,

    // expiryDate: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const _onInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const temp = { ...formData, [name]: value };
    setFormData(temp);
  };
  const editor = useRef(null);
  const config = {
    readonly: false,
  };
  const submitHandler = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(ApiConfigs.editStaticPage, {
        _id: location.state.id._id,
        // amount: formData.amount,
        // expiryDate: formData.expiryDate,
        title: formData.title,
        description: bannerDescription,
      });

      if (response.data.responseCode !== 200) {
        // alert(response.data.response_message);
        toast.success(response.data.response_message);
        history.push("/static-content-management");
        setIsLoading(false);
      } else {
        openConfirm();
        console.log("response", response);
        setIsLoading(false);

        toast.error(response.data.response_message);
      }
    } catch (err) {
      console.error(err.response);
      toast.error(err);
      setIsLoading(false);
    }
  };
  return (
    <Container maxWidth="xl" style={{ marginTop: "50px" }}>
      <Page title="Create Plan">
        <Box mb={1}>
          <Box style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h3" style={{ marginBottom: "8px" }}>
              <strong> Edit Static</strong>
            </Typography>
            <Box style={{ textAlign: "end" }}>
              <Button onClick={() => setIsEdit(!isEdit)}>
                <Typography variant="h5">Edit </Typography>
                <EditIcon fontSize="small" style={{ marginLeft: "5px" }} />
              </Button>
            </Box>
          </Box>
          <Divider />
        </Box>

        <Box mt={2}>
          <FormControl style={{ width: "100%" }}>
            <Grid container spacing={3}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography variant="body2" style={{ marginBottom: "10px" }}>
                  <strong> Enter Title :</strong>
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  type="text"
                  disabled={isEdit}
                  // placeholder={statics?.title}
                  // disabled={true}
                  required
                  errorText={"this is required field"}
                  name="title"
                  value={formData.title}
                  onChange={_onInputChange}
                />
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {/* <Typography variant="body2" style={{ marginBottom: "10px" }}>
                  <strong> Enter Description :</strong>
                </Typography>
                <TextField
                  multiline
                  rows={5}
                  variant="outlined"
                  fullWidth
                  type="text"
                  disabled={isEdit}
                  // placeholder={statics?.description}
                  required
                  errorText={"this is required field"}
                  name="amount"
                  value={formData.amount}
                  onChange={_onInputChange}
                  className={classes.texbox}
                  rows={5}
                  multiline
                /> */}
                <Box mb={2}>
                  <Grid container spacing={0}>
                    <Grid item xs={12} md={12}>
                      <label>Details:</label>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Box className={classes.UploadBox}>
                        <JoditEditor
                          ref={editor}
                          disabled={isEdit}
                          value={bannerDescription}
                          config={config}
                          name="descritionValue"
                          variant="outlined"
                          fullWidth
                          size="small"
                          tabIndex={1}
                          onBlur={(e) => setbannerDescription(e)} // preferred to use only this option to update the content for performance reasons
                          onChange={(newContent) => {}}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item md={12} xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  style={{ marginRight: "10px" }}
                  onClick={submitHandler}
                  disabled={isLoading}
                >
                  Submit
                  {isLoading && <ButtonCircularProgress />}
                </Button>
                <Button
                  component={Link}
                  to="/static-content-management"
                  variant="contained"
                  color="secondary"
                  size="medium"
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </FormControl>
          <ToastContainer />
        </Box>

        <Dialog
          open={isConfirm}
          onClose={closeConfirm}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Plan edited successfully
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={() => history.push("/user")}>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </Page>
    </Container>
  );
};

export default EditPlan;
