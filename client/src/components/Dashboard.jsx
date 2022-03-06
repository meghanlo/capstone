import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const useStyles = makeStyles((theme) => ({
  title: {
    // paddingTop: '75px',
    paddingBottom: "10px",
    fontSize: 40,
    margin: "10px 5px",
  },
  openButton: {
    width: "30px",
    boxShadow: "none",
    color: "white",
    backgroundColor: "green",
    margin: "10px 5px",
    width: "100%",

    maxWidth: "500px",
    "&:hover": {
      backgroundColor: "#1A2F4F",
      // borderColor: '#0062cc',
      boxShadow: "none",
    },
    "&:active": {
      boxShadow: "none",
      // backgroundColor: '#0062cc',
      // borderColor: '#005cbf',
    },
    marginTop: "30px",
  },
}));

function createData(id, time, main, access, packages) {
  return { id, time, main, access, packages };
}

export default function SignUpLogin({ data, setData }) {
  const findBoxId = () => {
    if (data.boxId == null) {
      return ["1", "2"];
    } else {
      if (Array.isArray(data.boxId) == false) {
        return [data.boxId];
      }
    }
  };

  const [renderPage, setRenderPage] = useState(false);
  const [boxData, setBoxData] = useState([]);
  const [boxLastData, setLastBoxData] = useState([]);
  const [boxIds, setBoxIds] = useState(
    JSON.parse(localStorage.getItem("boxIds")) || findBoxId
  );
  const classes = useStyles();
  let navigate = useNavigate();

  let boxHistory = [];
  let boxLastStatus = [];

  localStorage.setItem("boxIds", JSON.stringify(boxIds));

  useEffect(async () => {
    await Promise.all(
      boxIds.map(async (boxId) => {
        let res = await axios.get(
          `https://k83w0o98ej.execute-api.us-east-1.amazonaws.com/prod/gethistory?boxId=${boxId}`
        );

        console.log("RESPONSE");
        console.log(res);
        if (res.status == 201) {
          boxHistory = boxHistory.concat(res.data);
        }
      })
    );

    await Promise.all(
      boxIds.map(async (boxId) => {
        let res2 = await axios.get(
          `https://k83w0o98ej.execute-api.us-east-1.amazonaws.com/prod/getlaststatus?boxId=${boxId}`
        );

        console.log("RESPONSE last");
        console.log(res2);
        if (res2.status == 201) {
          boxLastStatus.push(res2.data);
        }
      })
    );

    const boxHistorySorted = boxHistory.sort((a, b) =>
      b.lastUpdated.localeCompare(a.lastUpdated)
    );
    console.log("boxHistorySorted");
    console.log(boxHistorySorted);
    const boxDataIntermediate = [];

    boxHistorySorted.forEach((item) => {
      let lastUpdated = item["lastUpdated"];
      let isMainDoorLocked = item["isMainDoorLocked"];
      let isMainDoorOpen = item["isMainDoorOpen"];
      let isAccessDoorLocked = item["isAccessDoorLocked"];
      let isAccessDoorOpen = item["isAccessDoorOpen"];
      let isPackageInside = item["isPackageInside"];

      let mainDoor;
      let accessDoor;
      let numPackages;

      if (isMainDoorOpen) {
        mainDoor = "OPEN";
      } else if (isMainDoorLocked) {
        mainDoor = "LOCKED";
      } else {
        mainDoor = "CLOSED (NOT LOCKED)";
      }
      if (isAccessDoorOpen) {
        accessDoor = "OPEN";
      } else if (isAccessDoorLocked) {
        accessDoor = "LOCKED";
      } else {
        accessDoor = "CLOSED (NOT LOCKED)";
      }

      numPackages = isPackageInside.toString();

      boxDataIntermediate.push(
        createData(
          item["boxId"],
          lastUpdated,
          mainDoor,
          accessDoor,
          numPackages
        )
      );
    });

    setBoxData(boxDataIntermediate);
    setLastBoxData(boxLastStatus);
    setRenderPage(true);
  }, []);

  const logout = () => {
    window.localStorage.removeItem("boxIds");
    navigate("/");
  };

  const openBoxDoor = (ID) => {
    axios
      .post(
        `https://k83w0o98ej.execute-api.us-east-1.amazonaws.com/prod/updatestatus`,
        {
          shouldAccessDoorOpen: true,
          boxId: ID,
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  if (renderPage) {
    return (
      <div className="main">
        <div style={{ padding: "50px", paddingBottom: "0px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1>Box History</h1>
            <Button
              onClick={logout}
              style={{
                width: "100px",
                boxShadow: "none",
                color: "white",
                backgroundColor: "grey",
                margin: "25px 10px",
              }}
            >
              Logout
            </Button>
          </div>

          <h2>Your Boxes:</h2>
          <div style={{ display: "flex" }}>
            {boxLastData.map((box) => (
              <div style={{ minWidth: "15em", marginRight: "5em" }}>
                <h3 style={{ padding: "1px" }}>Box ID: {box.boxId}</h3>
                <Button
                  variant="contained"
                  onClick={() => {
                    openBoxDoor(box.boxId);
                  }}
                  className={classes.openButton}
                  disabled={!(!box.isAccessDoorOpen && box.isAccessDoorLocked)}
                >
                  Unlock Access Door
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "50px" }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Box ID</StyledTableCell>
                  <StyledTableCell align="center">Time</StyledTableCell>
                  <StyledTableCell align="center">
                    Main Door Status
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Access Door Status
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Number of Packages
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {console.log("boxData" + boxData)}
                {boxData.map((row) => (
                  <StyledTableRow key={row.name}>
                    <StyledTableCell align="center">{row.id}</StyledTableCell>
                    <StyledTableCell align="center">{row.time}</StyledTableCell>
                    <StyledTableCell
                      align="center"
                      style={
                        row.main == "OPEN"
                          ? { color: "red" }
                          : row.main == "LOCKED"
                          ? { color: "green" }
                          : { color: "orange" }
                      }
                    >
                      {row.main}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      style={
                        row.access == "OPEN"
                          ? { color: "red" }
                          : row.access == "LOCKED"
                          ? { color: "green" }
                          : { color: "orange" }
                      }
                    >
                      {row.access}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.packages}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}
