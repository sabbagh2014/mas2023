import React, { useState, useContext, useEffect } from 'react'
import {
  Grid,
  Container,
  Box,
  Typography,
  makeStyles,
  TextField,
  Button,
  FormHelperText,
  InputAdornment,
  IconButton,
  TableBody,
  TableContainer,
  Table,
  TableCell,
  TableRow,
  TableHead,
  Checkbox,
} from '@material-ui/core'
import { useHistory, useLocation } from 'react-router-dom'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import Apiconfigs from 'src/Apiconfig/Apiconfig'
import axios from 'axios'
import { toast } from 'react-toastify'
import { isValidationEmail, isValidPassword } from 'src/utils'
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
  buttonGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: '12px',
    '& button': {
      margin: '0px 3px',
    },
  },
}))

export default function AddSubAdmin() {
  const history = useHistory()
  const location = useLocation()
  const [isSubmit, setIsSubmit] = useState(false)
  const classes = useStyles()
  const accessToken = sessionStorage.getItem('AccessToken')
  const [isPasswordValid, setIsPassowrdValid] = useState(false)
  const [isValidpass, setIsValidPass] = useState(false)
  const [show, setshow] = useState(false)
  const [hide, setHide] = useState(false)
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false)
  const [subAdminData, setSubAdminData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [permissions, setPermissions] = useState({
    dashboard: false,
    userManagement: false,
    subAdminManagement: false,
    settingsManagement: false,
    bannerManagement: false,
    referralManagement: false,
    staticManagement: false,
  })
  const permissionChangeHandler = (e) => {
    const name = e.target.name
    const value = e.target.checked
    const temp = { ...permissions, [name]: value }
    setPermissions(temp)
  }
  const [loacationData, setLocationData] = useState({
    searchKey: '',
    componentCall: '',
  })
  const [credentails, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const getInputFieldValues = (e) => {
    const name = e.target.name
    const value = e.target.value
    const temp = { ...credentails, [name]: value }
    setCredentials(temp)
  }
  const something = (event) => {
    if (event.keyCode === 13) {
      addSubAdminHandler()
    }
  }
  //addAdmin & editAdmin
  const addSubAdminHandler = async () => {
    setIsSubmit(true)
    if (
      credentails.name !== '' &&
      credentails.email !== '' &&
      credentails.password !== '' &&
      credentails.confirmPassword !== ''
    ) {
      setIsSubmit(false)
      if (
        credentails.email === '' ||
        isValidationEmail(credentails.email) === true
      ) {
        setIsEmailValid(false)
        if (
          credentails.password === '' ||
          isValidPassword(credentails.password) == true
        ) {
          setIsValidPass(false)
          if (credentails.password === credentails.confirmPassword) {
            setIsPassowrdValid(false)
            setIsCreatingAdmin(true)
            try {
              const methodFinder =
                loacationData.componentCall === 'Edit' ? 'PUT' : 'POST'

              const res = await axios({
                method: methodFinder,
                url: Apiconfigs.subAdmin,
                headers: {
                  token: accessToken,
                },
                data:
                  methodFinder === 'PUT'
                    ? {
                        _id: loacationData.searchKey,
                        name: credentails.name,
                        email: credentails.email,
                        password: credentails.confirmPassword,
                        permissions: {
                          dashboard: permissions?.dashboard,
                          userManagement: permissions?.userManagement,
                          subAdminManagement: permissions?.subAdminManagement,
                          settingsManagement: permissions?.settingsManagement,
                          bannerManagement: permissions?.bannerManagement,
                          referralManagement: permissions?.referralManagement,
                          staticManagement: permissions?.staticManagement,
                        },
                      }
                    : {
                        name: credentails.name,
                        email: credentails.email,
                        password: credentails.confirmPassword,
                        permissions: {
                          dashboard: permissions?.dashboard,
                          userManagement: permissions?.userManagement,
                          subAdminManagement: permissions?.subAdminManagement,
                          settingsManagement: permissions?.settingsManagement,
                          bannerManagement: permissions?.bannerManagement,
                          referralManagement: permissions?.referralManagement,
                          staticManagement: permissions?.staticManagement,
                        },
                      },
              })
              if (res.data.statusCode === 200) {
                if (methodFinder === 'PUT') {
                  toast.success(
                    `You have successfully edited details of ${credentails?.name}`,
                  )
                } else {
                  toast.success(
                    `You have successfully added ${credentails?.name} as Sub-admin`,
                  )
                }

                history.push('/sub-admin')
                setIsCreatingAdmin(false)
              }
            } catch (error) {
              console.log(error)
              toast.error(error.response.data.responseMessage)
              setIsCreatingAdmin(false)
            }
          } else {
            setIsPassowrdValid(true)
          }
        } else {
          setIsValidPass(true)
        }
      } else {
        setIsEmailValid(true)
      }
    }
  }
  const getSubAdminProfileHandler = async (id) => {
    try {
      setIsLoading(true)
      const res = await axios({
        method: 'GET',
        url: `${Apiconfigs.subAdmin}/${id}`,
        headers: {
          token: accessToken,
        },
      })
      if (res.data.statusCode === 200) {
        setSubAdminData(res.data.result)
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }
  useEffect(() => {
    const locationSearchKey = location.search.split('?')
    const locationSateCheck = location.state
    if (locationSateCheck?.component === 'Edit') {
      if (locationSearchKey[1]) {
        setLocationData({
          searchKey: locationSearchKey[1],
          componentCall: locationSateCheck?.component,
        })
      }
    } else {
      setLocationData({
        searchKey: loacationData?.searchKey,
        componentCall: locationSateCheck?.component,
      })
    }
  }, [location])

  useEffect(() => {
    if (loacationData.searchKey) {
      getSubAdminProfileHandler(loacationData.searchKey)
    }
  }, [loacationData.searchKey])
  useEffect(() => {
    if (subAdminData) {
      setCredentials({
        name: subAdminData?.name ? subAdminData?.name : '',
        email: subAdminData?.email ? subAdminData?.email : '',
        // password: subAdminData?.password ? subAdminData?.password : "",
      })
      setPermissions({
        dashboard: subAdminData?.permissions?.dashboard ? true : false,
        userManagement: subAdminData?.permissions?.userManagement
          ? true
          : false,
        subAdminManagement: subAdminData?.permissions?.subAdminManagement
          ? true
          : false,
        settingsManagement: subAdminData?.permissions?.settingsManagement
          ? true
          : false,
        bannerManagement: subAdminData?.permissions?.bannerManagement
          ? true
          : false,
        referralManagement: subAdminData?.permissions?.referralManagement
          ? true
          : false,
        staticManagement: subAdminData?.permissions?.staticManagement
          ? true
          : false,
      })
    }
  }, [subAdminData])
  return (
    <Box className={classes.bannerSectionBody} mt={1}>
      <Container maxWidth="xl">
        <Box>
          <Typography variant="h3">{`${loacationData.componentCall} Sub-Admin`}</Typography>
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <label>Name :</label>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  name="name"
                  placeholder="Enter sub-admin name"
                  className={classes.input_fild2}
                  onChange={getInputFieldValues}
                  error={isSubmit && credentails.name === ''}
                  value={credentails.name}
                  helperText={
                    isSubmit &&
                    credentails.name === '' &&
                    'Please enter sub-admin name'
                  }
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <label>Email :</label>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  name="email"
                  placeholder="Enter sub-admin email"
                  className={classes.input_fild2}
                  onChange={getInputFieldValues}
                  value={credentails.email}
                  error={isSubmit && credentails.email === ''}
                  helperText={
                    isSubmit &&
                    credentails.email === '' &&
                    'Please enter sub-admin email'
                  }
                />
                {isEmailValid && (
                  <FormHelperText style={{ color: '#ff7d68' }}>
                    Please enter a valid email address
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <label>Password :</label>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  type={show ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter password"
                  className={classes.input_fild2}
                  onChange={getInputFieldValues}
                  error={isSubmit && credentails.password === ''}
                  helperText={
                    isSubmit &&
                    credentails.password === '' &&
                    'Please enter password'
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setshow(!show)}
                        >
                          {show ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {isValidpass && (
                  <FormHelperText style={{ color: '#ff7d68' }}>
                    Please enter a valid password
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <label>Confirm Password :</label>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  type={hide ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  className={classes.input_fild2}
                  onChange={getInputFieldValues}
                  onKeyDown={(e) => something(e)}
                  error={isSubmit && credentails.confirmPassword === ''}
                  helperText={
                    isSubmit &&
                    credentails.confirmPassword === '' &&
                    'Please confirm your password'
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setHide(!hide)}
                        >
                          {hide ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {isPasswordValid && (
                  <FormHelperText style={{ color: '#ff7d68' }}>
                    Password mismatched
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <label>Permission :</label>
              </Grid>
              {!isLoading && (
                <Grid item xs={12} md={9}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow className={`${classes.tablerow1} tableHead`}>
                          <TableCell style={{ width: '50px' }}>Sr.No</TableCell>
                          <TableCell>Module Name</TableCell>
                          <TableCell>Yes/No</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody className={classes.tablerow1}>
                        <TableRow>
                          <TableCell> 1</TableCell>{' '}
                          <TableCell>Dashboard</TableCell>{' '}
                          <TableCell className={classes.check}>
                            <input
                              type="checkbox"
                              name="dashboard"
                              onChange={permissionChangeHandler}
                              defaultChecked={permissions?.dashboard}
                            />
                          </TableCell>{' '}
                        </TableRow>
                        <TableRow>
                          <TableCell> 2</TableCell> <TableCell>Users</TableCell>{' '}
                          <TableCell className={classes.check}>
                            <input
                              type="checkbox"
                              name="userManagement"
                              onChange={permissionChangeHandler}
                              defaultChecked={permissions?.userManagement}
                            />
                          </TableCell>{' '}
                        </TableRow>
                        <TableRow>
                          <TableCell>3</TableCell>{' '}
                          <TableCell>Sub-admin Management</TableCell>{' '}
                          <TableCell className={classes.check}>
                            <input
                              type="checkbox"
                              name="subAdminManagement"
                              onChange={permissionChangeHandler}
                              defaultChecked={permissions?.subAdminManagement}
                            />
                          </TableCell>{' '}
                        </TableRow>
                        <TableRow>
                          <TableCell> 4</TableCell>{' '}
                          <TableCell>Settings</TableCell>{' '}
                          <TableCell className={classes.check}>
                            <input
                              type="checkbox"
                              name="settingsManagement"
                              onChange={permissionChangeHandler}
                              defaultChecked={permissions?.settingsManagement}
                            />
                          </TableCell>{' '}
                        </TableRow>
                        <TableRow>
                          <TableCell> 5</TableCell>{' '}
                          <TableCell>Banner</TableCell>{' '}
                          <TableCell className={classes.check}>
                            <input
                              type="checkbox"
                              name="bannerManagement"
                              onChange={permissionChangeHandler}
                              defaultChecked={permissions?.bannerManagement}
                            />
                          </TableCell>{' '}
                        </TableRow>
                        <TableRow>
                          <TableCell> 6</TableCell>{' '}
                          <TableCell>Referral</TableCell>{' '}
                          <TableCell className={classes.check}>
                            <input
                              type="checkbox"
                              name="referralManagement"
                              onChange={permissionChangeHandler}
                              defaultChecked={permissions?.referralManagement}
                            />
                          </TableCell>{' '}
                        </TableRow>
                        <TableRow>
                          <TableCell> 7</TableCell>{' '}
                          <TableCell>Static Management</TableCell>{' '}
                          <TableCell className={classes.check}>
                            <input
                              type="checkbox"
                              name="staticManagement"
                              onChange={permissionChangeHandler}
                              defaultChecked={permissions?.staticManagement}
                            />
                          </TableCell>{' '}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              )}
            </Grid>
            <Box className={classes.buttonGroup}>
              <Button
                variant="contained"
                size="large"
                color="secondary"
                onClick={() => history.push('/sub-admin')}
                disabled={isCreatingAdmin}
              >
                Back
              </Button>
              <Button
                variant="contained"
                size="large"
                color="secondary"
                onClick={addSubAdminHandler}
                disabled={isCreatingAdmin}
              >
                Submit {isCreatingAdmin && <ButtonCircularProgress />}
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
