import {
  Box,
  TableRow,
  TableCell,
  Button,
  makeStyles,
  Link,
} from "@material-ui/core";
import React from "react";

import VisibilityIcon from "@material-ui/icons/Visibility";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUserRounded";
import BlockUserIcon from "@material-ui/icons/BlockRounded";

import { sortAddress } from "src/utils";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({}));

export default function UserList(props) {
  const classes = useStyles();
  const { row, index, blockUserHandler } = props;
  return (
    <TableRow className={classes.tbody} key={row.name}>
      <TableCell
        style={{ color: "black" }}
        align="Center"
        component="th"
        scope="row"
      >
        {index + 1}
      </TableCell>
      
      <TableCell style={{ color: "black" }} align="Center">
        {row.name} {'@'}{row.userName}
      </TableCell>
      <TableCell style={{ color: "black" }} align="Center">
        {row.email}
        {row.emailVerification && <VerifiedUserIcon style={{ fontSize: "15px" }} />}
      </TableCell>
      <TableCell style={{ color: "black" }} align="Center">
        {sortAddress(row?.ethAccount?.address)}
      </TableCell>
      <TableCell style={{ color: "black" }} align="Center">
        {parseFloat(row.masBalance).toFixed(2)} MAS<br />
        {parseFloat(row.busdBalance).toFixed(2)} BUSD<br />
        {parseFloat(row.usdtBalance).toFixed(2)} USDT<br />
      </TableCell>
      <TableCell style={{ color: "black" }} align="Center">
        <Box spacing={2}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Link
            to={{
              pathname: "/user-management",
              state: {
                id: row._id,
              },
              search: row._id,
            }}
            component={RouterLink}
          >
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              style={{
                width: "30px",
                height: "30px",
              }}
            >
              <VisibilityIcon style={{ fontSize: "15px" }} />
            </Button>
          </Link>
          <br />
          <Button
              variant="contained"
              color="primary"
              className={classes.button}
              style={{
                width: "30px",
                height: "30px",
                fontSize: '15px',
              }}
              onClick={() => blockUserHandler(row._id)}
            >
            {row.status == 'BLOCK'? 'unblock' : <BlockUserIcon style={{ fontSize: "15px" }} />}
              
            </Button>
        </Box>
      </TableCell>
    </TableRow>
  );
}
