import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Container,
  Button,
  TextField,
  makeStyles,
  FormHelperText,
  Typography,
  Grid,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { AuthContext } from "src/context/Auth";
import { toast } from "react-toastify";
import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfig";
import { Link, useHistory } from "react-router-dom";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import { useLocation } from "react-router-dom";
import { Form, Formik } from "formik";
import * as yep from "yup";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  input_fild: {
    backgroundColor: "#ffffff6e",
    borderRadius: "5.5px",
    border: " solid 0.5px black",
    color: "#141518",
    height: "48px",
    width: "100%",

    "& helperText": {
      marginLeft: "-10px",
    },
  },
  LoginBox: {
    display: "flex",
    padding: "50px 0px",
  },
  TextSection: {
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
    marginTop: "5px",
  },
}));

export default function ForgotPassword() {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [name, setname] = useState("");
  const location = useLocation();
  const [show, setshow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errpopup, seterrpopup] = React.useState(false);
  const [errmsg, seterrmsg] = React.useState("");
  const [severity, setSeverity] = useState("info");
  const [token, setToken] = useState();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const resetPaswordHandler = async (values) => {
    setIsLoading(true);
    axios({
      method: "PUT",
      url: Apiconfigs.resetPassword + token,
      data: {
        newPassword: values.newPassword,
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          toast.success(res.data.responseMessage);
          history.push("/login");
        } else {
          seterrmsg(res.data.responseMessage);
          toast.error(res.data.responseMessage);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.responseMessage);
        } else {
          toast.error(err.message);
        }
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const locataionToken = location.search.split("=");

    if (locataionToken[1]) {
      setToken(locataionToken[1]);
    }
  }, [location]);

  return (
    <Box className={classes.LoginBox}>
      <Snackbar
        open={errpopup}
        autoHideDuration={6000}
        onClose={() => seterrpopup(false)}
      >
        <Alert onClose={() => seterrpopup(false)} severity={severity}>
          {errmsg}
        </Alert>
      </Snackbar>
      <Container maxWidth="sm">
        <Box align="center">
          <img src="images/BigLogo.svg" className="imgWidth" />
        </Box>
        <Box align="center" mt={2}>
          <Typography variant="h5" style={{ textDecoration: "underline" }}>
            Reset Password
          </Typography>
          <Typography style={{ paddingTop: "20px", fontStyle: "italic" }}>
            We can help you reset your password using the email linked to your
            account.
          </Typography>
        </Box>

        <Formik
          onSubmit={(values) => resetPaswordHandler(values)}
          initialValues={{
            newPassword: "",
          }}
          initialStatus={{
            success: false,
            successMsg: "",
          }}
          validationSchema={yep.object().shape({
            newPassword: yep
              .string()
              .required("Password is required")
              .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
              ),
          })}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            touched,
            values,
            setFieldValue,
          }) => (
            <Form>
              <Grid item classname="fullwidth">
                <Box mt={3}>
                  <TextField
                    className={classes.input_fild}
                    type={show ? "text" : "password"}
                    hintText="At least 8 characters"
                    floatingLabelText="Enter your new password"
                    variant="outlined"
                    fullWidth
                    name="newPassword"
                    placeholder="Enter your new password"
                    error={Boolean(touched.newPassword && errors.newPassword)}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setshow(!show)}
                          >
                            {show ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <FormHelperText error>
                    {touched.newPassword && errors.newPassword && (
                      <ul
                        style={{
                          padding: "0px 0px 0px 19px",
                          marginTop: "0px",
                        }}
                      >
                        <li>Must be at least 8 Characters long</li>
                        <li>Must be atleast One Uppercase letter</li>
                        <li> Must be atleast One Lowercase letter</li>
                        <li> Must be at least One digit</li>
                        <li>Must be at least one special case Character</li>
                      </ul>
                    )}
                  </FormHelperText>
                </Box>
              </Grid>

              <Box mt={4} align="center">
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  disabled={isLoading}
                >
                  Submit and Reset
                  {isLoading && <ButtonCircularProgress />}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Container>
    </Box>
  );
}
