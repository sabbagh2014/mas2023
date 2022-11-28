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
    borderRadius: "5.5px",
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

export default function Login() {
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
  const [message, setMessage] = useState();

  useEffect(() => {
    if (auth.userLoggedIn) {
      history.push("/");
    }
  }, [auth.userLoggedIn]);

  const sumitHandler = async () => {
    if (name === "") {
      seterr("*Please enter a email");
      return;
    }
    if (pass === "") {
      seterr1("*Please enter a password");
      return;
    }

    if (name !== "" && pass !== "") {
      if (name === "" || isValidationEmail(name) === true) {
        setIsLoading(true);
        axios({
          method: "POST",
          url: Apiconfigs.login,
          data: {
            email: name,
            password: pass,
          },
        })
          .then(async (res) => {
            if (res.data.statusCode === 200) {
              auth.userLogIn(true, res.data.result.token);

              toast.success(res.data.responseMessage);
              window.sessionStorage.setItem(
                "userType",
                res?.data?.result?.userType
              );
              window.sessionStorage.setItem(
                "permission",
                JSON.stringify(res.data.result.permissions)
              );

              history.push("/");
            } else {
              seterrmsg(res.data.responseMessage);
              toast.error(res.data.responseMessage);
            }
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setMessage("Try after sometime...");
            setIsLoading(false);
          });
      } else {
        setIsEmailValid(true);
      }
    }
  };
  setTimeout(() => {
    setMessage();
  }, 6000);
  const something = (event) => {
    if (event.keyCode === 13) {
      sumitHandler();
    }
  };
  useEffect(() => {
    window.sessionStorage.removeItem("userType");
    window.sessionStorage.removeItem("permission");
    window.sessionStorage.removeItem("AccessToken");
  }, []);

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
        <form>
          <Box mt={5}>
            <label style={{ color: "black" }}>Your Email Account</label>
            <TextField
              placeholder="Adams_berg_97"
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
          <Box>
            <label style={{ color: "black" }}>Your Password</label>
            <TextField
              placeholder="************"
              variant="outlined"
              type={show ? "text" : "password"}
              className={classes.input_fild}
              // onBlur={handleChange}
              error={err1 !== "" && pass === ""}
              helperText={err1 !== "" && pass === "" ? err1 : ""}
              onChange={(e) => setpass(e.target.value)}
              onKeyDown={(e) => something(e)}
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
          </Box>
          <Box className={classes.TextSection}>
            <Link to="/forgot-password" style={{ color: "inherit" }}>
              <Typography variant="h6">Forgot Password ?</Typography>
            </Link>
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
              Login {isLoading && <ButtonCircularProgress />}
            </Button>
            {message ? (
              <Alert
                severity="error"
                style={{ marginTop: "1rem", width: "200px" }}
              >
                <Typography> {message}</Typography>
              </Alert>
            ) : (
              ""
            )}
          </Box>
        </form>
      </Container>
    </Box>
  );
}
