import React, { useState, useContext } from 'react'
import {
  Grid,
  Container,
  Box,
  Typography,
  makeStyles,
  TextField,
  Button,
  FormHelperText,
} from '@material-ui/core'
import { useHistory, useLocation } from 'react-router-dom'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import Apiconfigs from 'src/Apiconfig/Apiconfig'
import axios from 'axios'
import { toast } from 'react-toastify'
import ButtonCircularProgress from 'src/component/ButtonCircularProgress'
const useStyles = makeStyles((theme) => ({
  bannerSectionBody: {
    padding: '80px 0px',
    minHeight: '770px',
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

export default function BannerSection() {
  const history = useHistory()
  const [isSubmit, setIsSubmit] = useState(false)
  const classes = useStyles()
  const [bannerImage, setbannerImage] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [url, setUrl] = useState('')
  const [imageurl, setimageurl] = useState('')
  const [process, setprocess] = useState(false)
  const [bannerTitle, setbannerTitle] = useState('')
  const [message, setmessage] = useState('')
  const [fileTypeCheck, setFileTypeCheck] = useState('')
  const accessToken = sessionStorage.getItem('AccessToken')
  const post = async () => {
    setIsSubmit(true)
    if (
      bannerTitle !== '' &&
      bannerImage !== '' &&
      startDate !== '' &&
      endDate !== ''
      // url !== ''
    ) {
      const formData = new FormData()
      formData.append('bannerImage', bannerImage)
      formData.append('title', bannerTitle)
      formData.append('startDate', startDate)
      formData.append('endDate', endDate)
      formData.append('url', url)
      formData.append('mediaType', fileTypeCheck)
      try {
        setmessage('Creating Banner...')
        setprocess(true)

        axios
          .request({
            method: 'POST',
            url: Apiconfigs.addBanner,
            headers: {
              token: accessToken,
            },
            data: formData,
            // formData,
          })
          .then((res) => {
            if (res.data.statusCode === 200) {
              console.log(res)

              setprocess(false)
              history.push('/banner-managment')
              toast.success('Advertisment has been added successfully. ')
            }
          })

          .catch((err) => {
            setprocess(false)
            console.log(err.message)
            toast.error('error')
          })
      } catch {
        setprocess(false)

        console.log('hjds')
      }
    }
  }

  return (
    <Box className={classes.bannerSectionBody} mt={1}>
      <Container maxWidth="xl">
        <Box>
          <Typography variant="h3">Add Advertisment</Typography>

          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <label> Banner Title :</label>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  id="standard-basic"
                  placeholder="Banner"
                  className={classes.input_fild2}
                  onChange={(e) => setbannerTitle(e.target.value)}
                  error={isSubmit && bannerTitle === ''}
                  helperText={
                    isSubmit &&
                    bannerTitle === '' &&
                    '*Please enter valid title'
                  }
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Grid container spacing={3}>
          <Grid item lg={4} md={4} sm={4} xs={12}>
            <Box>
              <Typography>Start Date:</Typography>
              <TextField
                fullWidth
                type="date"
                className={classes.input_fild3}
                onChange={(e) => setStartDate(e.target.value)}
                error={isSubmit && startDate === ''}
                helperText={
                  isSubmit && startDate === '' && '*Please enter start date'
                }
              />
            </Box>
          </Grid>
          <Grid item lg={4} md={4} sm={4} xs={12}>
            <Box>
              <Typography>End Date:</Typography>
              <TextField
                fullWidth
                type="date"
                className={classes.input_fild3}
                onChange={(e) => setEndDate(e.target.value)}
                error={isSubmit && endDate === ''}
                helperText={
                  isSubmit && endDate === '' && '*Please enter end date'
                }
              />
            </Box>
          </Grid>
          <Grid item lg={4} md={4} sm={4} xs={12}>
            <Box>
              <Typography>Url</Typography>
              <TextField
                fullWidth
                type="text"
                placeholder="Enter url"
                className={classes.input_fild3}
                onChange={(e) => setUrl(e.target.value)}
                // error={isSubmit && url === ''}
                // helperText={isSubmit && url === '' && '*Please enter url'}
              />
            </Box>
          </Grid>
        </Grid>

        <Box mb={2}>
          <Grid container spacing={0}>
            <Grid item xs={12} md={12}>
              <label>Upload a photo/video:</label>
            </Grid>
            <Grid item xs={12} md={12}>
              <Box className={classes.UploadBox}>
                <label htmlFor="raised-button-file">
                  <input
                    accept=".png, .jpg, .jpeg,.mp3,.mp4,.gif,.webp"
                    style={{ display: 'none' }}
                    className={classes.input}
                    id="contained-button-file-add-bun"
                    multiple
                    onChange={(e) => {
                      setbannerImage(e.target.files[0])
                      setimageurl(URL.createObjectURL(e.target.files[0]))
                      var fileExtention = e.target.files[0].name
                        .split('.')
                        .pop()
                      console.log('fileExtention----', fileExtention)
                      var fileType =
                        fileExtention == 'mp4' || fileExtention == 'webp'
                          ? 'video'
                          : fileExtention == 'mp3'
                          ? 'audio'
                          : 'image'

                      setFileTypeCheck(fileType)
                    }}
                    type="file"
                  />
                  {imageurl ? (
                    <>
                      {fileTypeCheck === 'video' ? (
                        <video
                          controls="false"
                          autoPlay="true"
                          loop
                          muted
                          playsinline="true"
                          width="200px"
                        >
                          <source src={imageurl} type="video/mp4" />
                        </video>
                      ) : (
                        <img src={imageurl} alt="" width="200px" />
                      )}
                      <Box textAlign="center" width="100%">
                        <Button
                          variant="outined"
                          color="primary"
                          component="span"
                          onClick={() => {
                            setbannerImage('')
                            setimageurl('')
                          }}
                        >
                          Remove
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <label htmlFor="contained-button-file-add-bun">
                      <Button
                        variant="outined"
                        color="primary"
                        component="span"
                      >
                        Upload &nbsp;
                        <CloudUploadIcon />
                      </Button>
                    </label>
                  )}
                </label>
              </Box>
              {isSubmit && imageurl === '' && (
                <FormHelperText error>*Please select image</FormHelperText>
              )}
            </Grid>
          </Grid>
        </Box>
        {/* <Box mb={2}>
          <Grid container spacing={0}>
            <Grid item xs={12} md={12}>
              <label>Banner Description :</label>
            </Grid>
            <Grid item xs={12} md={12}>
              <Box className={classes.UploadBox}>
                <TextField
                  id="standard-basic"
                  placeholder=""
                  className={classes.input_fild22}
                  multiline
                  maxRows={6}
                  rows={6}
                  onChange={(e) => setbannerDescription(e.target.value)}
                />
              </Box>
              {isSubmit && bannerDescription === '' && (
                <FormHelperText error>
                  {' '}
                  *Please enter valid description
                </FormHelperText>
              )}
            </Grid>
          </Grid>
        </Box> */}

        <Box className={classes.newbox}>
          <Box>
            {' '}
            <Button
              variant="contained"
              size="large"
              color="secondary"
              className="ml-10"
              onClick={() => history.push('/banner-managment')}
              disabled={process}
            >
              Cancel
            </Button>
          </Box>
          <Box>
            {' '}
            <Button
              variant="contained"
              size="large"
              color="secondary"
              className="ml-10"
              onClick={post}
              disabled={process}
            >
              {!process ? 'Post' : message}{' '}
              {process && <ButtonCircularProgress />}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
