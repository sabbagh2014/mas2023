import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Container,
  Button,
  TextField,
  makeStyles,
  FormHelperText,
  Typography,
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
import { isValidationEmail } from "src/utils";
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
  const [pass, setpass] = useState("");
  const [err, seterr] = useState("");
  const [err1, seterr1] = useState("");
  const [show, setshow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errpopup, seterrpopup] = React.useState(false);
  const [errmsg, seterrmsg] = React.useState("");
  const [severity, setSeverity] = useState("info");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const sumitHandler = async () => {
    if (name === "") {
      seterr("*Please enter a email");
      return;
    }

    if (name !== "") {
      if (name === "" || isValidationEmail(name) === true) {
        setIsLoading(true);
        axios({
          method: "POST",
          url: Apiconfigs.forgotPassword,
          data: {
            email: name,
            type: "admin",
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
      } else {
        setIsEmailValid(true);
      }
    }
  };
  const something = (event) => {
    if (event.keyCode === 13) {
      sumitHandler();
    }
  };

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
            Forgot your Password ?
          </Typography>
          <Typography style={{ paddingTop: "20px" }}>
            Enter your registered email id here and a verification link will be
            sent to the email id.
          </Typography>
        </Box>
        <form>
          <Box mt={0}>
            <label style={{ color: "black" }}> Email Address</label>
            <TextField
              placeholder="Enter your email address"
              variant="outlined"
              className={classes.input_fild}
              // onBlur={handleChange}
              error={err !== "" && name === ""}
              helperText={err !== "" && name === "" ? err : ""}
              onChange={(e) => setname(e.target.value)}
            />
            {isEmailValid && (
              <FormHelperText style={{ color: "#ff7d68" }}>
                Please enter a valid email address
              </FormHelperText>
            )}
          </Box>

          <Box mt={4} align="center">
            <Button
              variant="contained"
              size="large"
              color="secondary"
              className="btnWidth"
              // component={Link}
              // to="/dashboard"
              onClick={sumitHandler}
              disabled={isLoading}
            >
              Reset {isLoading && <ButtonCircularProgress />}
            </Button>
          </Box>
        </form>
      </Container>
    </Box>
  );
}
