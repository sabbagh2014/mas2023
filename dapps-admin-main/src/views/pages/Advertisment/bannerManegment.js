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
import { ToastContainer, toast } from 'react-toastify'

import { Link as RouterLink } from 'react-router-dom'
import axios from 'axios'
import Apiconfigs from 'src/Apiconfig/Apiconfig'
import { usePagination } from '@material-ui/lab/Pagination'

import { useHistory, useLocation } from 'react-router-dom'
import BlockIcon from '@material-ui/icons/Block'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import VisibilityIcon from '@material-ui/icons/Visibility'
import Switch from '@material-ui/core/Switch'
import { Pagination } from '@material-ui/lab'
import Page from 'src/component/Page'
import { makeStyles } from '@material-ui/core/styles'
import DataLoading from 'src/component/DataLoading'
import NoDataFound from 'src/component/NoDataFound'
import ButtonCircularProgress from 'src/component/ButtonCircularProgress'
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
  table: {
    border: '1px solid #e5e3dd',
    '& th': {
      border: '1px solid #e5e3dd',
    },
    '& td': {
      border: '1px solid #e5e3dd',
    },
  },
  tbody: {
    '&:nth-of-type(even)': {
      backgroundColor: '#f3f3f3',
    },
  },
  mainbox: { minHeight: 'calc(100vh - 141px)' },
  btnsec: {
    display: 'flex',
    justifyContent: 'space-between',
  },
})

export default function bunnerMangment(props) {
  const [users, setUsers] = useState([])
  const [pages, setPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const history = useHistory()
  const [details, setdetails] = useState([])
  const classes = useStyles()
  const [idds, setIdd] = useState([])
  const [isDelete, setDelete] = React.useState(false)
  const [loaderDe, setloaderDe] = React.useState(false)
  const [on, setOn] = React.useState(false)
  const [page, setPage] = useState(1)
  const [noOfPages, setnoOfPages] = useState(1)
  const closeDelete = () => {
    setDelete(false)
  }
  const handleDelete = (id) => {
    setIdd(id)
    setDelete(true)
  }
  const deleteBanner = async (idd) => {
    setloaderDe(true)

    try {
      const response = await axios({
        method: 'DELETE',
        url: Apiconfigs.removeBanner,
        params: {
          _id: idds._id,
        },
        headers: {
          token: accessToken,
        },
      })
      if (response.data.statusCode === 200) {
        toast.success(response.data.response_message)
        BannerList()
        setDelete(false)
        setloaderDe(false)
      } else {
        toast.error(response.data.response_message)
        setloaderDe(false)
      }
    } catch (err) {
      console.log(err)
      setloaderDe(false)
    }
  }
  const BannerList = async () => {
    try {
      setIsLoading(true)
      const res = await axios({
        method: 'GET',
        url: Apiconfigs.listBanner,
        headers: { token: accessToken },
        params: {
          limit: 10,
          page: page,
        },
      })
      if (res.data.statusCode === 200) {
        setUsers(res.data.result.docs)
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }
  useEffect(() => {
    BannerList()
  }, [page])
  const handleActive = (id) => {
    setIdd(id)
    setOn(true)
  }

  const handleDeactive = () => {
    setOn(false)
  }
  const activeBanner = async (idd) => {
    setloaderDe(true)

    try {
      const response = await axios({
        method: 'PUT',
        url: Apiconfigs.activeDeactiveAdvertisement,
        params: {
          _id: idds?._id,
        },
        headers: {
          token: accessToken,
        },
      })
      if (response.data.statusCode === 200) {
        toast.success(response.data.response_message)
        BannerList()
        setOn(false)
        setloaderDe(false)
      } else {
        toast.error(response.data.response_message)
        setloaderDe(false)
      }
    } catch (err) {
      console.log(err)
      setloaderDe(false)
    }
  }

  return (
    <Container maxWidth="xl">
      <Box className={classes.mainbox}>
        <Page title="User Management">
          <Box mb={1} style={{ marginTop: '100px' }}>
            <Box className={classes.btnsec}>
              <Typography variant="h3">Ad Management</Typography>
              <Button
                variant="contained"
                size="large"
                color="secondary"
                className="ml-10"
                onClick={() => history.push('/add-banner')}
              >
                Add an advertisement
              </Button>
            </Box>
          </Box>

          {isLoading ? (
            <Box pt={4} textAlign="center" margin={2}>
              <Loader />
            </Box>
          ) : (
            <>
              {users.length === 0 ? (
                <Box align="center" mt={4} mb={5}>
                  <NoDataFound />
                </Box>
              ) : (
                <TableContainer className={classes.Paper} component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead
                      style={{
                        background:
                          'linear-gradient(180deg, #c04848 0%, #480048 100%)',
                      }}
                    >
                      <TableRow>
                        <TableCell align="Center" style={{ color: 'white' }}>
                          Sr.No
                        </TableCell>
                        <TableCell align="Center" style={{ color: 'white' }}>
                          Title
                        </TableCell>
                        {/* <TableCell align="Center" style={{ color: "white" }}>
                          Description
                        </TableCell> */}
                        <TableCell align="Center" style={{ color: 'white' }}>
                          Image
                        </TableCell>
                        <TableCell align="Center" style={{ color: 'white' }}>
                          Status
                        </TableCell>
                        <TableCell align="Center" style={{ color: 'white' }}>
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users &&
                        users.map((row, index) => (
                          <TableRow className={classes.tbody} key={row.name}>
                            <TableCell
                              style={{ color: 'black' }}
                              align="Center"
                              component="th"
                              scope="row"
                            >
                              {index + 1}
                            </TableCell>
                            <TableCell
                              style={{ color: 'black' }}
                              align="Center"
                            >
                              {row?.title}
                            </TableCell>
                            <TableCell
                              style={{ color: 'black' }}
                              align="Center"
                            >
                              {row?.mediaType === 'video' ? (
                                <video
                                  controls="false"
                                  autoPlay="true"
                                  loop
                                  muted
                                  playsinline="true"
                                  width="80px"
                                  height="50px"
                                >
                                  <source src={row?.image} type="video/mp4" />
                                </video>
                              ) : (
                                <img
                                  src={row?.image}
                                  onClick={() => window.open(row?.url)}
                                  style={{ width: '80px', height: '50px' }}
                                />
                              )}
                            </TableCell>
                            {row?.status === 'BLOCK' ||
                            row?.status === 'DELETE' ? (
                              <>
                                {' '}
                                <TableCell
                                  align="center"
                                  style={{ color: 'red' }}
                                >
                                  {row?.status === 'BLOCK' ? 'BLOCK' : 'DELETE'}
                                </TableCell>
                              </>
                            ) : (
                              <>
                                {' '}
                                <TableCell align="center">
                                  {row.status}
                                </TableCell>
                              </>
                            )}

                            <TableCell
                              style={{ color: 'black', width: '185px' }}
                              align="Center"
                            >
                              <Box
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  // justifyContent: "center",
                                }}
                              >
                                <Link
                                  to={{
                                    pathname: '/view-banner',
                                    state: {
                                      id: row?._id,
                                    },
                                    search: row?._id,
                                  }}
                                  component={RouterLink}
                                >
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    style={{
                                      width: '30px',
                                      height: '30px',
                                    }}
                                  >
                                    <VisibilityIcon
                                      style={{ fontSize: '15px' }}
                                    />
                                  </Button>
                                </Link>

                                <Link
                                  to={{
                                    pathname: '/edit-banner',
                                    state: {
                                      id: row,
                                    },
                                  }}
                                  component={RouterLink}
                                >
                                  <Button
                                    variant="contained"
                                    className={classes.button}
                                    style={{
                                      width: '30px',
                                      height: '30px',
                                    }}
                                  >
                                    <EditIcon
                                      fontSize="small"
                                      style={{ fontSize: '15px' }}
                                    />
                                  </Button>
                                </Link>

                                <Button
                                  variant="contained"
                                  className={classes.button}
                                  onClick={() => handleActive(row)}
                                  style={{ fontSize: '15px', width: '30px' }}
                                >
                                  <BlockIcon
                                    fontSize="small"
                                    style={{ fontSize: '15px' }}
                                  />
                                </Button>

                                <Button
                                  variant="contained"
                                  className={classes.button}
                                  onClick={() => handleDelete(row)}
                                  style={{ fontSize: '15px', width: '30px' }}
                                >
                                  <DeleteIcon
                                    fontSize="small"
                                    style={{ fontSize: '15px' }}
                                  />
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              {users?.length >= 10 && (
                <Box mb={2} mt={2} display="flex" justifyContent="flex-start">
                  <Pagination
                    count={noOfPages}
                    page={page}
                    onChange={(e, v) => setPage(v)}
                  />
                </Box>
              )}
            </>
          )}

          <Box>
            {/* <Pagination
              onChange={(e, v) => setPages(v)}
              count={parseInt(numpages)}
              color="primary"
            /> */}

            <Dialog
              open={on}
              onClose={handleDeactive}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {`Are you sure  want to ${
                    idds.status === 'BLOCK' ? 'ACTIVE' : 'BLOCK'
                  } this banner?`}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  color="primary"
                  disabled={loaderDe}
                  onClick={activeBanner}
                >
                  Yes {loaderDe && <ButtonCircularProgress />}
                </Button>
                <Button onClick={handleDeactive} color="primary" >
                  No
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
          {/* <Dialog
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
              <Button onClick={closeBlock} color="primary" autoFocus>
                No
              </Button>
            </DialogActions>
          </Dialog> */}

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
              <Button color="primary" onClick={deleteBanner}>
                Yes
              </Button>
              <Button onClick={closeDelete} color="primary" >
                No
              </Button>
            </DialogActions>
          </Dialog>
        </Page>
      </Box>
    </Container>
  )
}
