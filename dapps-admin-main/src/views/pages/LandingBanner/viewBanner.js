import React, { useState, useEffect } from 'react'
import {
  Grid,
  Container,
  Box,
  Typography,
  makeStyles,
  TextField,
  Button,
} from '@material-ui/core'
import { useHistory, useParams } from 'react-router-dom'
import Apiconfigs from 'src/Apiconfig/Apiconfig'
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
  bannerSectionBody: {
    padding: '80px 0px',
    minHeight: '770px',
    '& h3': {
      colors: '#000',
    },
  },
  dailogTitle: {
    align: 'Center',
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
  input_fild3: {
    width: '100%',
    '& input': {
      height: '30px',
      paddingTop: '10px',
    },
  },
  UploadBox: {
    border: 'solid 0.5px #707070',
    display: 'flex',
    flexDirection: 'column',
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
}))

export default function AddBackground() {
  const classes = useStyles()
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(false)

  const [bannerTitle, setbannerTitle] = useState('')
  const [bannerDescription, setBannerDescription] = useState('')
  const [url, setUrl] = useState('')

  const [bannerMediaType, setbannerMediaType] = useState('')
  const [bannerMediaPreview, setbannerMediaPreview] = useState('')
  
  const [bannerBackgroundType, setbannerBackgroundType] = useState('')
  const [bannerBackgroundPreview, setbannerBackgroundPreview] = useState('')

  const { id } = useParams();

  const getBannerDetailsHandler = async (id) => {
    setIsLoading(true)
    try {
      const res = await axios({
        method: 'GET',
        url: Apiconfigs.banner,
        params: {
          _id: id,
        },
      })
      if (res.data.statusCode === 200) {
        setbannerTitle(res.data.result?.title ? res.data.result?.title : '')
        setUrl(res.data.result?.url ? res.data.result?.url : '')
        setbannerMediaPreview(res.data.result?.media ? res.data.result?.media : '')
        setbannerMediaType(res.data.result?.mediaType ? res.data.result?.mediaType : '')
        setbannerBackgroundPreview(res.data.result?.background ? res.data.result?.background : '')
        setbannerBackgroundType(res.data.result?.backgroundType ? res.data.result?.backgroundType : '')
        setBannerDescription( res.data.result?.description ? res.data.result?.description : '',)
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    getBannerDetailsHandler(id);
  },[id]);


  return (
    <Box className={classes.bannerSectionBody} mt={1}>
      <Container maxWidth="xl">
        <Box>
          <Typography variant="h3">Banner Details</Typography>

          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <label> Banner Title :</label>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  id="standard-basic"
                  placeholder="Banner title here"
                  className={classes.input_fild2}
                  value={bannerTitle}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <label> Banner Description :</label>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  id="standard-basic"
                  placeholder="Description"
                  className={classes.input_fild2}
                  value={bannerDescription}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <label>URL :</label>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  fullWidth
                  type="text"
                  placeholder="Enter url"
                  className={classes.input_fild3}
                  value={url}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box mb={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <label>Banner media and background (Upload photo/video):</label>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className={classes.UploadBox}>
                  
                  {bannerMediaPreview ? (
                    <>
                      {bannerMediaType === 'video' ? (
                        <video
                          controls="false"
                          autoPlay="true"
                          loop
                          muted
                          playsinline="true"
                          width="400px"
                        >
                          <source src={bannerMediaPreview} type="video/mp4" />
                        </video>
                      ) : (
                        <img src={bannerMediaPreview} alt="" width="400px" />
                      )}
                      
                    </>
                  ) : null
                  }
              </Box>
              
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className={classes.UploadBox}>
                  
                  {bannerBackgroundPreview ? (
                    <>
                      {bannerBackgroundType === 'video' ? (
                        <video
                          controls="false"
                          autoPlay="true"
                          loop
                          muted
                          playsinline="true"
                          width="100%"
                        >
                          <source src={bannerBackgroundPreview} type="video/mp4" />
                        </video>
                      ) : (
                        <img src={bannerBackgroundPreview} alt="" width="100%" />
                      )}
                      
                    </>
                  ) : null}
              </Box>
              
            </Grid>
          </Grid>
        </Box>

        <Box className={classes.newbox}>
          <Box>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              className="ml-10"
              onClick={() => history.push('/banners')}
            >
              Back
            </Button>
          </Box>
          
        </Box>
      </Container>
    </Box>
  )
}
