import React, { useEffect, useState } from 'react'
import {
  Container,
  Dialog,
  Paper,
  DialogActions,
  DialogContent,
  DialogContentText,
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
} from '@material-ui/core'
import { toast } from 'react-toastify'
import { Link as RouterLink } from 'react-router-dom'
import axios from 'axios'
import Apiconfigs from 'src/Apiconfig/Apiconfig'
import { useHistory } from 'react-router-dom'
import BlockIcon from '@material-ui/icons/Block'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import VisibilityIcon from '@material-ui/icons/Visibility'
import Page from 'src/component/Page'
import { makeStyles } from '@material-ui/core/styles'
import NoDataFound from 'src/component/NoDataFound'
import Loader from 'src/component/Loader'
import { Pagination } from '@material-ui/lab'
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

export default function Banners() {
  const [banners, setbanners] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [confirmAction, setConfirmAction] = useState({})
  const [openConfirm, setOpenConfirm] = useState(false)
  const history = useHistory()
  const classes = useStyles()
  const [page, setPage] = useState(1)
  const [noOfPages, setnoOfPages] = useState(1)

  const handleActive = (id) => {
    setConfirmAction({
      action: 'ACTIVE',
      id: id
    });
    setOpenConfirm(true)
  }

  const handleBlock = (id) => {
    if(banners.length == 1){
      toast.warn('You can not hide single active banner!')
      return
    }
    setConfirmAction({
      action: 'BLOCK',
      id: id
    });
    setOpenConfirm(true)
  }

  const handleDelete = (id) => {
    if(banners.length == 1){
      toast.warn('You can not delete single active banner!')
      return
    }
    setConfirmAction({
      action: 'DELETE',
      id: id
    });
    setOpenConfirm(true)
  }

  const deleteBanner = async () => {

    setOpenConfirm(false)
    if(!confirmAction.id) return false
    try {
      const response = await axios({
        method: 'DELETE',
        url: Apiconfigs.banner,
        params: {
          _id: confirmAction.id,
        },
        headers: {
          token: accessToken,
        },
      })
      if (response.data.statusCode === 200) {
        toast.success(response.data.response_message)
        getBannerList()
      } else {
        toast.error(response.data.response_message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const updateBanner = async () => {
    setOpenConfirm(false)
    if(!confirmAction.id) return false
    try {
      const response = await axios({
        method: 'PATCH',
        url: Apiconfigs.changeBannerStatus,
        data: {
          _id: confirmAction.id,
          status:  confirmAction.action,
        },
        headers: {
          token: accessToken,
        },
      })
      if (response.data.statusCode === 200) {
        toast.success(response.data.response_message)
        getBannerList()
      } else {
        toast.error(response.data.response_message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getBannerList = async () => {
      setIsLoading(true)
      try {
        const res = await axios({
          method: 'GET',
          url: Apiconfigs.listBanners,
          headers: {
            token: window.sessionStorage.getItem('AccessToken'),
          },
          params: {
            limit: 10,
            page: page,
          },
        })
        if (res.data.statusCode === 200) {
          setbanners(res.data.result.docs)
          setnoOfPages(res.data.result.pages)
          setIsLoading(false)
        }
      } catch (error) {
        console.log(error)
        setIsLoading(false)
      }
    }

  useEffect(() => {
    getBannerList();
  }, [])

  return (
    <Container maxWidth="xl">
      <Box className={classes.mainbox}>
        <Page title="Banner Management">
            <Box mb={1} style={{ marginTop: '100px' }}>
              <Box className={classes.btnsec}>
                <Typography variant="h3">Banner Management</Typography>
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  className="ml-10"
                  onClick={() =>
                    history.push({
                      pathname: '/add-banner',
                      state: {
                        componentCall: 'Add',
                      },
                    })
                  }
                >
                  Add new banner
                </Button>
              </Box>
            </Box>

            {isLoading ? (
              <Box pt={4} textAlign="center" margin={2}>
                <Loader />
              </Box>
            ) : (
              <>
                {banners.length === 0 ? (
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
                          <TableCell align="center" style={{ color: 'white' }}>
                            Sr.No
                          </TableCell>
                          <TableCell align="center" style={{ color: 'white' }}>
                            Title
                          </TableCell>
                          <TableCell align="center" style={{ color: 'white' }}>
                            Image
                          </TableCell>
                          <TableCell align="center" style={{ color: 'white' }}>
                            Status
                          </TableCell>
                          <TableCell align="center" style={{ color: 'white' }}>
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {banners &&
                          banners.map((row, index) => (
                            <TableRow className={classes.tbody} key={index}>
                              <TableCell
                                style={{ color: 'black' }}
                                align="center"
                                component="th"
                                scope="row"
                              >
                                {index + 1}
                              </TableCell>
                              <TableCell
                                style={{ color: 'black' }}
                                align="center"
                              >
                                {row.title}
                              </TableCell>
                              <TableCell
                                style={{ color: 'black' }}
                                align="center"
                              >
                                {row.mediaType === 'video' ? (
                                  <video
                                    controls="false"
                                    autoPlay="true"
                                    loop
                                    muted
                                    playsinline="true"
                                    style={{ width: '80px', height: '50px' }}
                                  >
                                    <source src={row.image} type="video/mp4" />
                                  </video>
                                ) : (
                                  <img
                                    src={row.media}
                                    style={{ width: '80px', height: '50px' }}
                                  />
                                )}
                              </TableCell>
                              {row.status === 'BLOCK' ||
                              row.status === 'DELETE' ? (
                                <>
                                  {' '}
                                  <TableCell
                                    align="center"
                                    style={{ color: 'red' }}
                                  >
                                    {row.status === 'BLOCK'
                                      ? 'BLOCK'
                                      : 'DELETE'}
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
                                align="center"
                              >
                                <Box
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <Link
                                    to={{
                                      pathname: '/view-banner/'+row._id,
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
                                      pathname: '/edit-banner/'+row._id,
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
                                    onClick={() => {
                                      if(row.status == 'ACTIVE'){
                                        handleBlock(row._id)
                                      } else {
                                        handleActive(row._id)
                                      }
                                    }}
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
                                    onClick={() => {
                                      if(row.status == 'ACTIVE'){
                                        toast.warn('You can not delete active banner')
                                      } else {
                                        handleDelete(row._id)
                                      }
                                    }}
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
                {banners?.length >= 10 && (
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
            <Dialog
              open={openConfirm}
              onClose={()=>setOpenConfirm(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {`Are you sure  want to ${confirmAction.action} this banner?`}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  color="primary"
                  onClick={()=>{
                    if(confirmAction.action =='DELETE'){
                       deleteBanner()
                    } else {
                      updateBanner()
                    }
                  }}
                >
                  Yes 
                </Button>
                <Button onClick={()=>setOpenConfirm(false)} color="primary" autoFocus>
                  No
                </Button>
              </DialogActions>
            </Dialog>
          

        </Page>
      </Box>
    </Container>
  )
}
