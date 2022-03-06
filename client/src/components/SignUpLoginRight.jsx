import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import "date-fns";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  signup: {
    textAlign: "justify",
    padding: "80px 0px",
    paddingBottom: "20px",
  },
  title: {
    paddingBottom: "10px",
    fontSize: 40,
    margin: "10px 5px",
  },

  nextButton: {
    width: "150px",
    boxShadow: "none",
    color: "white",
    backgroundColor: "#5C7294",
    margin: "10px 5px",
    width: "510px",
    "&:hover": {
      backgroundColor: "#1A2F4F",
      boxShadow: "none",
    },
    "&:active": {
      boxShadow: "none",
    },
  },
  text1: {
    margin: "10px 5px",
    width: "510px",
  },
  text2: {
    margin: "10px 5px",
    width: "250px",
  },
  note: {
    marginTop: "-5px",
    marginLeft: "5px",
    fontSize: 14,
    color: "black",
    textDecoration: "underline",
    "&:hover": {
      color: "#ACACAC",
      textDecoration: "underline",
    },
  },
  note2: {
    marginTop: "-5px",
    marginLeft: "5px",
    fontSize: 14,
    color: "ACACAC",
  },
}));

export default function SignUpLogin({ page, setPage, data, setData }) {
  const classes = useStyles();

  const [value, setValue] = useState("recepient");
  const [btnDisabled, setBtnDisabled] = useState(true);

  // setData({...data, ['type']: value});

  const writeUserData = (key, dataValue) => {
    console.log("WRITE DATA");
    setData({ ...data, [key]: dataValue });
    console.log(data);
    if (key == "userId") {
      setBtnDisabled(!dataValue);
    }
  };

  useEffect((value) => {
    setData({ ...data });
  }, []);

  const saveForm = () => {
    console.log("DAVE FORM");
    console.log(data);
    axios
      .post(
        `https://k83w0o98ej.execute-api.us-east-1.amazonaws.com/prod/createuser`,
        data
      )
      .then((res) => {
        console.log("RESP");
        console.log(res);
        if (res.status == 200) {
          setPage("page2");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className={classes.signup}>
      <div>
        <h1 style={{ padding: "1px" }}>Sign Up</h1>
      </div>
      <TextField
        required
        id="standard-required"
        onChange={(event) => {
          writeUserData("firstName", event.target.value);
        }}
        label="First Name"
        variant="outlined"
        className={classes.text2}
        // styles={{alignSelf:'left'}}
      />
      <TextField
        required
        id="standard-required"
        onChange={(event) => {
          writeUserData("lastName", event.target.value);
        }}
        label="Last Name"
        variant="outlined"
        className={classes.text2}
      />
      <div>
        <TextField
          required
          id="standard-required"
          onChange={(event) => {
            writeUserData("userId", event.target.value);
          }}
          label="Email Address"
          variant="outlined"
          className={classes.text1}
        />
      </div>
      <div>
        <TextField
          required
          id="standard-required"
          onChange={(event) => {
            writeUserData("password", event.target.value);
          }}
          label="Password"
          type="password"
          variant="outlined"
          className={classes.text1}
        />
      </div>
      <p
        className={classes.note2}
        style={{ color: "#ACACAC", margin: "10px 5px" }}
      >
        Your password must be at least 8 characters long.
      </p>
      <div className={classes.nextButtonDiv}>
        <Button
          variant="contained"
          onClick={saveForm}
          className={classes.nextButton}
          disabled={btnDisabled}
        >
          Sign Up
        </Button>
      </div>
      <div>
        <a href="/" className={classes.note} style={{ paddingLeft: "160px" }}>
          Already have an account? Log in
        </a>
      </div>
    </div>
  );
}
