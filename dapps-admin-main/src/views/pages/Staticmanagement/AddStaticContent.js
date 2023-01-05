import React, { useRef, useEffect, useState } from "react";
import {
  Typography,
  Box,
  Container,
  Grid,
  TextField,
  Button,
  Paper,
  FilledInput,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@material-ui/core";
import { ToastContainer, toast } from "react-toastify";
import JoditEditor from "jodit-react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import { Link, useHistory } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import Apiconfig from "../../../config/APIConfig";
import axios from "axios";

const useStyles = makeStyles({
  btn: {
    backgroundColor: "#1273eb",
    color: "white",
    borderRadius: "40px",
    width: "130px",
    height: "6vh",
  },
  btn2: {
    backgroundColor: "#686869",
    color: "white",
    borderRadius: "40px",
    width: "130px",
    height: "6vh",
  },
});

const Editcontent = () => {
  const classes = useStyles();
  const editorRef = useRef(null);
  const history = useHistory();
  const [amo, setamo] = useState("");
  const [title, settitle] = useState("");
  

  //

  const editor = useRef(null);
  const [content, setContent] = useState("");

  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
  };
  // const [Type, setType] = useState("");
  const [Type, setType] = useState("");
  const [description, setdescription] = useState("");
  const accessToken = window.sessionStorage.getItem("AccessToken");
  
  const addStaticContent = async () => {
    await axios
      .post(
        Apiconfig.addStaticContent,
        {
          Type: Type,
          title: title,
          description: description,
        },
        {
          headers: {
            token: `${accessToken}`,
          },
        }
      )
      .then(async (res) => {
        if (res.data.response_code == 200) {
          setamo(res.data.result);
          toast.success("added successfully");
          history.push("/Termsof-Use");
          // setNumpages(res.data.result.pages);
          // setTotal(res.data.result);
          
        }
      });
  };

  return (
    <Container maxWidth="md">
      <Box>
        <Paper
          elevation={2}
          style={{
            margin: "40px ",
            padding: "30px 10px",
            paddingBottom: "50px",
          }}
        >
          <Box pl={5} mt={4} px={2}>
            {" "}
            <Typography variant="h3" style={{ fontWeight: "1000" }}>
              {" "}
              Add Static Content{" "}
            </Typography>{" "}
          </Box>
          <Box mt={4} px={2}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item md={3} xs={12}>
                    {" "}
                    <Typography style={{ fontWeight: "500" }}>
                      {" "}
                      Title{" "}
                    </Typography>{" "}
                  </Grid>
                  <Grid item md={9} xs={12}>
                    {" "}
                    {/* <OutlinedInput
                      fullWidth
                      disableUnderline={true}
                      style={{ height: "5vh", borderRadius: "50px" }}
                      placeholder="TITLE"
                      onChange={(e) => settitle(e.target.value)}
                    />{" "} */}
                    <TextField
                      onChange={(e) => settitle(e.target.value)}
                      id="outlined-basic"
                      placeholder="title "
                      size="small"
                      style={{ width: "100%" }}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={1} style={{ paddingTop: "23px" }}>
                  <Grid item md={3} xs={12}>
                    {" "}
                    <Typography style={{ fontWeight: "500" }}>
                      {" "}
                      Type{" "}
                    </Typography>{" "}
                  </Grid>
                  <Grid item md={9} xs={12}>
                    {" "}
                    {/* <OutlinedInput
                      fullWidth
                      disableUnderline={true}
                      style={{ height: "5vh", borderRadius: "50px" }}
                      placeholder="TITLE"
                      onChange={(e) => settitle(e.target.value)}
                    />{" "} */}
                    <TextField
                      onChange={(e) => setType(e.target.value)}
                      id="outlined-basic"
                      placeholder="type"
                      size="small"
                      style={{ width: "100%" }}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item md={3} xs={12}>
                    {" "}
                    <Typography style={{ fontWeight: "500" }}>
                      {" "}
                      Description{" "}
                    </Typography>{" "}
                  </Grid>
                  <Grid item md={9} xs={12}>
                    <Box>
                      <JoditEditor
                        ref={editor}
                        value={description}
                        config={config}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={(e) => setdescription(e)} // preferred to use only this option to update the content for performance reasons
                        onChange={(newContent) => {}}
                      />
                      {/* <TextField
                        onChange={(e) => setdescription(e.target.value)}
                        id="outlined-basic"
                        placeholder="description"
                        size="small"
                        style={{ width: "100%" }}
                        variant="outlined"
                      /> */}
                      {/* <OutlinedInput
                        fullWidth
                        disableUnderline={true}
                        style={{
                          height: "5vh",
                          borderRadius: "5px",
                        }}
                        placeholder="description"
                        onChange={(e) => setdescription(e.target.value)}
                      />{" "} */}
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid
                  container
                  spacing={1}
                  alignItems="center"
                  justify="center"
                >
                  <Grid item>
                    {" "}
                    <Button
                      type="submit"
                      className={classes.btn}
                      variant="contained"
                      onClick={addStaticContent}
                    >
                      {" "}
                      Submit
                    </Button>{" "}
                  </Grid>
                  <Grid item>
                    {" "}
                    <Link to="/Termsof-Use" style={{ textDecoration: "none" }}>
                      <Button
                        type="submit"
                        className={classes.btn2}
                        variant="contained"
                      >
                        {" "}
                        Cancel
                      </Button>{" "}
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Editcontent;
