import PanelLayout from "@/Layouts/PanelLayout";
import { Link } from "@inertiajs/react";
import { set } from "date-fns";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ObjectiveArchives = ({ auth }) => {
  const [userObjectives, setUserObjectives] = useState([]);
  useEffect(() => {
    const getUserObjectives = async () => {
      await axios
        .get(route("objectives.user.archived", auth.user.id))
        .then((res) => {
          if (res.statusText === "OK") {
            console.log(res.data);
            setUserObjectives(res.data);
          }
        });
    };

    getUserObjectives();

    // change user objectives based on selected year and quarter
  }, []);

  // user name ( first name + last name ), campus, designation, objective title, objective status ( is_completed ), objective type
  const columns = [
    {
      name: "Objective Title",
      cell: (row) => <>{row.objective.title}</>,
    },
    {
      name: "Objective Status",
      cell: (row) => (
        <span>{row.is_completed == 1 ? "Completed" : "In-Progress"}</span>
      ),
    },
    // completed_at
    {
      name: "Completed At",
      cell: (row) => (
        <>
          {row.updated_at != row.created_at
            ? new Date(row.updated_at).toLocaleDateString("en-US")
            : "N/A"}
        </>
      ),
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        padding: "10px 20px",
        fontSize: "14px",
        background: "#f8fafc",
        fontWeight: 700,
        color: "#475569",
      },
    },
    cells: {
      style: {
        padding: "10px 20px",
        fontSize: "14px",
      },
    },
  };

  return (
    <PanelLayout headerTitle="Archived Objectives">
      <div className="content-wrapper">
        <div className="mt-4 z-10 border p-2 bg-white border-slate-200 rounded-md overflow-hidden">
          <h3 className="text-lg ml-2 mt-2 font-semibold">User Objectives</h3>
          <DataTable
            columns={columns}
            data={userObjectives}
            pagination
            customStyles={customStyles}
          />
        </div>
      </div>
    </PanelLayout>
  );
};

export default ObjectiveArchives;
