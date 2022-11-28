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

const HowItWorks = () => {
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
  const [secondryContentHead, setSecondaryContentHead] = useState('')
  const [secondryContentDesc, setSecondaryContentDesc] = useState('')
  const [secondryContentHead1, setSecondaryContentHead1] = useState('')
  const [secondryContentDesc1, setSecondaryContentDesc1] = useState('')
  const [secondryContentHead2, setSecondaryContentHead2] = useState('')
  const [secondryContentDesc2, setSecondaryContentDesc2] = useState('')
  const [media, setMedia] = useState('')
  const [tooLongText, setTooLongText] = useState(false)
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [contentText, setContentText] = useState({
    text1: false,
    text2: false,
    text3: false,
  })
  const config = {
    readonly: false,
  }
  const [isUploading, setIsUploading] = useState(false)
  const getPreDetailsDataHandler = async () => {
    try {
      setIsFetchingData(true)
      const res = await axios({
        method: 'GET',
        url: Apiconfigs.content,
        params: {
          _id: id,
          type: 'howItWorks'
        },
      })
      if (res.data.statusCode === 200) {
        if (res.data.result) {
          setTitle(res.data.result?.title ? res.data.result?.title : '')
          setbannerDescription(
            res.data.result?.description ? res.data.result?.description : '',
          )
          setimageurl(res.data.result?.contentFile ? res.data.result?.contentFile : '')
          setbannerImage(res.data.result?.contentFile ? res.data.result?.contentFile : '')
          setMedia(res.data.result?.contentFile ? res.data.result?.contentFile : '')
          setSecondaryContentHead(
            res.data.result?.contents &&
              res.data.result?.contents[0] &&
              res.data.result?.contents[0]?.heading
              ? res.data.result?.contents[0]?.heading
              : '',
          )
          setSecondaryContentDesc(
            res.data.result?.contents &&
              res.data.result?.contents[0] &&
              res.data.result?.contents[0]?.contentDescription
              ? res.data.result?.contents[0]?.contentDescription
              : '',
          )
          setSecondaryContentHead1(
            res.data.result?.contents &&
              res.data.result?.contents[1] &&
              res.data.result?.contents[1]?.heading
              ? res.data.result?.contents[1]?.heading
              : '',
          )
          setSecondaryContentDesc1(
            res.data.result?.contents &&
              res.data.result?.contents[1] &&
              res.data.result?.contents[1]?.contentDescription
              ? res.data.result?.contents[1]?.contentDescription
              : '',
          )
          setSecondaryContentHead2(
            res.data.result?.contents &&
              res.data.result?.contents[2] &&
              res.data.result?.contents[2]?.heading
              ? res.data.result?.contents[2]?.heading
              : '',
          )
          setSecondaryContentDesc2(
            res.data.result?.contents &&
              res.data.result?.contents[2] &&
              res.data.result?.contents[2]?.contentDescription
              ? res.data.result?.contents[2]?.contentDescription
              : '',
          )
        }
        setIsFetchingData(false)
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
          'Media has been uploaded successfully. Continue to submit',
        )
      }
    } catch (error) {
      console.log(error)
      setIsUploading(false)
    }
  }
  const updateContentHandler = async () => {
    setIsSubmit(true)
    if (
      bannerDescription !== '' &&
      title !== '' &&
      media !== '' &&
      secondryContentHead !== '' &&
      secondryContentDesc !== '' &&
      secondryContentHead1 !== '' &&
      secondryContentDesc1 !== '' &&
      secondryContentHead2 !== '' &&
      secondryContentDesc2 !== ''
    ) {
      if (bannerDescription.length <= 200) {
        try {
          setIsSubmit(false)
          setIsUpdating(true)
          setTooLongText(false)
          const payload = {
            _id: id,
            title: title,
            description: bannerDescription,
            contentFile: media,
            contents: [
              {
                heading: secondryContentHead,
                contentDescription: secondryContentDesc,
              },
              {
                heading: secondryContentHead1,
                contentDescription: secondryContentDesc1,
              },
              {
                heading: secondryContentHead2,
                contentDescription: secondryContentDesc2,
              },
            ],
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
            toast.success('Section content has been updated sucessfully.')
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
  }, [id])


  return (
    <Container maxWidth="xl" style={{ marginTop: '88px', minHeight: '88vh' }}>
      <Page title="Update How it works Section">
        <Box mb={1}>
          <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h3" style={{ marginBottom: '8px' }}>
              <strong> How it works</strong>
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
                        <label>Content 1:</label>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <TextField
                          variant="outlined"
                          fullWidth
                          type="text"
                          placeholder="Heading"
                          style={{ marginBottom: '10px' }}
                          value={secondryContentHead}
                          onChange={(e) =>
                            setSecondaryContentHead(e.target.value)
                          }
                          error={isSubmit && secondryContentHead === ''}
                          helperText={
                            isSubmit &&
                            secondryContentHead === '' &&
                            'Please enter heading.'
                          }
                        />

                        <TextField
                          variant="outlined"
                          fullWidth
                          type="text"
                          placeholder="Description"
                          value={secondryContentDesc}
                          onChange={(e) =>
                            setSecondaryContentDesc(e.target.value)
                          }
                          error={isSubmit && secondryContentDesc === ''}
                          helperText={
                            isSubmit &&
                            secondryContentDesc === '' &&
                            'Please enter description.'
                          }
                          onBlur={() => {
                            if (secondryContentDesc.length > 100) {
                              setContentText({
                                text1: true,
                                text2: contentText.text2,
                                text3: contentText.text3,
                              })
                            }
                          }}
                        />
                        {contentText.text1 &&
                          secondryContentDesc.length > 100 && (
                            <FormHelperText error>
                              You can not enter more than 100 charachters.
                            </FormHelperText>
                          )}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <Box mb={2}>
                    <Grid container spacing={0}>
                      <Grid item xs={12} md={12}>
                        <label>Content 2:</label>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <TextField
                          variant="outlined"
                          fullWidth
                          type="text"
                          placeholder="Heading"
                          style={{ marginBottom: '10px' }}
                          value={secondryContentHead1}
                          onChange={(e) =>
                            setSecondaryContentHead1(e.target.value)
                          }
                          error={isSubmit && secondryContentHead1 === ''}
                          helperText={
                            isSubmit &&
                            secondryContentHead1 === '' &&
                            'Please enter heading.'
                          }
                        />

                        <TextField
                          variant="outlined"
                          fullWidth
                          type="text"
                          placeholder="Description"
                          value={secondryContentDesc1}
                          onChange={(e) =>
                            setSecondaryContentDesc1(e.target.value)
                          }
                          error={isSubmit && secondryContentDesc1 === ''}
                          helperText={
                            isSubmit &&
                            secondryContentDesc1 === '' &&
                            'Please enter description.'
                          }
                          onBlur={() => {
                            if (secondryContentDesc1.length > 100) {
                              setContentText({
                                text1: contentText.text1,
                                text2: true,
                                text3: contentText.text3,
                              })
                            }
                          }}
                        />
                        {contentText.text2 &&
                          secondryContentDesc1.length > 100 && (
                            <FormHelperText error>
                              You can not enter more than 100 charachters.
                            </FormHelperText>
                          )}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <Box mb={2}>
                    <Grid container spacing={0}>
                      <Grid item xs={12} md={12}>
                        <label>Content 3:</label>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <TextField
                          variant="outlined"
                          fullWidth
                          type="text"
                          placeholder="Heading"
                          style={{ marginBottom: '10px' }}
                          value={secondryContentHead2}
                          onChange={(e) =>
                            setSecondaryContentHead2(e.target.value)
                          }
                          error={isSubmit && secondryContentHead2 === ''}
                          helperText={
                            isSubmit &&
                            secondryContentHead2 === '' &&
                            'Please enter heading.'
                          }
                        />

                        <TextField
                          variant="outlined"
                          fullWidth
                          type="text"
                          placeholder="Description"
                          value={secondryContentDesc2}
                          onChange={(e) =>
                            setSecondaryContentDesc2(e.target.value)
                          }
                          error={isSubmit && secondryContentDesc2 === ''}
                          helperText={
                            isSubmit &&
                            secondryContentDesc2 === '' &&
                            'Please enter description.'
                          }
                          onBlur={() => {
                            if (secondryContentDesc2.length > 100) {
                              setContentText({
                                text1: contentText.text1,
                                text2: contentText.text2,
                                text3: true,
                              })
                            }
                          }}
                        />
                        {contentText.text3 &&
                          secondryContentDesc2.length > 100 && (
                            <FormHelperText error>
                              You can not enter more than 100 charachters.
                            </FormHelperText>
                          )}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <Box mb={2}>
                    <Grid container spacing={0}>
                      <Grid item xs={12} md={12}>
                        <label>Details:</label>
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
                        {tooLongText && (
                          <FormHelperText error>
                            You cannot enter ore than 90 charachters.
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
                  <Box pb={4}>
                    {componentCheck !== 'View' && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        style={{ marginRight: '10px' }}
                        onClick={() => {
                          updateContentHandler()
                          setContentText(false)
                        }}
                        disabled={
                          isUpdating ||
                          contentText.text1 ||
                          contentText.text2 ||
                          contentText.text3
                        }
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
                  </Box>
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

export default HowItWorks
