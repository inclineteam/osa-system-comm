import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { usePage } from "@inertiajs/react";
import CalendarCard from "./CalendarCard";
import AnnouncementsCard from "./AnnouncementsCard";
import Chart from "./Chart";

const AdminDashboard = ({}) => {
  const { auth } = usePage().props;
  return (
    <Row className="gy-3">
      <Col>
        <Row>
          <Chart />
        </Row>
        <Row>
          <CalendarCard expandButton />
        </Row>
      </Col>
      <Col lg={4}>
        <AnnouncementsCard className="" />
      </Col>
    </Row>
  );
};

export default AdminDashboard;
