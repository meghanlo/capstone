import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import "date-fns";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import { useNavigate } from "react-router-dom";
// import AddressOptions from '../json/mailOptions'

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  signUpPages: {
    padding: "150px 0px",
    textAlign: "center",
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  formControl: {
    // margin: theme.spacing(1),
    minWidth: "400px",
  },
  nextButton: {
    width: "50px",
    boxShadow: "none",
    color: "white",
    backgroundColor: "#5C7294",
    margin: "10px 5px",
    width: "150px",
    "&:hover": {
      backgroundColor: "#1A2F4F",
      // borderColor: '#0062cc',
      boxShadow: "none",
    },
    "&:active": {
      boxShadow: "none",
    },
  },
}));

export default function SignUpPage2({ page, setPage, data, setData }) {
  const classes = useStyles();
  let navigate = useNavigate();

  const [value, setValue] = useState("");

  useEffect(() => {
    setData({ ...data });
  }, []);

  const writeUserData = (key, dataValue) => {
    console.log("PAGE2");
    console.log(data);
    setData({ ...data, [key]: dataValue });
    setValue(dataValue);
  };

  const saveForm = () => {
    console.log("PAGE2 SAVE");
    console.log(data);
    axios
      .post(
        `https://k83w0o98ej.execute-api.us-east-1.amazonaws.com/prod/updateuser`,
        {
          ...data,
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
    navigate("/dashboard");
  };

  const goBack = () => {
    setPage("page1");
  };

  return (
    <div className={classes.signUpPages}>
      <div>
        <h1 style={{ textAlignLast: "center" }}>Let's get you started</h1>
        <p style={{ textAlignLast: "center" }}>
          Please enter the ID number for your box
        </p>
      </div>
      <div style={{ textAlignLast: "center", padding: "10px" }}>
        <TextField
          required
          id="standard-required"
          onChange={(event) => {
            writeUserData("boxId", event.target.value);
          }}
          label="Box ID"
          variant="outlined"
          className={classes.text2}
          // styles={{alignSelf:'left'}}
        />
      </div>
      <div
        className={classes.nextButtonDiv}
        style={{ textAlignLast: "center" }}
      >
        <Button
          variant="contained"
          onClick={saveForm}
          className={classes.nextButton}
        >
          Next
        </Button>
      </div>
      <div style={{ textAlignLast: "center" }}>
        <Button
          // className={classes.button}
          startIcon={<ArrowBackIcon />}
          onClick={goBack}
        >
          Back
        </Button>
      </div>
    </div>
  );
}
