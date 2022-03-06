import React from "react";
import LoginRight from "./LoginRight";

export default function SignUpLogin({ data, setData }) {

  return (
    <div style={{ display: "flex" }}>
      <div style={{ padding: "1em 5em", width: "100%", alignSelf: "center" }}>
        <LoginRight data={data} setData={setData} />
      </div>
    </div>
  );
}
