import React from "react";
import Dashboard from "../components/Dashboard";

export default function MainDashboard({ data, setData }) {
  return (
    <div style={{ height: "-webkit-fill-available" }}>
      <div className="main-panel">
        <div>
          <Dashboard data={data} setData={setData} />
        </div>
      </div>
    </div>
  );
}
