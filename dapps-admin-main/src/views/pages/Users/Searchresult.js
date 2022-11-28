import React from 'react';
import User from 'src/component/User';
import SearchIcon from '@material-ui/icons/Search';
import {
  Box,
  Container,
  Divider,
  IconButton,
  TextField,
  Typography,
  Button,
  makeStyles,
  Grid,
} from '@material-ui/core';
import NFTCard from 'src/component/NFTCard';

const useStyles = makeStyles((theme) => ({
  input_fild: {
    backgroundColor: '#ffffff6e',
    borderRadius: '5.5px',
    border: ' solid 0.5px #e5e3dd',
    color: '#141518',
    height: '48px',
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
    borderRadius: '20px',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'transparent',
      },
    },
    '& .MuiInputBase-input': {
      color: '#141518',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'transparent',
      borderWidth: 0,
    },
  },
  LoginBox: {
    paddingTop: '110px',
    paddingBottom: '50px',
    '& h6': {
      fontWeight: 'bold',
      marginBottom: '10px',
      '& span': {
        fontWeight: '300',
      },
    },
  },
  divider: {
    padding: '20px 10px',
  },
  TokenBox: {
    border: 'solid 0.5px #e5e3dd',
    padding: '5px',
  },
  header: {
    textAlign: 'center',
  },
}));

export default function Login() {
  const classes = useStyles();

  return (
    <Box className={classes.LoginBox} mb={5}>
      <Container maxWidth='xl'>
        <Box>
          <h3 className={classes.header}>Results For:</h3>
          <Box textAlign='center' mb={3}>
            {/* <IconButton className={classes.iconButton}>
              <SearchIcon />
            </IconButton> */}
            <TextField
              defaultValue='Adams berg'
              variant='outlined'
              className={classes.input_fild}
            />
          </Box>
        </Box>
      </Container>
      <Container>
        <User />
      </Container>
      <Container maxWidth='lg' className={classes.divider}>
        <Divider variant='middle' />
      </Container>
      <Container maxWidth='lg'>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            {/* <NFTCard /> */}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            {/* <NFTCard /> */}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            {/* <NFTCard /> */}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
