import React from "react";
//import Navbar from './NavBar'
import SignUpLoginRight from "./SignUpLoginRight";
import SignUpLoginLeft from "./SignUpLoginLeft";

export default function SignUpLogin({ page, setPage, data, setData }) {
  // const classes = useStyles();

  return (
    <div style={{ display: "flex" }}>
      <SignUpLoginLeft />
      <div style={{ padding: "20px 150px" }}>
        <SignUpLoginRight
          page={page}
          setPage={setPage}
          data={data}
          setData={setData}
        />
      </div>
    </div>
  );
}
