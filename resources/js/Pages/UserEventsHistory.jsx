import AdminDashboard from "@/Components/AdminDashboard";
import ContentWrapper from "@/Components/ContentWrapper";
import NavbarComponent from "@/Components/Navbar";
import SuperAdminDashboard from "@/Components/SuperAdminDashboard";
import UnitHeadDashboard from "@/Components/UnitHeadDashboard";
import AppLayout from "@/Layouts/AppLayout";
import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";
import { useThemeState } from "@/States/States";
import { Link, Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Alert, Card, Col, Row } from "react-bootstrap";

export default function UserEventsHistory({ auth, userEvents }) {
  return (
    <PanelLayout userAuth={auth} defaultActiveLink="User Events History">
      <div className="content-wrapper">
        <p>hello world</p>
      </div>
    </PanelLayout>
  );
}
