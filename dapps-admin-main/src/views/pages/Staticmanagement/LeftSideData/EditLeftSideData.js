import React,{useRef} from 'react'
import { Typography,Box,Container,Grid, TextField,Button,Paper, FilledInput,Radio,RadioGroup,FormControlLabel } from '@material-ui/core'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import {Link} from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';


const useStyles = makeStyles({
    btn:{
        backgroundColor:"#1273eb",
        color:"white",
        borderRadius:"40px",
        width:"130px",
        height:"6vh"
    },
    btn2:{

        backgroundColor:"#686869",
        color:"white",
        borderRadius:"40px",
        width:"130px",
        height:"6vh"
    }
    
  
      
    });
    
    


const Edit = () => {
    const classes=useStyles();
    const editorRef = useRef(null);
    return (
      <Container>
        <Box>
       <Paper elevation={2} style={{margin:"40px ",padding:"30px 10px",paddingBottom:'50px'}}  >
           <Box pl={5} mt={4} px={2}> <Typography variant="h3" style={{fontWeight:"1000"}}>  Edit Left Side Data </Typography>  </Box>
        <Box  mt={4} px={2}>
            <Grid container spacing={4}>
               <Grid item xs={12}> 
                    <Grid  container spacing={1} >

                       <Grid item md={2} xs={12}>  <Typography style={{fontWeight:"500"}}>   Title   </Typography>   </Grid> 
                       <Grid item md={10} xs={12}>  <OutlinedInput fullWidth disableUnderline={true} style={{  height:"5vh",borderRadius:"50px"}} />   </Grid>
                    </Grid>
               
               
               
               </Grid>
               <Grid item xs={12}> 
                    <Grid  container spacing={1} >

                       <Grid item md={2} xs={12} >  <Typography style={{fontWeight:"500"}}> Data </Typography>   </Grid> 
                       
                       <Grid item md={10} xs={12}>    <Editor
         onInit={(evt, editor) => editorRef.current = editor}
         initialValue="<p>R2V4 the future of redeemable NFT.
         create and Trade with us
         Gift Cards & Gift Voucher.
         Discount Coupons.
         Fundraising for non - profit.
         Collectibles</p>"
         init={{
           height: 500,
           menubar: false,
           plugins: [
             'advlist autolink lists link image charmap print preview anchor',
             'searchreplace visualblocks code fullscreen',
             'insertdatetime media table paste code help wordcount'
           ],
           toolbar: 'undo redo | formatselect | ' +
           'bold italic backcolor | alignleft aligncenter ' +
           'alignright alignjustify | bullist numlist outdent indent | ' +
           'removeformat | help',
           content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:18px }'
         }}
       />   </Grid>
                      
                    </Grid>
               
               
               
               </Grid>
          <Grid item xs={12}> 
                    <Grid  container spacing={1} alignItems="center" justify="center">

                       <Grid item >  <Button type="submit" className={classes.btn} variant="contained" > Update</Button>   </Grid> 
                       <Grid item > <Link to="/left-side-data" style={{textDecoration:'none'}}><Button type="submit" className={classes.btn2} variant="contained" > Cancel</Button></Link> </Grid>
                    </Grid>
          </Grid>
            </Grid>
            </Box>
       </Paper>
</Box>
</Container>
    )
}

export default Edit;