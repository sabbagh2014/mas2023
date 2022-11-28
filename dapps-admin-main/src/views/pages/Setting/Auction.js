import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Button,
  TextField,
  Typography,
  makeStyles,
  Grid,
  Link,
} from "@material-ui/core";
import NFTCard from "src/component/NFTCard";
import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfig";
import Loader from "src/component/Loader";
const useStyles = makeStyles((theme) => ({
  input_fild: {
    backgroundColor: "#ffffff6e",
    borderRadius: "5.5px",
    border: " solid 0.5px #e5e3dd",
    color: "#141518",
    height: "48px",
    width: "100%",
    maxWidth: "500px",
    margin: "0 auto",
    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "transparent",
      },
    },
    "& .MuiInputBase-input": {
      color: "#141518",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
      borderWidth: 0,
    },
  },
  LoginBox: {
    "& h6": {
      fontWeight: "bold",
      marginBottom: "10px",
      "& span": {
        fontWeight: "300",
      },
    },
  },
  TokenBox: {
    border: "solid 0.5px #e5e3dd",
    padding: "5px",
  },
}));

export default function Login() {
  const classes = useStyles();
  const [details, setdetails] = useState([]);
  const [filtercontent, setfiltercontent] = useState([]);
  const [search, setsearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const nfts = async () => {
    setIsLoading(true);
    axios({
      methods: "GET",
      url: Apiconfigs.listorder,
      headers: {
        token: window.sessionStorage.getItem("AccessToken"),
      },
    })
      .then(async (res) => {
        setdetails(res.data.result);
        setfiltercontent(res.data.result);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setIsLoading(false);
      });
  };
  useEffect(() => {
    nfts();
  }, []);
  useEffect(() => {
    if (search !== "") {
      const result = details.filter(
        (details) =>
          details?.title?.toLowerCase().indexOf(search?.toLowerCase()) > -1
      );
      setfiltercontent(result);
    } else {
      setfiltercontent(details);
    }
  }, [search]);

  return (
    <Box className={classes.LoginBox} mb={5} mt={2}>
      <Container maxWidth="xl">
        <Box>
          <Typography variant="h5" style={{ color: "black" }}>
            Auction :
          </Typography>
          <Box textAlign="center" mb={3}>
            <TextField
              placeholder="Search for an NFT"
              variant="outlined"
              value={search}
              className={classes.input_fild}
              onChange={(e) => setsearch(e.target.value)}
            />
          </Box>
        </Box>
      </Container>
      <Container maxWidth="xl" style={{ marginTop: "40px" }}>
        <Grid container spacing={3}>
          {filtercontent?.map((row, i) => {
            return (
              <Grid item key={i} xs={12} sm={6} md={4} lg={3}>
                <NFTCard data={row} />
              </Grid>
            );
          })}
        </Grid>
        {!isLoading && filtercontent && filtercontent.length === 0 && (
          <Box textAlign={"center"} mt={3}>
            <Typography textAlign={"center"}>Data not found</Typography>
          </Box>
        )}
        {isLoading && <Loader />}
      </Container>
    </Box>
  );
}
