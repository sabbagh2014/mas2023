import React, { useState, useEffect, useRef } from 'react'
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

import moment from 'moment'
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
  const location = useLocation()
  const banneDetails = location.state.id
  const [selectedADId, setSelectedADId] = useState('')
  const [isSubmit, setIsSubmit] = useState(false)
  const classes = useStyles()
  const [bannerImage, setbannerImage] = useState('')
  const [imageurl, setimageurl] = useState(banneDetails?.image)
  const [process, setprocess] = useState(false)
  const [bannerTitle, setbannerTitle] = useState(banneDetails?.title)
  const [startDate, setStartDate] = useState(
    moment(banneDetails?.startDate).format('YYYY-MM-DD'),
  )
  const [endDate, setEndDate] = useState(
    moment(banneDetails?.endDate).format('YYYY-MM-DD'),
  )
  const [url, setUrl] = useState(banneDetails?.url)
  const accessToken = sessionStorage.getItem('AccessToken')
  const [fileTypeCheck, setFileTypeCheck] = useState(banneDetails?.mediaType)
  const getBannerDetails = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: Apiconfigs.viewBanner,
        params: {
          _id: banneDetails?._id,
        },
      })
      if (res.data.statusCode === 200) {
        console.log('response----', res.data.result)
        setSelectedADId(res.data.result)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (banneDetails) {
      getBannerDetails()
    }
  }, [banneDetails])

  const handlePost = async () => {
    setIsSubmit(true)
    if (bannerTitle !== '') {
      const formData = new FormData()
      if (bannerImage) {
        formData.append('image', bannerImage)
      }
      formData.append('title', bannerTitle)
      formData.append('startDate', startDate)
      formData.append('endDate', endDate)
      formData.append('url', url)
      formData.append('mediaType', fileTypeCheck)
      try {
        setprocess(true)
        axios
          .request({
            method: 'PUT',
            url: Apiconfigs.editBanner,
            headers: {
              token: accessToken,
            },
            data: formData,
            params: {
              _id: selectedADId?._id,
            },
            // formData,
          })
          .then((res) => {
            if (res.data.statusCode === 200) {
              console.log(res)

              setprocess(false)
              history.push('/banner-managment')
              toast.success('Advertisement has been updated successfully.')
            } else {
              setprocess(false)
              toast.error(res.data.responseMessage)
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
          <Typography variant="h3">Edit Banner</Typography>

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
                  value={bannerTitle}
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
                value={startDate}
                className={classes.input_fild3}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Box>
          </Grid>
          <Grid item lg={4} md={4} sm={4} xs={12}>
            <Box>
              <Typography>End Date:</Typography>
              <TextField
                fullWidth
                type="date"
                value={endDate}
                className={classes.input_fild3}
                onChange={(e) => setEndDate(e.target.value)}
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
                value={url}
                className={classes.input_fild3}
                onChange={(e) => setUrl(e.target.value)}
              />
            </Box>
          </Grid>
        </Grid>

        <Box mb={2}>
          <Grid container spacing={0}>
            <Grid item xs={12} md={12}>
              <label>Upload a photo/video :</label>
            </Grid>
            <Grid item xs={12} md={12}>
              <Box className={classes.UploadBox}>
                <label htmlFor="raised-button-file">
                  <input
                    accept="image/video/*"
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
                      <label htmlFor="contained-button-file-add-bun">
                        <Button
                          variant="outined"
                          color="primary"
                          component="span"
                        >
                          Upload image &nbsp;
                          <CloudUploadIcon />
                        </Button>
                      </label>
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
                <FormHelperText error>
                  *Please select image/video
                </FormHelperText>
              )}
            </Grid>
          </Grid>
        </Box>
        <Box mb={2}>
          <Grid container spacing={0}>
            {/* <Grid item xs={12} md={12}>
              <Box
                style={{ border: "solid 0.5px #707070" }}
                // className={classes.UploadBox}
              >
                <JoditEditor
                  ref={editor}
                  // disabled={isEdit}
                  value={bannerDescription}
                  config={config}
                  name="descritionValue"
                  variant="outlined"
                  fullWidth
                  size="small"
                  tabIndex={1}
                  onBlur={(e) => setbannerDescription(e)} // preferred to use only this option to update the content for performance reasons
                  onChange={(newContent) => {}}
                />
              </Box>
            </Grid> */}
          </Grid>
        </Box>
        {/* <Box mb={2}>
          <Grid container spacing={0}>
            <Grid item xs={12} md={12}>
              <label>Banner Description :</label>
            </Grid>
            <Grid item xs={12} md={12}>
              <Box className={classes.UploadBox}>
                <JoditEditor
                  ref={editor}
                  value={bannerDescription}
                  config={config}
                  name="descritionValue"
                  variant="outlined"
                  fullWidth
                  size="small"
                  tabIndex={1}
                  onBlur={(e) => setbannerDescription(e)} // preferred to use only this option to update the content for performance reasons
                  onChange={(newContent) => {}}
                />
              </Box>
              {isSubmit && bannerDescription === "" && (
                <FormHelperText error>
                  {" "}
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
            >
              Cancel
            </Button>
          </Box>
          <Box>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              onClick={handlePost}
              className="ml-10"
            >
              Submit {process && <ButtonCircularProgress />}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
