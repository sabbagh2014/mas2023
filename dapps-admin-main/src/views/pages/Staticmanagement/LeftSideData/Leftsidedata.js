import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import VisibilityIcon from "@material-ui/icons/Visibility";
import{Box,Button,Typography,Grid,Dialog,Slide,DialogActions,DialogContent,DialogContentText} from '@material-ui/core'
import { Link } from 'react-router-dom'
import BlockIcon from '@material-ui/icons/Block';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Logo from 'src/component/Logo';

function createData( type,data) {
  return { type,data};
}

const rows = [
    
    createData('Description',`R2V4 the future of redeemable NFT.
    create and Trade with us
    Gift Cards & Gift Voucher.
    Discount Coupons.
    Fundraising for non - profit.
    Collectibles`),
    
];


const useStyles = makeStyles({
  
  table: {
    minWidth: 500,
  },
  root: {
    '&:nth-of-type(odd)': {
    backgroundColor: '#e0e0e0',
    },
    },
 
  button: {
    minWidth: "initial",
    padding: "6px",
    marginLeft: "7px",
  },
  
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function LeftSideData() {
  
  const classes=useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (

    <div>
               
       
               <Box pl={5} mt={4}> <Typography variant="h3" style={{fontWeight:"1000"}}>  Left Side data </Typography> </Box>
    
        <Box mt={4} ml={4} mr={4}>        
        <TableContainer component={Paper} >
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              
              <TableCell
                style={{ color: "white", backgroundColor: "#252d47",minWidth:'100px'  }}
              >
               Type
              </TableCell>
              <TableCell
                style={{ color: "white", backgroundColor: "#252d47",minWidth:'200px' }}
              >
               Data
              </TableCell>
             
              
            

              <TableCell
                style={{ color: "white", backgroundColor: "#252d47",minWidth:"150px" }}
                align="center"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              <TableRow className={classes.root}>
                  <TableCell align='left' >Logo</TableCell>
                  <TableCell align='left'><Logo width="300"/></TableCell>
                  <TableCell  align="left">
                  <Box display="flex">
                   <Grid container justify="center">                
                   <Grid item>
                       <Link to="view-logo">
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                      >
                       <VisibilityIcon  style={{width:"25px"}} />
                      </Button>
                    </Link>
                    </Grid>
                     <Grid item>
                    <Link href="">
                      <Button
                        variant="contained"
                        color="Secondary"
                        className={classes.button}
                        onClick={handleClickOpen}
                      >
                        <DeleteIcon  style={{width:"25px"}} /> 
                      </Button>
                    </Link>
                    </Grid>
                   <Grid item>
                    <Link to="edit-logo">
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                      >
                        <EditIcon  style={{width:"25px"}} />           </Button>
                    </Link>
                    </Grid>

                    </Grid>

    
                  </Box>
                </TableCell>
              </TableRow>

            {rows.map((row,index) => (
               <TableRow key={index} className={classes.root}>
            
                
                <TableCell align="left">{row.type}</TableCell>
                <TableCell align="left">{row.data}</TableCell>
        
                <TableCell  align="left">
                  <Box display="flex">
                    <Grid container justify="center">
                      <Grid item>
                    <Link to="/view-left-side-data">
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                      >
                       <VisibilityIcon  style={{width:"25px"}} />
                      </Button>
                    </Link>
                    </Grid>
                     <Grid item>
                    <Link href="">
                      <Button
                        variant="contained"
                        color="Secondary"
                        className={classes.button}
                        onClick={handleClickOpen}
                      >
                        <DeleteIcon  style={{width:"25px"}} /> 
                      </Button>
                    </Link>
                    </Grid>
                   <Grid item>
                    <Link to="/edit-left-side-data">
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                      >
                        <EditIcon  style={{width:"25px"}} />           </Button>
                    </Link>
                    </Grid>
                    </Grid>
    
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </TableContainer>
        </Box>

        
 <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
<DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
             Are you sure you want to delete the content?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Yes
          </Button>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
        </DialogActions>
      </Dialog>

        </div>
     
  );
}