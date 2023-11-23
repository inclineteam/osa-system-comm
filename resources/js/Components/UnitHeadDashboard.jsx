import { Link } from "@inertiajs/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

const UnitHeadDashboard = ({ auth }) => {
  const [latestReminder, setLatestReminder] = useState(null);
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);
  const [latestSubmissionBin, setLatestSubmissionBin] = useState(null);

  console.log(latestSubmissionBin);

  useEffect(() => {
    const fetchLatestReminder = () => {
      axios.get(route("reminder.latest")).then((res) => {
        if (res.statusText === "OK") {
          setLatestReminder(res.data.latestReminder);
        }
      });
    };

    const fetchLatestAnnouncement = () => {
      axios.get(route("announcements.latest")).then((res) => {
        if (res.statusText === "OK") {
          setLatestAnnouncement(res.data.latestAnnouncement);
        }
      });
    };

    const fetchLatestSubmissionBin = () => {
      axios.get(route("submission-bins.latest")).then((res) => {
        if (res.statusText === "OK") {
          setLatestSubmissionBin(res.data.latestSubmissionBin);
        }
      });
    };

    fetchLatestReminder();
    fetchLatestAnnouncement();
    fetchLatestSubmissionBin();
  }, []);

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
      </Col>
      <Col>
        <div className="bg-white rounded-lg mb-4 shadow-sm border-b border-slate-300 p-4">
          <div>
            <h1 className="text-xl font-bold mb-2 leading-none">
              Latest reminder
            </h1>
            <p className="leading-none mb-4 text-slate-500 text-sm">
              Posted by the super admin.
            </p>
          </div>
          {latestReminder ? (
            <div className="overflow-hidden px-4 p-3 rounded-md border-slate-200 border relative">
              <div className="absolute top-0 bottom-0 w-1 bg-yellow-500 left-0"></div>

              <p className="mb-0.5 font-bold">{latestReminder.title}</p>
              <p className="m-0">{latestReminder.content}</p>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-200 text-slate-500 text-sm py-6 text-center">
              There is no reminder posted.
            </div>
          )}
        </div>

        <div className="mb-4 bg-white shadow-sm border-b border-slate-300 rounded-lg p-4">
          <div>
            <h1 className="text-xl font-bold mb-2 leading-none">
              Latest announcement
            </h1>
            <p className="leading-none mb-4 text-slate-500 text-sm">
              Posted by the super admin.
            </p>
          </div>
          {latestAnnouncement ? (
            <div className="overflow-hidden p-3 px-4 rounded-md border-slate-200 border relative">
              <div className="absolute top-0 bottom-0 w-1 bg-blue-500 left-0"></div>
              <p className="mb-0.5 font-bold">{latestAnnouncement.title}</p>
              <p className="m-0">{latestAnnouncement.content}</p>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-200 text-slate-500 text-sm py-6 text-center">
              There is no announcement posted.
            </div>
          )}
        </div>

        <div className="bg-white shadow-sm border-b border-slate-300 rounded-lg p-4">
          <div>
            <h1 className="text-xl font-bold mb-2 leading-none">
              Latest submission bin
            </h1>
            <p className="leading-none mb-4 text-slate-500 text-sm">
              Posted by the super admin.
            </p>
          </div>
          {latestSubmissionBin ? (
            <>
              <div className="overflow-hidden p-3 px-4 rounded-md border-slate-200 border relative">
                <div className="absolute top-0 bottom-0 w-1 bg-green-500 left-0"></div>
                <p className="mb-0.5 font-bold">{latestSubmissionBin.title}</p>
                <p className="m-0 truncate max-w-[40ch]">
                  {latestSubmissionBin.instruction}
                </p>
              </div>
              <div className="flex justify-end">
                <Link
                  href={route("unit_head.submission_bin", {
                    id: latestSubmissionBin.id,
                  })}
                  className="text-slate-800 mt-3 hover:bg-slate-200 text-sm px-3 font-semibold py-2 rounded-md bg-slate-100"
                >
                  Open submission bin
                </Link>
              </div>
            </>
          ) : (
            <div className="border-2 border-dashed border-slate-200 text-slate-500 text-sm py-6 text-center">
              There is no submission bin posted.
            </div>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default UnitHeadDashboard;
