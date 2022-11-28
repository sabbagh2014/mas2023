import React, { useState, useRef, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import {
  Container,
  Divider,
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  FormControl,
  FormHelperText,
} from '@material-ui/core'
import Page from 'src/component/Page'
import axios from 'axios'
import { useLocation, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import JoditEditor from 'jodit-react'
import ButtonCircularProgress from 'src/component/ButtonCircularProgress'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import Apiconfigs from 'src/Apiconfig/Apiconfig'
import Loader from 'src/component/Loader'
const useStyles = makeStyles({
  texbox: {
    rows: '5',
    overflow: 'hidden',
    height: 'auto',
    resize: 'none',
  },
  UploadBox: {
    border: 'solid 0.5px #bdbdbd',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '110px',
    borderRadius: '6px',
  },
  input_fild22: {
    width: '100%',
    padding: '17px',
    '& input': {
      height: '45px',
      border: 0,
    },
    '& .MuiInput-underline:before': {
      border: 0,
    },
  },
})

const OurSolutions = () => {
  const { id } = useParams();
  const location = useLocation()
  const classes = useStyles()
  const history = useHistory()
  const [bannerDescription, setbannerDescription] = useState('')
  const [title, setTitle] = useState('')
  const [imageurl, setimageurl] = useState('')
  const [image64, setbannerImage] = useState('')
  const editor = useRef(null)
  const [componentCheck, setComponenetCheck] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const config = {
    readonly: false,
  }
  const [media, setMedia] = useState('')
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [tooLongText, setTooLongText] = useState(false)
  const getPreDetailsDataHandler = async () => {
    try {
      setIsFetchingData(true)
      const res = await axios({
        method: 'GET',
        url: Apiconfigs.content,
        params: {
          _id:  id,
          type: 'solution'
        },
      })
      if (res.data.statusCode === 200) {
        setIsFetchingData(false)
        if (res.data.result) {
          setTitle(res.data.result?.title ? res.data.result?.title : '')
          setbannerDescription(
            res.data.result?.description ? res.data.result?.description : '',
          )
          setimageurl(res.data.result?.contentFile ? res.data.result?.contentFile : '')
          setbannerImage(res.data.result?.contentFile ? res.data.result?.contentFile : '')
          setMedia(res.data.result?.contentFile ? res.data.result?.contentFile : '')
        }
      }
    } catch (error) {
      console.log(error)
      setIsFetchingData(false)
    }
  }
  const uploadFileHandler = async (file) => {
    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      const res = await axios({
        method: 'POST',
        url: Apiconfigs.uploadFile,
        data: formData,
      })
      if (res.data.statusCode === 200) {
        setIsUploading(false)
        setMedia(res.data.result)
        toast.success(
          'Image has been uploaded successfully. Continue to submit',
        )
      }
    } catch (error) {
      console.log(error)
      setIsUploading(false)
    }
  }
  const updateContentHandler = async () => {
    setIsSubmit(true)
    if (bannerDescription !== '' && title !== '' && media !== '') {
      if (bannerDescription.length <= 450) {
        setTooLongText(false)
        try {
          setIsSubmit(false)
          setIsUpdating(true)

          const payload = {
            _id: id,
            title: title,
            description: bannerDescription,
            contentFile: media,
          }
          const response = await axios({
            method: 'PUT',
            url: Apiconfigs.content,
            headers: {
              token: window.sessionStorage.getItem('AccessToken'),
            },
            data: payload,
          })
          if (response.data.statusCode === 200) {
            history.push('/landing-sections')
            toast.success('Banner content has been updated sucessfully.')
            setIsUpdating(false)
          }
        } catch (error) {
          console.log(error)
          setIsUpdating(false)
        }
      } else {
        setTooLongText(true)
      }
    }
  }
  useEffect(() => {
    const locationStateKey = location.state.componentCall
    if (id) {
      getPreDetailsDataHandler(id)
    }
    setComponenetCheck(locationStateKey)
  }, [location])


  return (
    <Container maxWidth="xl" style={{ marginTop: '88px', minHeight: '88vh' }}>
      <Page title="Edit Our Solutions Section">
        <Box mb={1}>
          <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h3" style={{ marginBottom: '8px' }}>
              <strong> Our Solutions</strong>
            </Typography>
          </Box>
          <Divider />
        </Box>

        <Box mt={2}>
          {isFetchingData ? (
            <Loader />
          ) : (
            <FormControl style={{ width: '100%' }}>
              <Grid container spacing={3}>
                <Grid item md={12} sm={12} xs={12}>
                  <Typography variant="body2" style={{ marginBottom: '10px' }}>
                    <strong> Enter Title :</strong>
                  </Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    type="text"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <Grid container spacing={0}>
                    <Grid item xs={12} md={12}>
                      <label>Upload an image :</label>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Box className={classes.UploadBox}>
                        <label htmlFor="raised-button-file">
                          <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            className={classes.input}
                            id="contained-button-file-add-bun"
                            multiple
                            onChange={(e) => {
                              setbannerImage(e.target.files[0])
                              uploadFileHandler(e.target.files[0])
                              setimageurl(
                                URL.createObjectURL(e.target.files[0]),
                              )
                            }}
                            type="file"
                          />
                          {imageurl ? (
                            <Box textAlign="center">
                              <img src={imageurl} alt="" width="150px" />
                              {componentCheck !== 'View' && (
                                <label htmlFor="contained-button-file-add-bun">
                                  {isUploading ? (
                                    <Button
                                      variant="outined"
                                      color="primary"
                                      component="span"
                                      disabled
                                    >
                                      Uploading...
                                      <ButtonCircularProgress />
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="outined"
                                      color="primary"
                                      component="span"
                                      onClick={() => {
                                        setimageurl('')
                                        setbannerImage('')
                                        setMedia('')
                                      }}
                                    >
                                      Remove
                                    </Button>
                                  )}
                                </label>
                              )}
                            </Box>
                          ) : (
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
                          )}
                        </label>
                      </Box>
                      {isSubmit && imageurl === '' && (
                        <FormHelperText error>
                          *Please select video
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <Box mb={2}>
                    <Grid container spacing={0}>
                      <Grid item xs={12} md={12}>
                        <label>Description:</label>
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
                            onChange={() => {}}
                          />
                        </Box>
                        {tooLongText && (
                          <FormHelperText error>
                            *To respect the landing page layout, enter a small paragraph (less than 100 word)
                          </FormHelperText>
                        )}
                        {isSubmit && bannerDescription === '' && (
                          <FormHelperText error>
                            *Please enter description
                          </FormHelperText>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                <Grid item md={12} xs={12}>
                  {componentCheck !== 'View' && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="medium"
                      style={{ marginRight: '10px' }}
                      onClick={updateContentHandler}
                      disabled={isUpdating}
                    >
                      Submit{isUpdating && <ButtonCircularProgress />}
                    </Button>
                  )}

                  <Button
                    component={Link}
                    to="/landing-sections"
                    variant="contained"
                    color="secondary"
                    size="medium"
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </FormControl>
          )}

          <ToastContainer />
        </Box>
      </Page>
    </Container>
  )
}

export default OurSolutions
