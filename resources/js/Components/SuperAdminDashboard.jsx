import React from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import DashboardCard from "./DashboardCard";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import CalendarCard from "./CalendarCard";
import AnnouncementsCard from "./AnnouncementsCard";
import dayjs from "dayjs";
import { Link } from "@inertiajs/react";
import Chart from "./Chart";

const SuperAdminDashboard = () => {
  const [campuses, setCampuses] = useState([]);
  const [fetchingCampus, setFetchingCampus] = useState(true);
  const [latestReport, setLatestReport] = useState({
    loading: true,
    data: null,
  });

  useEffect(() => {
    const fetchCampuses = () => {
      setFetchingCampus(true);
      axios.get(route("campus.index")).then((res) => {
        setCampuses(res.data.campuses);
        setFetchingCampus(false);
      });
    };

    const fetchLatestReport = () => {
      axios.get(route("reports.latest")).then((res) => {
        console.log("datasss", res.data);
        setLatestReport({ loading: false, data: res.data.latestReport });
      });
    };

    fetchCampuses();
    fetchLatestReport();
  }, []);

  const statusColors = {
    Approved: "bg-emerald-600",
    Rejected: "bg-rose-600",
    Pending: "bg-amber-600",
  };

  return (
    <div>
      <Row className="gx-2 gy-3">
        <Col>
          <Row className="px-2.5">
            <Chart />
          </Row>
          <Row className="px-2.5">
            <div className="p-4 border-b border-slate-300 rounded-lg shadow-sm bg-white mb-8">
              <h1 className="text-xl font-bold mb-2 leading-none">
                Latest report
              </h1>
              <p className="leading-none mb-4 text-slate-500 text-sm">
                See details about the user and status of the latest submitted
                report.
              </p>
              <div
                class={`overflow-hidden rounded-md border-slate-200 ${
                  !latestReport.data ? "border-2 border-dashed" : "border"
                }`}
              >
                {latestReport.loading ? (
                  <div className="py-6 text-center">Loading... Please wait</div>
                ) : latestReport.data != null ? (
                  <table className="w-full">
                    <thead className="">
                      <tr className="[&>th]:text-slate-500 [&>th]:bg-slate-50 [&>th]:border-l [&>th:first-child]:border-0 [&>th]:px-4 [&>th]:py-2 border-b [&>th]:text-sm [&>th]:font-bold">
                        <th>User</th>
                        <th>Campus</th>
                        <th>Office</th>
                        <th>Date Submitted</th>
                        <th>Status</th>
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
                          {dayjs(latestReport.data.date_submitted).format(
                            "MMM. D, YYYY"
                          )}
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
                  </table>
                ) : (
                  <div className="text-slate-500 text-sm py-6 text-center">
                    No reports submitted yet.
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                {latestReport.loading ? (
                  ""
                ) : latestReport.data != null ? (
                  <Link
                    className="px-3 py-2 border border-slate-200 rounded-md hover:bg-slate-200 w-max text-sm font-semibold text-indigo-500 mt-4 block"
                    href={route("admin.report.open", latestReport.data.id)}
                  >
                    View full report
                  </Link>
                ) : (
                  ""
                )}
              </div>
            </div>
          </Row>
          <Row className="gy-3 gx-3">
            {fetchingCampus ? (
              <>
                <Col lg={6} md={6} xs={6}>
                  {/* submission bins */}
                  <DashboardCard
                    label="Unit Heads"
                    subLabel="..."
                    value="..."
                    variant="success"
                    icon={<i className="fi fi-rr-user fs-5"></i>}
                  />
                </Col>
                <Col lg={6} md={6} xs={6}>
                  {/* submission bins */}
                  <DashboardCard
                    label="Unit Heads"
                    subLabel="..."
                    value="..."
                    variant="success"
                    icon={<i className="fi fi-rr-user fs-5"></i>}
                  />
                </Col>
                <Col lg={6} md={6} xs={6}>
                  {/* submission bins */}
                  <DashboardCard
                    label="Unit Heads"
                    subLabel="..."
                    value="..."
                    variant="success"
                    icon={<i className="fi fi-rr-user fs-5"></i>}
                  />
                </Col>
                <Col lg={6} md={6} xs={6}>
                  {/* submission bins */}
                  <DashboardCard
                    label="Unit Heads"
                    subLabel="..."
                    value="..."
                    variant="success"
                    icon={<i className="fi fi-rr-user fs-5"></i>}
                  />
                </Col>
              </>
            ) : (
              <>
                {campuses.map((campus, index) => (
                  <Col key={index} lg={6} md={6} xs={6}>
                    {/* submission bins */}
                    <DashboardCard
                      label="Unit Heads"
                      subLabel={campus.name}
                      value={campus.unit_heads?.length ?? 0}
                      variant="success"
                      key={index}
                      icon={<i className="fi fi-rr-user fs-5"></i>}
                    />
                  </Col>
                ))}
              </>
            )}
          </Row>
          <CalendarCard viewButton className="mt-8" />
        </Col>
        <Col lg={3}>
          <AnnouncementsCard link={route("admin.announcements")} />
          {/* <Card className='border-0 p-3 shadow-sm'>
                        <Card.Body>
                            <p className='fs-6 fw-bold text-sm text-black-50'>Announcements</p>
                            {
                                announcements.map((item, index) => (
                                    <div className="mb-3" key={index}>
                                        <p>{item.title}</p>
                                    </div>
                                ))
                            }
                        </Card.Body>
                    </Card> */}
        </Col>
      </Row>
    </div>
  );
};

export default SuperAdminDashboard;
