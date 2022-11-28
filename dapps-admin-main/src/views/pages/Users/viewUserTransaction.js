import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  makeStyles,
  Grid,
  Paper,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
} from "@material-ui/core";

import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfig";
import { Link } from "react-router-dom";
import NoDataFound from "src/component/NoDataFound";
import moment from "moment";
import Loader from "src/component/Loader";
import { Pagination } from "@material-ui/lab";
import { sortAddress } from "src/utils";
import * as XLSX from "xlsx";
const useStyles = makeStyles((theme) => ({
  input_fild: {
    backgroundColor: "#ffffff6e",
    borderRadius: "5.5px",
    border: " solid 0.5px #e5e3dd",
    color: "#141518",
    height: "48px",
    width: "100%",
    maxWidth: "500px",
    margin: "0 auto",
    borderRadius: "20px",
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
  LoginBox: {
    minHeight: "calc(100vh - 101px)",

    "& h6": {
      fontWeight: "bold",
      marginBottom: "10px",
      fontSize: "20px",
      color: "#000",
      "& span": {
        fontWeight: "300",
      },
    },
  },
  TokenBox: {
    border: "solid 0.5px #e5e3dd",
    padding: "5px",
  },
  masBoxFlex: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
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
      height: "45px",
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
  dlflex: {
    "& div": {
      marginTop: "2rem",
      "& span": {
        border: "1px solid #e8e7e7",
        fontSize: "20px",
        padding: "7px",
        marginRight: "6px",
      },
    },
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  table: {
    minWidth: 320,
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
}));

export default function Login(props) {
  const { location } = props;
  const classes = useStyles();
  const [viewId, setViewId] = useState();
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState(1);
  const [loaderDepost, setLoaderDeposit] = useState(false);
  const [depositList, setDepositList] = useState([]);
  const [fireSearch, setFireSearch] = useState(false);

  const [filterData, setFilterData] = useState({
    toDate: "",
    fromDate: "",
  });
  const _onInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const temp = { ...filterData, [name]: value };

    setFilterData(temp);
  };

  const depositListHandler = async (filter) => {
    if(!viewId) return;
    setLoaderDeposit(true);
    await axios({
      method: "GET",
      url: Apiconfigs.transactionList,
      headers: {
        token: sessionStorage.getItem("AccessToken"),
      },
      params: {
        userId: viewId,
        limit: 10,
        page: page,
        fromDate: filter?.fromDate
          ? moment(filter?.fromDate).format("YYYY-MM-DD")
          : null,
        toDate: filter?.toDate
          ? moment(filter?.toDate).format("YYYY-MM-DD")
          : null,
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          setLoaderDeposit(false);
          setNoOfPages(res.data.result.pages);
          setDepositList(res.data.result.docs);
        } else {
          setLoaderDeposit(false);
        }
      })
      .catch((err) => {
        setLoaderDeposit(false);

        console.log(err.message);
      });
  };
  useEffect(() => {
    const id = location.search.split("?");
    setViewId(id[1]);
    depositListHandler();
  }, [viewId, page]);

  useEffect(() => {
    if (filterData.fromDate !== "" || filterData.toDate !== "") {
      if (fireSearch) {
        depositListHandler(filterData);
      }
    }
  }, [filterData, fireSearch]);

  const downloadExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(depositList);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "userList");
    let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workBook, "user_list.xlsx");
  };

  return (
    <Box className={classes.LoginBox} mb={5}>
      <Box className={classes.masBoxFlex}>
        <Typography variant="h6">All transaction</Typography>
      </Box>

      <Typography variant="h6">Filter</Typography>
      <Grid container spacing={3} alignItems="flex-end">
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <Typography>From</Typography>
          <TextField
            id="outlined-basic"
            type="date"
            variant="outlined"
            fullWidth
            name="fromDate"
            onChange={_onInputChange}
            value={filterData.fromDate}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <Typography>To</Typography>
          <TextField
            id="outlined-basic"
            type="date"
            variant="outlined"
            fullWidth
            name="toDate"
            onChange={_onInputChange}
            value={filterData.toDate}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={3}>
          <Box className={classes.btnSection}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              style={{ backgroundColor: "#5a86ff" }}
              onClick={() => setFireSearch(true)}
            >
              Search
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <Box className={classes.btnSection}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              style={{ backgroundColor: "#5a86ff" }}
              onClick={downloadExcel}
            >
              Download CSV
            </Button>
          </Box>
        </Grid>
      </Grid>

      {loaderDepost ? (
        <Loader />
      ) : (
        <>
          {depositList && depositList.length > 0 ? (
            <Box style={{ paddingTop: "20px" }}>
              <TableContainer className={classes.Paper} component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead
                    style={{
                      background:
                        "linear-gradient(180deg, #c04848 0%, #480048 100%)",
                    }}
                  >
                    <TableRow>
                      <TableCell align="Center" style={{ color: "white" }}>
                        Sr.No
                      </TableCell>
                      <TableCell align="Center" style={{ color: "white" }}>
                        Payment date
                      </TableCell>
                      <TableCell align="Center" style={{ color: "white" }}>
                        Amount{" "}
                      </TableCell>
                      <TableCell align="Center" style={{ color: "white" }}>
                        From{" "}
                      </TableCell>
                      <TableCell align="Center" style={{ color: "white" }}>
                        To{" "}
                      </TableCell>
                      <TableCell align="Center" style={{ color: "white" }}>
                        Transaction type{" "}
                      </TableCell>
                      <TableCell align="Center" style={{ color: "white" }}>
                        Transaction earning{" "}
                      </TableCell>
                      <TableCell align="Center" style={{ color: "white" }}>
                        Transaction id{" "}
                      </TableCell>
                      <TableCell align="Center" style={{ color: "white" }}>
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {depositList &&
                      depositList?.map((row, index) => (
                        <TableRow className={classes.tbody} key={row.coinName}>
                          <TableCell
                            style={{ color: "black" }}
                            align="Center"
                            component="th"
                            scope="row"
                          >
                            {index + 1}
                          </TableCell>
                          <TableCell style={{ color: "black" }} align="Center">
                            {moment(row?.updatedAt).format(
                              "DD-MM-YYYY hh:mm A"
                            )}
                          </TableCell>
                          <TableCell style={{ color: "black" }} align="Center">
                            {row?.amount}&nbsp;
                            {row?.coinName}
                          </TableCell>
                          <TableCell style={{ color: "black" }} align="Center">
                            {sortAddress(row?.fromAddress)}
                          </TableCell>
                          <TableCell style={{ color: "black" }} align="Center">
                            {sortAddress(row?.recipientAddress)}
                          </TableCell>
                          <TableCell style={{ color: "black" }} align="Center">
                            {row?.transactionType}
                          </TableCell>
                          <TableCell style={{ color: "black" }} align="Center">
                            {row?.adminCommission
                              ? parseFloat(parseFloat(row?.adminCommission).toFixed(4))
                              : "N/A"}
                          </TableCell>
                          <TableCell style={{ color: "black" }} align="Center">
                            {row?._id}
                          </TableCell>
                          <TableCell style={{ color: "black" }} align="Center">
                            {row.transactionStatus}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <Box display="flex" justifyContent="center" my={2}>
                  {noOfPages > 1 && (
                    <Pagination
                      count={noOfPages}
                      page={page}
                      onChange={(e, v) => setPage(v)}
                    />
                  )}
                </Box>
              </TableContainer>
            </Box>
          ) : (
            <Box align="center" mt={4} mb={5}>
              <NoDataFound />
            </Box>
          )}
        </>
      )}

      <Box mt={3} display="flex" justifyContent="center">
        <Button
          variant="contained"
          size="medium"
          color="primary"
          component={Link}
          to="/user"
        >
          Back
        </Button>
      </Box>
    </Box>
  );
}
