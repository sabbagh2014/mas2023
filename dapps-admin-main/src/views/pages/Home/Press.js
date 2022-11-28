
import { Container, TextField,Grid, Button} from '@material-ui/core';
import React from 'react';

export default function Press() {
  return (
    <Container>
            <Grid container spacing={4}>
            <Grid item xs={12} >  
        
            <TextField required
          label="Title"
          variant="outlined"
          fullWidth
        /></Grid>
        <Grid item xs={12} >
        <TextField
          label="Description"
          variant="outlined"
          multiline
          rows={5}
          fullWidth

        /></Grid>
        <Grid item xs={12} >
        <TextField
          label="Source Name"
          variant="outlined"
          fullWidth
        /></Grid>
        <Grid item xs={12} >
        <TextField label="Source URL" variant="outlined" required
          fullWidth
        />
        </Grid>
        <Button variant='contained'>Submit</Button>
        
        </Grid>
        </Container>
  )
}
