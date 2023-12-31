import { Link } from "@inertiajs/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import ReportsPerCampus from "./UnitHeadDashboard/ReportsPerCampus";
import LatestReminder from "./UnitHeadDashboard/LatestReminder";
import LatestAnnouncement from "./UnitHeadDashboard/LatestAnnouncement";
import LatestSubmissionBin from "./UnitHeadDashboard/LatestSubmissionBin";

const UnitHeadDashboard = ({ auth }) => {
  return (
    <Row>
      <Col>
        <div className="mb-4 relative overflow-hidden border-b border-slate-300 shadow-sm bg-white rounded-lg p-4">
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

        <ReportsPerCampus />
      </Col>
      <Col>
        <LatestReminder />
        <LatestAnnouncement />
        <LatestSubmissionBin />
      </Col>
    </Row>
  );
};

export default UnitHeadDashboard;
