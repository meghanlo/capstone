import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import axios from "axios";
import "date-fns";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  signup: {
    textAlign: "center",
    padding: "40px 0px",
  },
  nextButton: {
    width: "150px",
    boxShadow: "none",
    color: "white",
    backgroundColor: "#5C7294",
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
  text1: {
    margin: "10px 5px",
    width: "100%",

    maxWidth: "500px",
  },
  text2: {
    margin: "10px 5px",
    width: "100%",
    maxWidth: "500px",
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
}));

export default function LoginRight({ data, setData }) {
  const [openError, setOpenError] = useState(false);

  const classes = useStyles();

  let navigate = useNavigate();

  const writeUserData = (key, dataValue) => {
    setData({ ...data, [key]: dataValue });
  };

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const saveForm = () => {
    console.log("SAVE FORM");
    console.log(data);
    axios
      .post(
        `https://k83w0o98ej.execute-api.us-east-1.amazonaws.com/prod/login`,
        {
          userId: data.userId,
          password: data.password,
        }
      )
      .then((res) => {
        console.log(res);
        if (res.status == 201) {
          const user = res.data;
          console.log(user);
          setData(user);
          navigate("/dashboard");
        } else {
          setOpenError(true);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className={classes.signup}>
      <div>
        <h1 style={{ padding: "1px" }}>Login</h1>
      </div>
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

      {/* <p className={classes.note} style={{color:"#ACACAC", margin:'10px 5px'}}>Your password must be atleast 8 characters long.</p> */}

      <div className={classes.nextButtonDiv}>
        <Button
          variant="contained"
          onClick={saveForm}
          className={classes.nextButton}
          disabled={!(data.password && data.userId)}
        >
          Login
        </Button>
      </div>
      <div>
        <a href="/" className={classes.note}>
          Forgot password?
        </a>
        <a
          href="/signup"
          className={classes.note}
          style={{ paddingLeft: "20px" }}
        >
          Don’t have an account? Sign up
        </a>
      </div>

      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={() => {
          setOpenError(false);
        }}
      >
        <Alert
          onClose={() => {
            setOpenError(false);
          }}
          severity="error"
        >
          Invalid Login Credentials
        </Alert>
      </Snackbar>
    </div>
  );
}
