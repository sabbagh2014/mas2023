import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Button,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Apiconfigs from 'src/Apiconfig/Apiconfig'
import axios from 'axios'
import Loader from 'src/component/Loader'
const rows = [
  createData(
    119,
    'Adams_berg_97',
    '**************************',
    '**************************',
    '0xd3bcd0Aa1EAF0a3A91b45F541DcaA498E8E78180',
  ),
  createData(
    120,
    'Adams_berg_97',
    'Adams_berg_900000',
    '175.151.1.14',
    '0xd3bcd0Aa1EAF0a3A91b45F541DcaA498E8E78180',
  ),
  createData('', '', '', '', ''),
  createData('', '', '', '', ''),
  createData('', '', '', '', ''),
]
function createData(sno, name, password, ip, walletaddress) {
  return { sno, name, password, ip, walletaddress }
}
const useStyles = makeStyles((theme) => ({
  LoginBox: {
    background: '#ccc',

    paddingBottom: '30px',
    '& h6': {
      fontWeight: 'bold',
      marginBottom: '10px',
    },
  },
  table: {
    border: '1px solid #e5e3dd',
    '& th': {
      border: '1px solid #e5e3dd',
      padding: '10px !important',
    },
    '& td': {
      border: '1px solid #e5e3dd',
      padding: '10px !important',
    },
  },
  Paper: {
    boxShadow: 'none',
  },
  MainRectangle: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '10px',
  },
  Rectangle: {
    width: '27.5px',
    height: '27.5px',
    border: 'solid 0.5px #d15b5b',
    backgroundColor: '#792034',
    textAlign: 'center',
    justifyContent: 'center',
    color: 'white',
    padding: '5px',
    margin: '10px',
    float: 'right',
    cursor: 'pointer',
  },
  Pageno: {
    display: 'flex',
    margin: '10px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tbody: {
    '&:nth-of-type(even)': {
      backgroundColor: '#f3f3f3',
    },
  },
  newbox: {
    marginTop: '50px',
  },
}))

export default function Login() {
  const classes = useStyles()
  
  const [modedata, setData] = useState([])
  const [page, setpage] = useState(1)
  const [numberOfPages, setNumberOfPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const datas = async (page) => {
    setIsLoading(true)
    await axios({
      method: 'GET',
      url: Apiconfigs.moderatorList,
      params: {
        page: page,
        limit: 5,
      },
      headers: {
        token: window.sessionStorage.getItem('AccessToken'),
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          const result = res.data.result.docs.filter((data) => data.ethAccount)
          setData(result)
          setNumberOfPages(res.data.result.pages)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        
        setIsLoading(false)
      })
  }

  useEffect(() => {
    datas(page)
  }, [page])
  return (
    <Box className={classes.LoginBox}>
      <Container maxWidth="xl">
        <Box className={classes.newbox}>
          <Typography
            variant="h5"
            style={{
              color: 'black',
              paddingTop: '20px',
              paddingBottom: '10px',
            }}
          >
            Moderators:
          </Typography>
          <TableContainer className={classes.Paper} component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow
                  style={{
                    background:
                      'linear-gradient(180deg, #c04848 0%, #480048 100%)',
                  }}
                >
                  <TableCell align="Center" style={{ color: 'white' }}>
                    Sr.No
                  </TableCell>
                  <TableCell align="Center" style={{ color: 'white' }}>
                    User Name
                  </TableCell>
                  <TableCell align="Center" style={{ color: 'white' }}>
                    Password
                  </TableCell>
                  {/* <TableCell align='Center'>IP</TableCell> */}
                  <TableCell align="Center" style={{ color: 'white' }}>
                    Wallet Address
                  </TableCell>
                  {/* <TableCell align="Center" style={{ color: "white" }}>
                    Action
                  </TableCell> */}
                </TableRow>
              </TableHead>
              {/*  <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row.sno}
                    </TableCell>
                    <TableCell align="Center">{row.name}</TableCell>
                    <TableCell align="Center">{row.password}</TableCell>
                    <TableCell align="Center">{row.ip}</TableCell>
                    <TableCell align="Center">{row.walletaddress}</TableCell>
                  </TableRow>
                ))}
                </TableBody>*/}
              <TableBody>
                {modedata.map((row, index) => (
                  <TableRow className={classes.tbody} key={row.name}>
                    <TableCell
                      style={{ color: 'black' }}
                      align="Center"
                      component="th"
                      scope="row"
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell style={{ color: 'black' }} align="Center">
                      {row.userName}
                    </TableCell>
                    <TableCell style={{ color: 'black' }} align="Center">
                      {row.password}
                    </TableCell>
                    {/* <TableCell align='Center'>{row.ip}</TableCell> */}
                    <TableCell style={{ color: 'black' }} align="Center">
                      {row.ethAccount.address}
                    </TableCell>
                    {/* <TableCell style={{ color: "black" }} align="Center">
                      {row.action}
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {isLoading && <Loader />}
          </TableContainer>
          <div className={classes.MainRectangle}>
            <span className={classes.Pageno}>
              {page} of {numberOfPages}
            </span>
            <div>
              {Array.from({ length: parseInt(numberOfPages) }).map(
                (data, i) => {
                  let value = numberOfPages - i
                  return (
                    <div
                      onClick={() => setpage(value)}
                      className={classes.Rectangle}
                      key={i}
                    >
                      <span>{value}</span>
                    </div>
                  )
                },
              )}
            </div>
          </div>

          <Box align="right" mt={3}>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              className=" removeredius"
              component={Link}
              to="/Userview"
            >
              Edit
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
