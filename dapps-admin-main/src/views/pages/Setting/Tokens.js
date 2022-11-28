import React from 'react';
import {
  Box,
  Container,
  Button,
  TextField,
  List,
  ListItem,
  Typography,
  makeStyles,
  Link,
} from '@material-ui/core';
import { FaCheck } from 'react-icons/fa';
const useStyles = makeStyles((theme) => ({
  LoginBox: {
    '& h6': {
      fontWeight: 'bold',
      marginBottom: '10px',
      '& span': {
        fontWeight: '300',
      },
    },
  },
  TokenBox: {
    border: 'solid 0.5px #e5e3dd',
    padding: '5px',
  },
}));

export default function Login() {
  const classes = useStyles();
  return (
    <Box className={classes.LoginBox}>
      <Container maxWidth='xl'>
        <Box>
          <Typography variant='h6'>Tokens available:</Typography>
          <Box className={classes.TokenBox} mb={4}>
            <List className='tokenList'>
              <ListItem>
                {' '}
                <img src='images/tokens/5.png' /> <FaCheck />
              </ListItem>
              <ListItem>
                {' '}
                <img src='images/tokens/2.png' /> <FaCheck />
              </ListItem>
              <ListItem>
                {' '}
                <img src='images/tokens/3.png' /> <FaCheck />
              </ListItem>
              <ListItem>
                {' '}
                <img src='images/tokens/4.png' /> <FaCheck />
              </ListItem>
              <ListItem>
                {' '}
                <img src='images/tokens/5.png' /> <FaCheck />
              </ListItem>
              <ListItem>
                {' '}
                <img src='images/tokens/2.png' />{' '}
              </ListItem>
              <ListItem>
                {' '}
                <img src='images/tokens/3.png' />{' '}
              </ListItem>
              <ListItem>
                {' '}
                <img src='images/tokens/4.png' />{' '}
              </ListItem>
              <ListItem>
                {' '}
                <img src='images/tokens/5.png' />{' '}
              </ListItem>
              <ListItem>
                {' '}
                <img src='images/tokens/2.png' />{' '}
              </ListItem>
              <ListItem>
                {' '}
                <img src='images/tokens/3.png' />{' '}
              </ListItem>
              <ListItem>
                {' '}
                <img src='images/tokens/4.png' />{' '}
              </ListItem>
              <ListItem>
                {' '}
                <img src='images/tokens/5.png' />{' '}
              </ListItem>
              <ListItem>
                {' '}
                <img src='images/tokens/bar.png' />{' '}
              </ListItem>
            </List>
            <List className='tokenList'>
              <ListItem>
                {' '}
                <img src='images/tokens/5.png' /> <FaCheck />
              </ListItem>
              <ListItem>
                {' '}
                <img src='images/tokens/2.png' /> <FaCheck />
              </ListItem>
              <ListItem>
                {' '}
                <img src='images/tokens/3.png' /> <FaCheck />
              </ListItem>
              <ListItem>
                {' '}
                <img src='images/tokens/4.png' /> <FaCheck />
              </ListItem>
              <ListItem>
                {' '}
                <img src='images/tokens/5.png' /> <FaCheck />
              </ListItem>
              <ListItem>
                {' '}
                <img src='images/tokens/2.png' />{' '}
              </ListItem>
              <ListItem>
                {' '}
                <img src='images/tokens/3.png' />{' '}
              </ListItem>
              <ListItem>
                {' '}
                <img src='images/tokens/4.png' />{' '}
              </ListItem>
              <ListItem>
                {' '}
                <img src='images/tokens/5.png' />{' '}
              </ListItem>
              <ListItem>
                {' '}
                <img src='images/tokens/2.png' />{' '}
              </ListItem>
              <ListItem>
                {' '}
                <img src='images/tokens/3.png' />{' '}
              </ListItem>
              <ListItem>
                {' '}
                <img src='images/tokens/4.png' />{' '}
              </ListItem>
              <ListItem>
                {' '}
                <img src='images/tokens/5.png' />{' '}
              </ListItem>
              <ListItem>
                {' '}
                <img src='images/tokens/bar.png' />{' '}
              </ListItem>
            </List>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
