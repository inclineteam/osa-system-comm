import axios from "axios";
import { format } from "date-fns";
import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import {
  Badge,
  Card,
  Col,
  Image,
  ListGroup,
  ListGroupItem,
  Placeholder,
  Row,
} from "react-bootstrap";
import ReactTimeAgo from "react-time-ago";
import CalendarCard from "./CalendarCard";
import RemindersCard from "./RemindersCard";
import AnnouncementsCard from "./AnnouncementsCard";

const UnitHeadDashboard = ({ auth }) => {
  console.log(auth);

  const [latestReminder, setLatestReminder] = useState(null);

  useEffect(() => {
    const fetchLatestReminder = () => {
      axios.get(route("reminder.latest")).then((res) => {
        if (res.statusText === "OK") {
          setLatestReminder(res.data.latestReminder);
        }
      });
    };

    fetchLatestReminder();
  }, []);

  return (
    <Row>
      <Col>
        <div className="bg-white rounded-lg p-4">
          <p>Welcome,</p>
          <h1 className="text-3xl font-semibold">
            {auth.user.firstname} {auth.user.lastname}
          </h1>

          <div className="flex items-center">
            {auth.user.campus.name}{" "}
            <div className="w-1 h-1 rounded-full mx-3 bg-slate-200"></div>{" "}
            {auth.user.designation.name}
          </div>
        </div>
      </Col>
      <Col>
        <div className="bg-white rounded-lg p-4">
          {latestReminder ? (
            <div>{latestReminder.content}</div>
          ) : (
            <p>There is no reminder.</p>
          )}
        </div>
      </Col>
      {/* <Col xs={12} lg={5}>
                <AnnouncementsCard />
                <RemindersCard className="my-3"/>
            </Col>
            <Col>
                <CalendarCard expandButton/>
            </Col> */}
    </Row>
  );
};

export default UnitHeadDashboard;
