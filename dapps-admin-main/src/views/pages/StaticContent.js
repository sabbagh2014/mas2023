import React, { useEffect, useState } from 'react'
import {
  Container,
  Dialog,
  Paper,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  Box,
  Link,
  Typography,
  Button,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  CircularProgress,
} from '@material-ui/core'
import { Link as RouterLink } from 'react-router-dom'
import axios from 'axios'
import Apiconfigs from 'src/Apiconfig/Apiconfig'
import { usePagination } from '@material-ui/lab/Pagination'
import Pagination from '@material-ui/lab/Pagination'

import BlockIcon from '@material-ui/icons/Block'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import VisibilityIcon from '@material-ui/icons/Visibility'

import Page from 'src/component/Page'
import { makeStyles } from '@material-ui/core/styles'
import Loader from 'src/component/Loader'

// import { DataGrid } from '@material-ui/data-grid';
const accessToken = window.sessionStorage.getItem('AccessToken')
const useStyles = makeStyles({
  table: {
    minWidth: 320,
  },
  pdbt: {
    paddingBottom: 68,
    minWidth: '1050px',
    width: 'auto',
  },

  button: {
    minWidth: 'initial',
    padding: '6px',
    marginLeft: '7px',
  },
  mainbox: {
    minHeight: 'calc(100vh - 41px)',
    paddingBottom: '1rem',
  },
  table: {
    border: '1px solid #e5e3dd',
    '& th': {
      border: '1px solid #e5e3dd',
      padding: '14px !important',
    },
    '& td': {
      border: '1px solid #e5e3dd',
      padding: '10px !important',
    },
  },
  Paper: {
    boxShadow: 'none',
  },
})

// function download_table_as_csv(table_id, separator = ",") {
//   // Select rows from table_id
//   var rows = document.querySelectorAll("table#" + table_id + " tr");
//   // Construct csv
//   var csv = [];
//   for (var i = 0; i < rows.length; i++) {
//     var row = [],
//       cols = rows[i].querySelectorAll("td, th");
//     for (var j = 0; j < cols.length; j++) {
//       // Clean innertext to remove multiple spaces and jumpline (break csv)
//       var data = cols[j].innerText
//         .replace(/(\r\n|\n|\r)/gm, "")
//         .replace(/(\s\s)/gm, " ");
//       // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
//       data = data.replace(/"/g, '""');
//       // Push escaped string
//       row.push('"' + data + '"');
//     }
//     csv.push(row.join(separator));
//   }
//   var csv_string = csv.join("\n");
//   // Download it
//   var filename =
//     "export_" + table_id + "_" + new Date().toLocaleDateString() + ".csv";
//   var link = document.createElement("a");
//   link.style.display = "none";
//   link.setAttribute("target", "_blank");
//   link.setAttribute(
//     "href",
//     "data:text/csv;charset=utf-8," + encodeURIComponent(csv_string)
//   );
//   link.setAttribute("download", filename);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// }
export default function StaticContent(props) {
  const [users, setUsers] = useState([])
  const [pages, setPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [filterData, setFilterData] = useState({
    fromDate: '05/05/2021',
    toDate: '11/06/2021',
  })
  const classes = useStyles()
  const { items } = usePagination({
    count: 10,
  })
  const [isBlock, setBlock] = React.useState(false)

  const closeBlock = () => {
    setBlock(false)
  }
  const [isDelete, setDelete] = React.useState(false)
  const [socialList, setSocialList] = useState([])

  const closeDelete = () => {
    setDelete(false)
  }
  useEffect(
    (pages) => {
      setIsLoading(true)
      axios
        .get(
          Apiconfigs.staticContentList,
          {
            fromDate: filterData.fromDate,
            toDate: filterData.toDate,
            search: filterData.search,
            // page: pages,
          },
          {
            headers: {
              token: accessToken,
            },
          },
        )
        .then((response) => {
          if (response.data.statusCode !== 200) {
          } else {
            setIsLoading(false)
            // setDisplayname
            // console.log(result)
            setUsers(response.data.result)
            // setNumpages(response.data.result.pages);
            
          }
        })
        .catch((response) => {
          
        })
    },
    [filterData, pages],
  )
  const socailHandler = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: Apiconfigs.listSocial,
      })

      if (res.data.statusCode === 200) {
        setSocialList(res.data.result)
      } else {
        setSocialList()
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    socailHandler()
  }, [])
  function createData(Sr_No, title, description) {
    return {
      Sr_No,
      title,
      description,
    }
  }
  const rows = [
    createData(1, 'Terms & Condition', 'lorem ipsum gftydftydcht ghfgf'),
    createData(2, 'Privacy Policy', 'lorem ipsum gftydftydcht ghfgf'),
    createData(3, 'About Us', 'lorem ipsum gftydftydcht ghfgf'),
  ]

  return (
    <Page title="User Management">
      <Box className={classes.mainbox}>
        <Container maxWidth="xl">
          <Box mb={5}>
            <Typography variant="h3" style={{ marginBottom: '8px' }}>
              <strong> Static Content Management</strong>
            </Typography>
            <Divider />
          </Box>

          {/* {isLoading ? (
          <Box pt={4} textAlign="center" margin={2}>
            <CircularProgress style={{ color: "#311499" }} />
          </Box>
        ) : ( */}
          <>
            <TableContainer className={classes.Paper} component={Paper}>
              <Table
                className={classes.table}
                aria-label="simple table"
                id="user_list"
              >
                <TableHead>
                  <TableRow
                    style={{
                      background:
                        'linear-gradient(180deg, #c04848 0%, #480048 100%)',
                    }}
                  >
                    <TableCell style={{ color: 'white' }}>Sr.No</TableCell>
                    <TableCell style={{ color: 'white' }} align="center">
                      Title
                    </TableCell>
                    {/* <TableCell
                      style={{ color: "white", backgroundColor: "#311499" }}
                      align="center"
                    >
                      Description
                    </TableCell> */}

                    <TableCell style={{ color: 'white' }} align="center">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users?.map((row, i) => (
                    <TableRow key={row.name}>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ width: '80px' }}
                      >
                        {i + 1}
                      </TableCell>

                      <TableCell align="center"> {row.title}</TableCell>
                      {/* <TableCell align="center">{row.IP_Address}</TableCell> */}
                      {/* <TableCell align="center">
                        {" "}
                        {row.description}
                      </TableCell> */}

                      <TableCell style={{ width: '80px' }} align="right">
                        <Box
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            // justifyContent: "center",
                          }}
                        >
                          <Link
                            to={{
                              pathname: '/view-static',
                              state: {
                                id: row.type,
                              },
                            }}
                            component={RouterLink}
                          >
                            <Button
                              variant="contained"
                              className={classes.button}
                            >
                              <VisibilityIcon style={{ fontSize: '15px' }} />
                            </Button>
                          </Link>

                          <Link
                            to={{
                              pathname: '/edit-static',
                              state: {
                                id: row,
                              },
                            }}
                            component={RouterLink}
                          >
                            <Button
                              variant="contained"
                              className={classes.button}
                            >
                              <EditIcon
                                fontSize="small"
                                style={{ fontSize: '15px' }}
                              />
                            </Button>
                          </Link>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {socialList?.map((row, i) => (
                    <TableRow key={row.name}>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ width: '80px' }}
                      >
                        {i + 9}
                      </TableCell>

                      <TableCell align="center"> {row.title}</TableCell>

                      <TableCell style={{ width: '80px' }} align="right">
                        <Box
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            // justifyContent: "center",
                          }}
                        >
                          <Link
                            to={{
                              pathname: '/view-socail',
                              state: {
                                id: row.title,
                              },
                            }}
                            component={RouterLink}
                          >
                            <Button
                              variant="contained"
                              className={classes.button}
                            >
                              <VisibilityIcon style={{ fontSize: '15px' }} />
                            </Button>
                          </Link>

                          <Link
                            to={{
                              pathname: '/edit-social',
                              state: {
                                id: row,
                              },
                            }}
                            component={RouterLink}
                          >
                            <Button
                              variant="contained"
                              className={classes.button}
                            >
                              <EditIcon
                                fontSize="small"
                                style={{ fontSize: '15px' }}
                              />
                            </Button>
                          </Link>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {isLoading && <Loader />}
            </TableContainer>
          </>
          {/* )} */}
          <Box display="flex" justifyContent="flex-end">
            {/* <Pagination
            onChange={(e, v) => setPages(v)}
            count={parseInt(numpages)}
            color="primary"
          /> */}
          </Box>
          <Dialog
            open={isBlock}
            onClose={closeBlock}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to block this User?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color="primary">Yes</Button>
              <Button onClick={closeBlock} color="primary" >
                No
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={isDelete}
            onClose={closeDelete}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this User?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color="primary">Yes</Button>
              <Button onClick={closeDelete} color="primary" >
                No
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Page>
  )
}
