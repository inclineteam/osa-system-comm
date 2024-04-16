import React from "react";
import { Col, Row } from "react-bootstrap";
import LatestReminder from "./UnitHeadDashboard/LatestReminder";
import LatestAnnouncement from "./UnitHeadDashboard/LatestAnnouncement";
import LatestSubmissionBin from "./UnitHeadDashboard/LatestSubmissionBin";
import Objective from "./Objective";
import { ObjectiveTableInput } from "./ObjectiveTableInput";

const UnitHeadDashboard = ({ auth }) => {
  return (
    <div>
      <div className="flex gap-6 flex-wrap">
        <div className="xl:flex-1">
          <LatestReminder />
        </div>
        <div className="xl:flex-1 w-full mb-4 flex flex-col justify-center relative overflow-hidden border-b border-slate-300 shadow-sm bg-white rounded-lg p-4">
          <p>Welcome,</p>
          <h1 className="text-3xl font-semibold">
            {auth.user.firstname} {auth.user.lastname}
          </h1>

          <div className="flex font-semibold items-center">
            {auth.user.campus.name}{" "}
            <div className="w-1 h-1 rounded-full mx-3 bg-slate-200"></div>{" "}
            {auth.user.designation.name}
          </div>

          <div className="right-0 top-0 absolute w-20 h-20 blur-3xl bg-green-500"></div>
        </div>
        <div className="xl:flex-1 w-full">
          <LatestAnnouncement />
        </div>
      </div>
      <Objective user={auth.user} />
    </div>
  );
};

export default UnitHeadDashboard;
