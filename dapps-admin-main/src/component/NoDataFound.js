import { Box, Typography } from "@material-ui/core";
import React from "react";

export default function NoDataFound() {
  return (
    <Box align="center" mt={4} mb={5}>
      <Typography variant="h1" style={{ color: "#000", marginBottom: "10px" }}>
        NO DATA FOUND!
      </Typography>
      <img src="images/noresult.png" />
    </Box>
  );
}
