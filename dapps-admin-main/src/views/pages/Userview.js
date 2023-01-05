import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Button,
  Grid,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { pink } from "@mui/material/colors";
import { Link } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
// import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Slide from "@material-ui/core/Slide";
import Checkbox from "@mui/material/Checkbox";
import Apiconfigs from "src/Apiconfig/Apiconfig";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import DataLoading from "src/component/DataLoading";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";

const rows = [
  createData(
    1,
    "Adams_berg_97",
    "Adams_berg_900000",
    "175.151.1.14",
    "0xd3bcd0Aa1EAF0a3A91b45F541DcaA498E8E78180"
  ),
  createData("", "", "", "", ""),
  createData("", "", "", "", ""),
  createData("", "", "", "", ""),
  createData("", "", "", "", ""),
];
function createData(sno, name, password, ip, walletaddress) {
  return { sno, name, password, ip, walletaddress };
}
const useStyles = makeStyles((theme) => ({
  LoginBox: {
    "& h6": {
      paddingTop: "150px",
      fontWeight: "bold",
      marginBottom: "10px",
    },
  },
  table: {
    border: "1px solid #e5e3dd",
    "& th": {
      border: "1px solid #e5e3dd",
      padding: "10px !important",
    },
    "& td": {
      border: "1px solid #e5e3dd",
      padding: "10px !important",
    },
  },
  tableData: {
    backgroundColor: "rgba(209, 91, 91, 0.4)",
  },
  Paper: {
    boxShadow: "none",
  },
  Button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "250px",
  },
  ButtonBtn: {
    padding: "10px",
  },
  btnBox: {
    display: "flex",
    alignItems: "center",
  },
  paper: {
    maxWidth: "750px",
  },
  label: {
    padding: "0px",
  },
  MainRectangle: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "10px",
  },
  Rectangle: {
    width: "27.5px",
    height: "27.5px",
    border: "solid 0.5px #d15b5b",
    backgroundColor: "#792034",
    textAlign: "center",
    justifyContent: "center",
    color: "white",
    padding: "5px",
    margin: "10px",
    float: "right",
  },
  Pageno: {
    display: "flex",
    margin: "10px",
    alignItems: "center",
    justifyContent: "center",
  },
  tbody: {
    "&:nth-of-type(even)": {
      backgroundColor: "#f3f3f3",
    },
  },
}));
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Login() {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [openBlock, setOpen1] = React.useState(false);
  const [modedata, setData] = useState([]);
  const [ids, setids] = useState([]);
  const [errpopup, seterrpopup] = React.useState(false);
  const [errmsg, seterrmsg] = React.useState("");
  const [viewpass, setviewpass] = React.useState(false);
  const [msg, setmsg] = React.useState(false);
  const [admin, setadmin] = React.useState(false);
  const [bundel, setbundel] = React.useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [severity, setSeverity] = useState("info");
  const [settingPermission, setSettingPermission] = useState(false);
  const [page, setpage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [pageAdmin, setpageAdmin] = useState(1);
  const [NumberOfPagesAdmin, setNumberOfPagesAdmin] = useState(1);
  const [adminDataList, setAdminDataList] = useState([]);
  const errhandleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    seterrpopup(false);
  };
  const handleClickOpen1 = () => {
    if (ids.length > 0) {
      setOpen1(true);
    } else {
      setSeverity("error");

      seterrpopup(true);
      seterrmsg("Please select user");
    }
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const datas = async (page) => {
    await axios({
      method: "GET",
      url: Apiconfigs.moderatorList,
      params: {
        page: page,
        limit: 10,
      },
      headers: {
        token: window.sessionStorage.getItem("AccessToken"),
      },
    })
      .then(async (res) => {
        setIsLoading(false);
        if (res.data.statusCode === 200) {
          const result = res.data.result.docs.filter((data) => data.ethAccount);
          setNumberOfPages(res.data.result.pages);
          setData(result);
        }
      })
      .catch((err) => {
        setIsLoading(false);

        
      });
  };

  const adminListHandler = async (page) => {
    await axios({
      method: "GET",
      url: Apiconfigs.adminList,
      params: {
        page: page,
        limit: 1,
      },
      headers: {
        token: window.sessionStorage.getItem("AccessToken"),
      },
    })
      .then(async (res) => {
        setIsLoading(false);
        if (res.data.statusCode === 200) {
          const result = res.data.result.docs.filter((data) => data.ethAccount);
          setNumberOfPagesAdmin(res.data.result.pages);
          setAdminDataList(result);
        }
      })
      .catch((err) => {
        setIsLoading(false);

        
      });
  };

  const removelist = (id) => {
    const status = ids.includes(id);
    if (status) {
      const index = ids.indexOf(id);

      if (index > -1) {
        let arr = ids;

        arr.splice(index, 1);
        setids(arr);
      }
    } else {
      setids([...ids, id]);
    }
  };

  const removeadmin = () => {
    if (ids.length > 0) {
      
      const formData = new FormData();
      formData.append("_id", JSON.stringify(ids));
      setIsRemoving(true);
      axios({
        method: "DELETE",
        url: Apiconfigs.deladmin,
        headers: {
          token: window.sessionStorage.getItem("AccessToken"),
        },
        data: {
          _id: JSON.stringify(ids),
        },
      })
        .then(async (res) => {
          setIsRemoving(false);

          if (res.data.statusCode === 200) {
            setSeverity("info");
            seterrpopup(true);
            seterrmsg(res.data.responseMessage);
            datas(page);
          } else {
            setSeverity("error");

            seterrpopup(true);
            seterrmsg(res.data.responseMessage);
          }
        })
        .catch((err) => {
          setSeverity("error");
          setIsRemoving(false);
          seterrpopup(true);
          if (err.response) {
            seterrmsg(err.response.data.responseMessage);
          } else {
            seterrmsg(err.message);
          }
        });
    } else {
      setSeverity("error");
      seterrpopup(true);
      seterrmsg("Please select user");
    }
  };

  const permission = async () => {
    setSettingPermission(true);
    axios({
      method: "POST",
      url: Apiconfigs.Permissions,
      headers: {
        token: window.sessionStorage.getItem("AccessToken"),
      },
      data: {
        _id: JSON.stringify(ids),
        permissions: {
          viewPassword: viewpass,
          viewAndBlockMessages: msg,
          addOrRemoveNewAdmin: admin,
          suspendBundles: bundel,
        },
      },
    })
      .then(async (res) => {
        setSettingPermission(false);
        datas(page);

        if (res.data.statusCode === 200) {
          setSeverity("info");
          handleClose1();
          seterrpopup(true);
          seterrmsg(res.data.responseMessage);
        } else {
          setSeverity("error");

          seterrpopup(true);
          seterrmsg(res.data.responseMessage);
        }
      })
      .catch((err) => {
        setSeverity("error");
        setSettingPermission(false);

        seterrpopup(true);
        if (err.response) {
          seterrmsg(err.response.data.responseMessage);
        } else {
          seterrmsg(err.message);
        }
      });
  };
  useEffect(() => {
    datas(page);
  }, [page]);

  useEffect(() => {
    adminListHandler(pageAdmin);
  }, [pageAdmin]);
  return (
    <Box className={classes.LoginBox}>
      <Container maxWidth="xl">
        <Box className={classes.newbox}>
          <Typography variant="h6">Moderators:</Typography>
          {isLoading ? (
            <Container maxWidth="xl">
              <DataLoading />
            </Container>
          ) : (
            <TableContainer className={classes.Paper} component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow
                    style={{
                      background:
                        "linear-gradient(180deg, #c04848 0%, #480048 100%)",
                    }}
                  >
                    <TableCell align="Center" style={{ color: "white" }}>
                      Sr.No
                    </TableCell>
                    <TableCell align="Center" style={{ color: "white" }}>
                      User Name
                    </TableCell>
                    <TableCell align="Center" style={{ color: "white" }}>
                      Password
                    </TableCell>
                    {/* <TableCell align="Center">IP</TableCell> */}
                    <TableCell align="Center" style={{ color: "white" }}>
                      Wallet Address
                    </TableCell>
                    {/* <TableCell align="Center">Select</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {modedata.map((row, i) => (
                    <TableRow className={classes.tbody} key={row.name}>
                      <TableCell
                        style={{ color: "black" }}
                        align="Center"
                        component="th"
                        scope="row"
                      >
                        {i + 1}
                      </TableCell>
                      <TableCell style={{ color: "black" }} align="Center">
                        {row.userName}
                      </TableCell>
                      <TableCell style={{ color: "black" }} align="Center">
                        {row.password}
                      </TableCell>
                      {/* <TableCell align="Center">{row.ip}</TableCell> */}
                      <TableCell style={{ color: "black" }} align="Center">
                        {row.ethAccount.address}
                      </TableCell>
                      {/* <TableCell align="Center">
                        {" "}
                        <Checkbox
                          onClick={() => removelist(row._id)}
                          sx={{
                            color: pink[800],
                            "&.Mui-checked": {
                              color: pink[600],
                            },
                          }}
                        />
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <div className={classes.MainRectangle}>
            <span className={classes.Pageno}>
              {page} of {numberOfPages}
            </span>
            <div>
              {Array.from({ length: parseInt(numberOfPages) }).map(
                (data, i) => {
                  let value = numberOfPages - i;
                  return (
                    <div
                      onClick={() => setpage(value)}
                      className={classes.Rectangle}
                      key={i}
                    >
                      <span>{value}</span>
                    </div>
                  );
                }
              )}
            </div>
          </div>
          {/* <Box mt={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  className="btn-block btnWidth removeredius mb-10"
                  onClick={handleClickOpen1}
                >
                  Set Permitions
                </Button>
              </Grid>
            </Grid>
          </Box> */}
        </Box>
      </Container>

      <Container maxWidth="xl">
        <Box>
          <Typography variant="h6">Admin:</Typography>
          {isLoading ? (
            <Container maxWidth="xl">
              <DataLoading />
            </Container>
          ) : (
            <TableContainer className={classes.Paper} component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow
                    style={{
                      background:
                        "linear-gradient(180deg, #c04848 0%, #480048 100%)",
                    }}
                  >
                    <TableCell style={{ color: "white" }} align="Center">
                      S.No
                    </TableCell>
                    <TableCell style={{ color: "white" }} align="Center">
                      User name
                    </TableCell>
                    <TableCell style={{ color: "white" }} align="Center">
                      Password
                    </TableCell>
                    {/* <TableCell align="Center">IP</TableCell> */}
                    <TableCell style={{ color: "white" }} align="Center">
                      Wallet Address
                    </TableCell>
                    <TableCell style={{ color: "white" }} align="Center">
                      Select
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {adminDataList.map((row, i) => (
                    <TableRow className={classes.tbody} key={row.name}>
                      <TableCell
                        style={{ color: "black" }}
                        align="Center"
                        component="th"
                        scope="row"
                      >
                        {i + 1}
                      </TableCell>
                      <TableCell style={{ color: "black" }} align="Center">
                        {row.userName}
                      </TableCell>
                      <TableCell style={{ color: "black" }} align="Center">
                        {row.password}
                      </TableCell>
                      {/* <TableCell align="Center">{row.ip}</TableCell> */}
                      <TableCell style={{ color: "black" }} align="Center">
                        {row.ethAccount.address}
                      </TableCell>
                      <TableCell style={{ color: "black" }} align="Center">
                        {" "}
                        <Checkbox
                          onClick={() => removelist(row._id)}
                          sx={{
                            color: pink[800],
                            "&.Mui-checked": {
                              color: pink[600],
                            },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <div className={classes.MainRectangle}>
            <span className={classes.Pageno}>
              {page} of {NumberOfPagesAdmin}
            </span>
            <div>
              {Array.from({ length: parseInt(NumberOfPagesAdmin) }).map(
                (data, i) => {
                  let value = NumberOfPagesAdmin - i;
                  return (
                    <div
                      onClick={() => setpageAdmin(value)}
                      className={classes.Rectangle}
                      key={i}
                    >
                      <span>{value}</span>
                    </div>
                  );
                }
              )}
            </div>
          </div>
          <Box mt={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Button
                  variant="contained"
                  size="large"
                  color="primery"
                  className="btn-block btnWidth removeredius mb-10"
                  onClick={removeadmin}
                  disabled={isRemoving}
                >
                  Remove Admin {isRemoving && <ButtonCircularProgress />}
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  variant="contained"
                  size="large"
                  to="/AddAdmin"
                  component={Link}
                  color="secondary"
                  className="btn-block btnWidth removeredius mb-10"
                >
                  Add an Admin
                </Button>
              </Grid>
              <Grid item xs={12} md={12}>
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  className="btn-block btnWidth removeredius mb-10"
                  onClick={handleClickOpen1}
                >
                  Set Permissions
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <Dialog
        open={openBlock}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose1}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent className={classes.paper}>
          <DialogContentText id="alert-dialog-slide-description">
            <FormGroup>
              <div className={classes.CheckBoxValue}>
                <FormControlLabel
                  value="View Passwords"
                  className={classes.label}
                  control={
                    <Checkbox
                      className={classes.CheckBox}
                      onClick={() => setviewpass(!viewpass)}
                      color="primary"
                    />
                  }
                  label="View Passwords"
                  labelPlacement="View Passwords"
                />
              </div>
              <div>
                <FormControlLabel
                  value="View and block messages"
                  className={classes.label}
                  control={
                    <Checkbox
                      className={classes.CheckBox}
                      onClick={() => setmsg(!msg)}
                      color="primary"
                    />
                  }
                  label="View and block messages"
                  labelPlacement="View and block messages"
                />
              </div>
              <div>
                <FormControlLabel
                  value="add or remove new admins"
                  className={classes.label}
                  control={
                    <Checkbox
                      className={classes.CheckBox}
                      onClick={() => setadmin(!admin)}
                      color="primary"
                    />
                  }
                  label="add or remove new admins"
                  labelPlacement="add or remove new admins"
                />
              </div>
              <div>
                <FormControlLabel
                  value="suspend bundles"
                  className={classes.label}
                  control={
                    <Checkbox
                      className={classes.CheckBox}
                      onClick={() => setbundel(!bundel)}
                      color="primary"
                    />
                  }
                  label="suspend bundles"
                  labelPlacement="suspend bundles"
                />
              </div>
            </FormGroup>

            <Box mt={2} className={classes.btnBox}>
              <Button
                variant="contained"
                size="large"
                color="primery"
                className="btn-block removeredius"
                onClick={handleClose1}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                size="large"
                color="secondary"
                className="btn-block removeredius ml-10"
                onClick={permission}
                disabled={settingPermission}
              >
                Apply {settingPermission && <ButtonCircularProgress />}
              </Button>
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
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
