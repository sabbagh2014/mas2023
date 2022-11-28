import React, { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Button,
  TextField,
  Typography,
  Grid,
  makeStyles,
  Link,
} from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import Slide from '@material-ui/core/Slide'
import axios from 'axios'
import Apiconfigs from 'src/Apiconfig/Apiconfig'
import ButtonCircularProgress from 'src/component/ButtonCircularProgress'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
const useStyles = makeStyles((theme) => ({
  LoginBox: {
    '& h6': {
      fontWeight: 'bold',
      marginBottom: '10px',
      '& span': {
        fontWeight: '200',
      },
    },
  },
  // TokenBox: {
  //   border: "solid 0.5px #e5e3dd",
  //   padding: "5px",
  // },
  priceBox: {
    border: 'solid 0.5px #e5e3dd',
    justifyContent: 'center',
    '& h5': {
      fontSize: '14px',
      fontWeight: '500',
      color: '#707070',
      textAlign: 'center',
      padding: '5px',
      borderBottom: 'solid 0.5px #e5e3dd',
    },
    '& p': {
      color: '#141518',
    },
  },
  Silver: {
    backgroundColor: '#e5e3dd',
  },
  Gold: {
    backgroundColor: '#f3ba2f',
    color: '#fff !important',
  },
  Diamond: {
    backgroundColor: '#60beff',
    color: '#fff !important',
  },
  MAS: {
    backgroundColor: '#f26a6a',
    color: '#fff !important',
  },
  input_fild2: {
    width: '100%',
    '& input': {
      height: '19px',
      paddingTop: '27px',
    },
  },
  modaltitel: {
    fontSize: '30px',
    fontWeight: '600',
    marginBottom: '10px',
    textAlign: 'center',
    color: '#141518',
    [theme.breakpoints.down('sm')]: {
      fontSize: '20px',
    },
  },
  btnBox: {
    display: 'flex',
    alignItems: 'center',
  },
  paper: {
    maxWidth: '750px',
  },
  basic: {
    backgroundColor: '#9999FF',
    color: '#fff !important',
  },
}))
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}
export default function Login() {
  const classes = useStyles()
  const [openBlock, setOpen1] = React.useState(false)
  const [feesList, setFeesList] = useState([])
  const [selectedFees, setSelectedFees] = useState()

  const [masHeld, setMasHeld] = useState(0)
  const [fees, setFees] = useState(0)
  const [isUpdating, setIsUpdating] = useState(false)
  const [errpopup, seterrpopup] = React.useState(false)
  const [severity, setSeverity] = useState('info')
  const [errmsg, seterrmsg] = React.useState('')
  const [clientFee, setClientFee] = useState(0)
  const getFeesListHandler = async () => {
    try {
      const res = await axios.get(Apiconfigs.listFee, {
        headers: {
          token: window.sessionStorage.getItem('AccessToken'),
        },
      })
      if (res.data.statusCode) {
        setFeesList(res.data.result)
      }
    } catch (error) {
      console.log('ERRRO', error)
    }
  }

  useEffect(() => {
    getFeesListHandler()
  }, [])

  useEffect(() => {
    if (selectedFees) {
      setMasHeld(selectedFees.masHeld)
      setFees(selectedFees.contentCreatorFee)
      setClientFee(selectedFees.clientFee)
    }
  }, [selectedFees])

  const updateFeeshandler = async () => {
    if (masHeld !== '' && fees !== '') {
      try {
        setIsUpdating(true)
        const res = await axios.put(
          Apiconfigs.editFee,
          {
            _id: selectedFees._id,
            masHeld: masHeld.toString(),
            contentCreatorFee: fees.toString(),
          },
          {
            headers: {
              token: window.sessionStorage.getItem('AccessToken'),
            },
          },
        )
        getFeesListHandler()
        if (res.data.statusCode === 200) {
          setOpen1(false)
          seterrpopup(true)
          setSeverity('success')
          seterrmsg(res.data.responseMessage)
          setSelectedFees()
        } else {
          seterrpopup(true)
          setSeverity('error')
          seterrmsg(res.data.responseMessage)
        }
        setIsUpdating(false)
      } catch (error) {
        seterrpopup(true)
        setSeverity('error')
        if (error.response) {
          seterrmsg(error.response.data.responseMessage)
        } else {
          seterrmsg(error.message)
        }

        setIsUpdating(false)
        console.log('ERROR', error)
      }
    } else {
      seterrpopup(true)
      setSeverity('error')
      seterrmsg('Please enter valid details')
    }
  }
  return (
    <Box className={classes.LoginBox}>
      <Snackbar
        open={errpopup}
        autoHideDuration={6000}
        onClose={() => seterrpopup(false)}
      >
        <Alert onClose={() => seterrpopup(false)} severity={severity}>
          {errmsg}
        </Alert>
      </Snackbar>
      <Container maxWidth="xl">
        <Box>
          <Typography variant="h5" style={{ color: 'black' }}>
            Fees applied :{' '}
            <span style={{ color: '#81807F' }}>
              Number of $MAS held and fees on each bundle can be changed here
            </span>
            <br />
            <br />
          </Typography>
          {/* <Box className={classes.TokenBox} mb={4}> */}
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={12} lg={1}></Grid>
            {feesList &&
              feesList.map((data, i) => {
                return (
                  <Grid item xs={12} sm={6} md={4} lg={2} key={i}>
                    <Box className={classes.priceBox}>
                      <Typography
                        variant="h5"
                        className={
                          data.planType === 'Basic'
                            ? classes.basic
                            : data.planType === 'Mas Plus'
                            ? classes.MAS
                            : classes[data.planType]
                        }
                      >
                        {data.planType}
                      </Typography>
                      <Box p={4}>
                        <Typography variant="body2" component="p">
                          <Box style={{ display: 'flex', width: '120px' }}>
                            $MAS held: {data.masHeld}
                          </Box>
                        </Typography>
                        <Typography variant="body2" component="p">
                          Fees: {data.contentCreatorFee}%
                        </Typography>
                        {/* <Typography variant='body2' component='p'>
                            Client Fee: {data.clientFee}%
                          </Typography> */}
                        <Button
                          variant="contained"
                          size="large"
                          color="secondary"
                          className="btnWidth btn-block btnHight"
                          onClick={() => {
                            setSelectedFees(data)
                            setOpen1(true)
                          }}
                        >
                          change
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                )
              })}
            <Grid item xs={12} sm={12} md={12} lg={1}></Grid>
          </Grid>
          {/* </Box> */}
        </Box>
      </Container>
      {openBlock && selectedFees && (
        <Dialog
          open={openBlock}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setOpen1(false)}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent className={classes.paper}>
            <DialogContentText id="alert-dialog-slide-description">
              <Typography variant="h3" className={classes.modaltitel}>
                {selectedFees?.planType}
              </Typography>
              <Box>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={4}>
                    <label> $MAS held:</label>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                      onChange={(e) => setMasHeld(e.target.value)}
                      id="standard-basic"
                      placeholder=""
                      className={classes.input_fild2}
                      value={masHeld}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box mb={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <label>Fees:</label>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                      onChange={(e) => setFees(e.target.value)}
                      id="standard-basic"
                      placeholder=""
                      className={classes.input_fild2}
                      value={fees}
                    />
                  </Grid>
                </Grid>
              </Box>
              {/* <Box mb={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <label>Client Fee:</label>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                      id='standard-basic'
                      placeholder=''
                      className={classes.input_fild2}
                      value={clientFee}
                    />
                  </Grid>
                </Grid>
              </Box> */}
              <Box mt={2} className={classes.btnBox}>
                <Button
                  variant="contained"
                  size="large"
                  color="primery"
                  className="btn-block removeredius"
                  onClick={() => setOpen1(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  className="btn-block removeredius ml-10"
                  onClick={() => updateFeeshandler()}
                  disabled={isUpdating}
                >
                  Apply {isUpdating && <ButtonCircularProgress />}
                </Button>
              </Box>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}{' '}
    </Box>
  )
}
