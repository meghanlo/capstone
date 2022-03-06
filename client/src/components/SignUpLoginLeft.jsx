import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import "date-fns";

const useStyles = makeStyles((theme) => ({
  leftside: {
    padding: "10px 20px",
    paddingTop: "120px",
    textAlign: "center",
  },
  title: {
    color: "white",
    paddingTop: "36px",
  },
  text: {
    color: "white",
    paddingTop: "20px",
  },
}));

export default function SignUpLoginLeft() {
  const classes = useStyles();

  return <div style={{ width: "35%", backgroundColor: "#5C7294" }}></div>;
}
