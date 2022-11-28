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
import { useLocation } from "react-router-dom";

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
  console.log("title", title);

  //

  const editor = useRef(null);
  const [content, setContent] = useState("");

  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
  };
  // const [Type, setType] = useState("");
  const location = useLocation();
  const [Type, setType] = useState("");
  const [idds, setIdd] = useState("");
  const [description, setdescription] = useState("");
  const accessToken = window.sessionStorage.getItem("AccessToken");
  console.log("description", description);
  console.log("idd", idds);
  const formData = new FormData();

  // formData.append("staticId", idd);
  // console.log("idd++++++dfghdfg+++>>>>>", idd);
  const addEditStaticContent = async (idd) => {
    // formData.append("staticId", idd);
    console.log("hhh", idds);
    try {
      if (idd !== "") {
        await axios
          .put(
            Apiconfig.editStaticContent,
            {
              Type: Type,
              title: title,
              description: description,
              staticId: idds,
            },
            {
              headers: {
                token: `${accessToken}`,
              },
              // data: {
              //   staticId: idd,
              // },
            }
          )
          .then(async (res) => {
            if (res.data.response_code == 200) {
              setamo(res.data.result);
              toast.success("Updated successfully");
              history.push("/Termsof-Use");
              // setNumpages(res.data.result.pages);
              // setTotal(res.data.result);
              console.log("listnhjghj))))ft", res.data.result.docs);
            }
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (location.search.substring(1, location.search.length)) {
      const id = location.search.substring(1, location.search.length);
      setIdd(id);
    }
  }, [location]);

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
              Edit Static Content
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
                      onClick={addEditStaticContent}
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
