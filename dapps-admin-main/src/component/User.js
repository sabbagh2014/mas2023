import React from 'react'
import { Grid, Box, makeStyles, Avatar, Typography, Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';
import Suspend from "./Suspend";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  customModal:{
    '& .MuiDialog-paperWidthSm':{
        width:"1100px",
        minWidth:"300px",   
        maxWidth:"100%",
    },
    '& .makeStyles-paper-70':{
        width:"1100px",
        minWidth:"300px",   
        maxWidth:"100%",
    }
   
},
}))
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function UsersCard(props) {
  const classes = useStyles()
  const [openBlock, setOpen1] = React.useState(false);
  const handleClickOpen1 = () => {
      setOpen1(true);
  };

  const handleClose1 = () => {
      setOpen1(false);
  };
  return (

 <Box>
      <Grid container alignItems="center">
      <Grid item xs={12} md={10}>
      <Grid container alignItems="center">
      <Grid item xs={12} md={2}>
      <img src="images/user-profile.png" alt="" className="userimg"/>
      </Grid>
      <Grid item xs={12} md={10}>
      <Typography variant="h4" component="h4" style={{cursor:"pointer"}}  onClick={handleClickOpen1}>Adams berg - The happy doctor</Typography>
      <Typography variant="body" component="span">This is a bio</Typography>
      </Grid>
      </Grid>
      </Grid>
      <Grid item xs={12} md={2}>
        <Box align="center">
          <Typography variant="h6" component="h6">300</Typography>
          <Typography variant="span" component="span">subscribers</Typography>
        </Box>
      </Grid>
    </Grid>


    <Dialog
                open={openBlock}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose1}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                className={classes.customModal}

            >
                <DialogContent className={classes.paper}>
                    <DialogContentText id="alert-dialog-slide-description">
                       
                     <Box  align="center" mb={2}>
                         <img src="images/user-profile.png" alt="" className="userimg"/>
                         <Typography variant="h5" align="center" style={{color:"#000"}}>Adams Berg</Typography>
                         <Typography variant="body2" component="span" align="center" style={{color:"#792034"}}>Bio:</Typography>
                         <Typography variant="body2" component="p" align="center" style={{color:"#707070"}}>
                         Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum
                         </Typography>

                     </Box>
                     <Box align="center" mb={2}>
                     <Typography variant="body2" component="span" align="center" style={{color:"#792034"}}>Available bundles:</Typography>
                     <Box mt={2}><Suspend/></Box>
                     </Box>

                     <Grid container spacing={2}>
                         <Grid item xs={12} md={12}>
                         <Button
                                variant="contained"
                                size="large"
                                color="secondary"
                                className="btn-block  ml-10"
                                onClick={handleClose1}
                            >
                                Send a message
                            </Button>
                         </Grid>
                         <Grid item xs={12} md={12}>
                         <Button
                                variant="contained"
                                size="large"
                                color="secondary"
                                className="btn-block  ml-10"
                                onClick={handleClose1}
                            >
                                Put in featured
                            </Button>
                         </Grid>
                         <Grid item xs={12} md={6}>
                         <Button
                                variant="contained"
                                size="large"
                                color="primery"
                                className="btn-block  ml-10"
                                onClick={handleClose1}
                            >
                                Unsuspend account
                            </Button>
                         </Grid>
                         <Grid item xs={12} md={6}>
                         <Button
                                variant="contained"
                                size="large"
                                color="secondary"
                                className="btn-block  ml-10"
                                onClick={handleClose1}
                            >
                                Suspend account
                            </Button>
                         </Grid>
                         <Grid item xs={12} md={6}>
                         <Button
                                variant="contained"
                                size="large"
                                color="primery"
                                className="btn-block  ml-10"
                                onClick={handleClose1}
                            >
                                start their withdrawal of money
                            </Button>
                         </Grid>
                         <Grid item xs={12} md={6}>
                         <Button
                                variant="contained"
                                size="large"
                                color="secondary"
                                className="btn-block  ml-10"
                                onClick={handleClose1}
                            >
                                stop their withdrawal of money
                            </Button>
                         </Grid>
                         <Grid item xs={12} md={12}>
                         <Button
                                variant="contained"
                                size="large"
                                color="secondary"
                                className="btn-block  ml-10"
                                onClick={handleClose1}
                            >
                                Take their money on MAS
                            </Button>
                         </Grid>
                     </Grid>
                   
                    </DialogContentText>
                </DialogContent>
            </Dialog>

 </Box>


  
  )
}
