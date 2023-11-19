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
  console.log(userEvents);
  return (
    <PanelLayout userAuth={auth} defaultActiveLink="User Events History">
      <div className="content-wrapper">
        <table className="w-full">
          <thead className="">
            <tr className="[&>th]:text-slate-500 [&>th]:bg-slate-50 [&>th]:border-l [&>th:first-child]:border-0 [&>th]:px-4 [&>th]:py-2 border-b [&>th]:text-sm [&>th]:font-bold">
              <th>User</th>
              <th>Event</th>
              <th>Campus</th>
              <th>Office</th>
              <th>Description</th>
            </tr>
          </thead>

          <tbody>
            {/* <tr className="[&>td]:text-sm [&>td]:border-l [&>td:first-child]:border-0 [&>td]:px-4 [&>td]:py-2.5">
              <td>
                {latestReport.data.unit_head.lastname},{" "}
                {latestReport.data.unit_head.firstname}{" "}
                {latestReport.data.unit_head.middlename}
              </td>
              <td>{latestReport.data.unit_head.campus.name}</td>
              <td>{latestReport.data.unit_head.designation.name}</td>
              <td>
                {dayjs(latestReport.data.date_submitted).format("MMM. D, YYYY")}
              </td>
              <td className="flex items-center">
                <div
                  className={`inline-block mr-2 w-2 h-2 rounded-full ${
                    statusColors[latestReport.data.status]
                  }`}
                ></div>
                {latestReport.data.status}
              </td>
            </tr> */}
            {userEvents.map((userEvent) => (
              <tr className="[&>td]:text-sm [&>td]:border-l [&>td:first-child]:border-0 [&>td]:px-4 [&>td]:py-2.5">
                <td>{userEvent.user_name}</td>
                <td>{userEvent.event_name}</td>
                <td>{userEvent.campus_name}</td>
                <td>{userEvent.office_name}</td>
                <td>{userEvent.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PanelLayout>
  );
}
