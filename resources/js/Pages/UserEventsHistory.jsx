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
        <div className="p-4 border-b border-slate-300 rounded-lg shadow-sm bg-white">
          <h1 className="text-xl font-bold mb-2 leading-none">
            User events history
          </h1>
          <p className="leading-none mb-4 text-slate-500 text-sm">
            See all the actions made within the system.
          </p>

          {userEvents.length > 0 ? (
            <div className="border rounded-lg border-slate-200">
              {userEvents.map((userEvent) => (
                <div
                  key={userEvent.id}
                  className="border-b last:border-0 border-slate-200 p-3 pb-4"
                >
                  <div className="flex gap-2">
                    <div className="mb-2 text-xs font-semibold px-2 text-slate-500 py-0.5 rounded-md border-[1px] border-slate-200 w-max">
                      {userEvent.event_name}
                    </div>
                    {userEvent === userEvents[0] ? (
                      <div className="text-indigo-500 mb-2 text-xs font-semibold px-2 py-0.5 rounded-md border-[1px] border-indigo-300 w-max">
                        Latest
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <div className="flex space-x-1 text-sm">
                      <p className="font-semibold mb-0">
                        {userEvent.user_name ===
                        `${auth.user.firstname} ${auth.user.lastname}`
                          ? "You"
                          : userEvent.user_name}
                      </p>
                      <p className="mb-0">{userEvent.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm py-10 text-center rounded-lg text-slate-500 border-2 border-dashed border-slate-200">
              There's no user events
            </div>
          )}
        </div>
        {/* <table className="w-full">
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
             <tr className="[&>td]:text-sm [&>td]:border-l [&>td:first-child]:border-0 [&>td]:px-4 [&>td]:py-2.5">
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
            </tr> 
          </tbody>
            {userEvents.map((userEvent) => (
              <tr className="[&>td]:text-sm [&>td]:border-l [&>td:first-child]:border-0 [&>td]:px-4 [&>td]:py-2.5">
                <td>{userEvent.user_name === `${auth.user.firstname} ${auth.user.lastname}` ? 'You' : userEvent.user_name}</td>
                <td>{userEvent.event_name}</td>
                <td>{userEvent.campus_name}</td>
                <td>{userEvent.office_name}</td>
                <td>{userEvent.description}</td>
              </tr>
            ))}
        </table> */}
      </div>
    </PanelLayout>
  );
}
