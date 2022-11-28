import React, { useEffect, useState } from 'react'

import {
  Grid,
  Box,
  Typography,
  Button,
  makeStyles,
  Divider,
  CircularProgress,
} from '@material-ui/core'
import { Container } from '@material-ui/core'

import axios from 'axios'
import ApiConfigs from 'src/Apiconfig/Apiconfig'

import Page from 'src/component/Page'
import { Link, useLocation } from 'react-router-dom'
import { StreetviewOutlined } from '@material-ui/icons'
import View from '../Staticmanagement/LeftSideData/ShowLogo'

import Loader from 'src/component/Loader'
import moment from 'moment'
// viewStaticPage
const useStyles = makeStyles((theme) => ({
  bannerSectionBody: {
    padding: '80px 0px',
    minHeight: '770px',
    // background: "#dde5e4",
    '& h3': {
      colors: '#000',
    },
  },
  dailogTitle: {
    textAlign: 'Center',
    '& h2': {
      color: '#141518',
      fontSize: '23px',
    },
  },
  input_fild2: {
    width: '100%',
    '& input': {
      height: '30px',
      paddingTop: '22px',
    },
  },
  UploadBox: {
    border: 'solid 0.5px #707070',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '110px',
  },
  input_fild22: {
    width: '100%',
    '& input': {
      height: '45px',
      border: 0,
    },
    '& .MuiInput-underline:before': {
      border: 0,
    },
  },
  newbox: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'center',
  },
  imgbox: {
    width: '700px',
    maxHeight: 'calc(100vh-300px)',
  },
}))
const ViewMilestone = (props) => {
  const classes = useStyles()
  const location = useLocation()
  const [users, setUsers] = useState('')
  const ViewStatics = async (_id) => {
    try {
      const res = await axios({
        method: 'GET',
        url: ApiConfigs.viewBanner,
        params: {
          _id: _id,
        },
      })
      if (res.data.statusCode === 200) {
        setUsers(res.data.result)
        console.log(res)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    const id = location.search.split('?')
    ViewStatics(id[1])
  }, [])
  return (
    <Box className={classes.bannerSectionBody} mt={1}>
      <Container maxWidth="xl">
        <Box>
          <Typography variant="h3">View Banner</Typography>
        </Box>
        {!users ? (
          <>
            <Box textAlign="center" pt={4}>
              {/* <CircularProgress />
               */}
              <Loader />
            </Box>
          </>
        ) : (
          <Page title="View User">
            {/* <Box mb={5}>
              <Typography variant="h3" style={{ marginBottom: "8px" }}>
                <strong> {users?.bannerTitle}</strong>
              </Typography>
            </Box> */}
            <Box>
              <Box
                style={{
                  marginTop: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Box>
                  <Typography variant="h3">Title :</Typography>
                </Box>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Box>
                  <Typography variant="h3">{users?.title}</Typography>
                </Box>
              </Box>
              <Box
                style={{
                  marginTop: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Box>
                  <Typography variant="h3"> Url :</Typography>
                </Box>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Box>
                  <Typography variant="h3">
                    {users?.url ? users?.url : 'N/A'}
                  </Typography>
                </Box>
              </Box>
              <Box
                style={{
                  marginTop: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Box>
                  <Typography variant="h3"> Start Date :</Typography>
                </Box>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Box>
                  <Typography variant="h3">
                    {moment(users?.startDate ? users?.startDate : 'N/A').format(
                      'DD-MM-YYYY',
                    )}
                  </Typography>
                </Box>
              </Box>
              <Box
                style={{
                  marginTop: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Box>
                  <Typography variant="h3"> End Date :</Typography>
                </Box>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Box>
                  <Typography variant="h3">
                    {moment(users?.endDate ? users?.endDate : 'N/A').format(
                      'DD-MM-YYYY',
                    )}
                  </Typography>
                </Box>
              </Box>
              <Box
                style={{
                  marginTop: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '10px',
                  alignItems: 'center',
                }}
              >
                {/* <Box>
                  <Typography variant="h3">Description :</Typography>
                </Box> */}
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Box>
                  {/* <Typography variant="h3"  > */}
                  {users?.bannerDescription && (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: users?.bannerDescription,
                      }}
                    ></span>
                  )}{' '}
                  {/* </Typography> */}
                </Box>
              </Box>
            </Box>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '40px',
                width: '100%',
              }}
            >
              <Box className={classes.imgbox}>
                {' '}
                <img
                  src={users?.image}
                  style={{
                    width: '100%',
                  }}
                />
              </Box>
            </Box>
            <Box
              mt={3}
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Button
                variant="contained"
                size="medium"
                color="primary"
                component={Link}
                to="/banner-managment"
              >
                Back
              </Button>
            </Box>
          </Page>
        )}
      </Container>
    </Box>
  )
}

export default ViewMilestone
