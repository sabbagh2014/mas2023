import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Button,
  TextField,
  makeStyles,
} from "@material-ui/core";
import Apiconfigs from "src/Apiconfig/Apiconfig";
import axios from "axios";
import { Link } from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
const useStyles = makeStyles((theme) => ({
  input_fild: {
    backgroundColor: "#ffffff6e",
    borderRadius: "5.5px",
    border: " solid 0.5px black",
    color: "#141518",
    height: "48px",
    width: "100%",
    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "transparent",
      },
    },
    "& .MuiInputBase-input": {
      color: "#141518",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
      borderWidth: 0,
    },
  },
  imgWidth: {
    width: "115px",
    height: "55px",
    paddingTop: "50px",
  },

  LoginBox: {
    display: "flex",
    minHeight: "930px",
  },
  Button: {
    paddingTop: "50px",
    flex: "100%",
    display: "flex",
    padding: "50px",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ButtonBtn: {
    width: "172px",
    paddingTop: "50px",
  },
  Heading: {
    textAlign: "center",
    color: "#141518",
  },
  btnBox: {
    display: "flex",
    alignItems: "center",
  },
}));
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Login() {
  const classes = useStyles();
  const [name, setname] = useState("");
  const [errpopup, seterrpopup] = React.useState(false);
  const [errmsg, seterrmsg] = React.useState("");
  const [password, setpassword] = useState("");
  const [email, setEmail] = useState("");
  const [ip, setip] = useState("");
  const [severity, setseverity] = useState("info");
  const [isLoading, setIsLoading] = useState(false);
  const errhandleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    seterrpopup(false);
  };

  const apply = async () => {
    if (name === "") {
      seterrpopup(true);
      seterrmsg("Please enter a name");
      return;
    }
    if (password === "") {
      seterrpopup(true);
      seterrmsg("Please enter a password");
      return;
    }
    if (email === "") {
      seterrpopup(true);
      seterrmsg("Empty email");
      return;
    }
    
    try {
      setIsLoading(true);
      const res = await axios({
        method: "POST",
        url: Apiconfigs.addadmin,
        headers: {
          token: window.sessionStorage.getItem("AccessToken"),
        },
        data: {
          userName: name,
          password: password,
          email: email,
          ip: ip,
        },
      });
      
      setIsLoading(false);

      if (res.data.statusCode === 200) {
        setseverity("info");
        seterrpopup(true);
        seterrmsg(res.data.responseMessage);
      } else {
        setseverity("error");
        seterrpopup(true);
        seterrmsg(res.data.responseMessage);
      }
    } catch (error) {
      setIsLoading(false);

      setseverity("error");
      console.log("err", error);
      seterrpopup(true);
      if (error.response) {
        seterrmsg(error.response.data.responseMessage);
      } else {
        seterrmsg(error.message);
      }
    }
    // .then(async (res) => {
    //   if (res.data.statusCode === 200) {
    //     setseverity('info');
    //     seterrpopup(true);
    //     seterrmsg(res.data.responseMessage);
    //   } else {
    //     setseverity('error');
    //     seterrpopup(true);
    //     seterrmsg(res.data.responseMessage);
    //   }
    // })
    // .catch((err) => {
    //   setseverity('error');
    //   console.log('err', err);
    //   seterrpopup(true);
    //   seterrmsg(err.message);
    // });
  };
  const getip = async () => {
    axios
      .get("http://www.geoplugin.net/json.gp")
      .then(async (res) => {
        
        if (res.status === 200) {
          setip(res.data.geoplugin_request);
        }
      })
      .catch((err) => {
        
      });
  };

  useEffect(() => {
    getip();
  }, []);

  return (
    <Box className={classes.LoginBox}>
      <Container maxWidth="sm">
        <Box mt={6}>
          <Box align="center">
            <img src="images/BigLogo.svg" className={classes.imgWidth} />
          </Box>
          <Box>
            <h3 className={classes.Heading}>Add an Admin</h3>
          </Box>
          <form>
            <Box mt={5}>
              <label style={{ color: "black" }}>Email</label>
              <TextField
                placeholder="abc@gmail.com"
                variant="outlined"
                className={classes.input_fild}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Box>
            <Box>
              <label style={{ color: "black" }}>username</label>
              <TextField
                placeholder="Adams_berg_97"
                variant="outlined"
                className={classes.input_fild}
                onChange={(e) => setname(e.target.value)}
              />
            </Box>
            <Box>
              <label style={{ color: "black" }}>password</label>
              <TextField
                placeholder="************"
                variant="outlined"
                className={classes.input_fild}
                onChange={(e) => setpassword(e.target.value)}
              />
            </Box>

            <Box mt={5} pt={5} className={classes.btnBox}>
              <Button
                variant="contained"
                size="large"
                color="primery"
                className="btn-block removeredius"
                component={Link}
                to="/setting"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                size="large"
                color="secondary"
                className="btn-block removeredius ml-10"
                onClick={apply}
                disabled={isLoading}
              >
                Apply {isLoading && <ButtonCircularProgress />}
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
      <Snackbar
        open={errpopup}
        autoHideDuration={6000}
        onClose={errhandleClose}
      >
        <Alert onClose={errhandleClose} severity={severity}>
          {errmsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
