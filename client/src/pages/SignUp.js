import React, { useState } from "react";
import SignUpPage2 from "../components/SignUp2";
import SignUpLogin from "../components/SignUpLogin";

export default function SignUp({ data, setData }) {
  const [page, setPage] = useState("page1");

  const renderSwitch = (param) => {
    switch (param) {
      case "page1":
        return (
          <SignUpLogin
            page={page}
            setPage={setPage}
            data={data}
            setData={setData}
          />
        );
      case "page2":
        return (
          <SignUpPage2
            page={page}
            setPage={setPage}
            data={data}
            setData={setData}
          />
        );
      default:
        return <div></div>;
    }
  };

  return <div>{renderSwitch(page)}</div>;
}
