import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Container,
  Typography,
  makeStyles,
} from "@material-ui/core";
import FaqData from "src/component/FaqData";
import Apiconfig from "../../../config/APIConfig";
import axios from "axios";
import { useLocation } from "react-router-dom";

const FaqDataList = [
  {
    head: "How do I know which Hashmask I am buying?",
    summary:
      "You don’t. That is the fun part. Only after the initial reveal phase is over or the sale concludes (Whichever is earlier), the artwork is assigned to your NFT. This is done by an on-chain random mechanism. The sale is purposely hidden in order to avoid the founders or anyone else to buy the rarest NFTs themselves. There is an initial sequence in which each NFT is hashed for the proof of the full collection. The actual sequence is determined after the initial sale period through a randomized starting index. So if the starting index is 5000, #0 Hashmask would get the image of the 5000th from the initial sequence. The random starting index is determined by either the first mint transaction after the reveal period or the mint transaction of the last NFT, i.e Hashmask #16383 (whichever is earlier).",
  },
  {
    head: "Will I be able to trade the Hashmasks after the sale?",
    summary:
      "The Hashmasks follow the ERC-721 standard and, as such, can be transferred freely amongst Ethereum wallets. We will not provide a secondary market place for Hashmasks on this website and have no control over users creating secondary markets for the Hashmasks on third-party websites.",
  },
  {
    head: "Price Slip: What if i mint Hashmasks just before the price tier ends?",
    summary:
      "If you mint more than one Hashmask near the end of price tier, there's a chance of price slip. So for example, let's say the current supply is 2999 (1 left for price change from 0.1 to 0.3), if you mint 10 masks at this point, you would be able to get all of them for the old price of 0.1. We purposely designed it this way for simplicity and avoiding too many reverted transactions at the end of each price tier.",
  },
  {
    head: "How much does a Hashmask cost?",
    summary:
      "There is an increasing pricing schedule for the Hashmasks. You can see the table below. Note that it is subject to a possibility of price slip as described in the section above.",
  },
  {
    head: "How do I know how rare my Hashmask is?",
    summary:
      "The rarity of each trait is revealed after the initial distribution period. You can scroll through the gallery to look at all the 16,384 digital portraits to see if you can detect patterns or other hidden traits.",
  },
  {
    head: "How can I name my Hashmask John, if another Hashmask already owns the name?",
    summary:
      "You will not be able to choose a name that already exists. In addition, there is no case sensitivity and no leading or trailing spaces. In order to be able to name your Hashmask John, you would need to purchase the current John from his owner, change the name of the current John to Simon and then you could name some other Hashmask John. But beware, if someone sees this transaction, they can frontrun you and get the name before you.",
  },
  {
    head: "When can I name my Hashmasks?",
    summary:
      "You will be able to claim your NCTs (and the bonus NCTs) immediately after the purchase of the NFT. You will be able to name any NFT you own immediately after the purchase. You will not know the gender or species of your NFT, though, so you could accidentally give a robot NFT a human name.",
  },
  {
    head: "Will others see my Hashmasks on the website?",
    summary:
      "Yes. The current overview page changes once the initial distribution period is over and will allow you to see a clear overview of the different categories of Hashmasks. You will be able to see the name of each NFT (assuming it was given one), too.",
  },
  {
    head: "Can I print a Hashmask and hang it on my wall?",
    summary:
      "Yes, you can. You own the NFT. As the private key holder of the wallet that owns the NFT, you are free to do with it as you please.",
  },
];

const useStyles = makeStyles((theme) => ({
  FAQ: {
    // background: "#000",
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(8),
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(10),
      paddingBottom: theme.spacing(8),
    },
    [theme.breakpoints.up("md")]: {
      paddingTop: theme.spacing(12),
      paddingBottom: theme.spacing(8),
    },
  },
}));

export default function FAQ() {
  const classes = useStyles();
  const [amo, setamo] = useState("");
  
  const FaqdataApi = async () => {
    try {
      await axios.get(Apiconfig.listFAQ).then(async (res) => {
        if (res.data.response_code == 200) {
          setamo(res.data.result);

          // setNumpages(res.data.result.pages);
          // setTotal(res.data.result);
          
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    FaqdataApi();
  }, []);

  return (
    <>
      <Box className={classes.FAQ}>
        {/* featured */}
        <Box mt={3} mb={2}>
          <Container maxWidth="lg">
            <Grid container spacing={2} className="counterSection">
              <Grid item xs={12} md={12} className="aboutText">
                <Typography gutterBottom variant="h4">
                  Support
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              {/* {amo?.map((data, i) => {
                return (
                  <Grid item xs={12} sm={12} md={12} key={i}>
                    <FaqData />
                  </Grid>
                );
              })} */}
              {amo &&
                amo.map((data, i) => (
                  <Grid item xs={12} sm={12} md={12} key={i}>
                    <FaqData data={data} />
                  </Grid>
                ))}
            </Grid>
          </Container>
        </Box>
      </Box>
    </>
  );
}
