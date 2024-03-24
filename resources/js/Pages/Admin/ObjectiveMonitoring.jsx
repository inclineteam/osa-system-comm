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

const ObjectiveMonitoring = () => {
  // get all user objectives
  const [userObjectives, setUserObjectives] = useState([]);
  // year date selector
  const [selectedYear, setSelectedYear] = useState(null);

  const handleYearChange = (date) => {
    setSelectedYear(date);
  };

  // quarter
  const [selectedQuarter, setSelectedQuarter] = useState(null);

  const handleQuarterChange = (e) => {
    setSelectedQuarter(e.target.value);
  };

  useEffect(() => {
    const getUserObjectives = async () => {
      await axios
        .get(
          route("objectives.user.get", {
            year: selectedYear?.getFullYear(),
            quarter: selectedQuarter?.toString(),
          })
        )
        .then((res) => {
          if (res.statusText === "OK") {
            console.log(res.data);
            setUserObjectives(res.data);
          }
        });
    };

    getUserObjectives();

    // change user objectives based on selected year and quarter
  }, [selectedQuarter, selectedYear]);

  // user name ( first name + last name ), campus, designation, objective title, objective status ( is_completed ), objective type
  const columns = [
    {
      name: "User Name",
      cell: (row) => (
        <span>
          {row.user.firstname} {row.user.lastname}
        </span>
      ),
    },
    {
      name: "Activities / Programme",
      cell: (row) => (
        <span>
          {row.entries.length === 0
            ? row.objective.title
            : row.entries.map((entry, index) => {
                console.log(entry);
                // Return the JSX for each entry here
                return (
                  <div key={index}>
                    {/* Example: Display entry description */}
                    <p>
                      {index + 1}.) {entry.objective_entry.description}
                    </p>
                  </div>
                );
              })}
        </span>
      ),
    },
    {
      name: "Targets",
      cell: (row) => (
        <span>
          {row.entries.length === 0
            ? row.is_completed
              ? "Completed"
              : "In Progress"
            : row.entries.map((entry, index) => {
                console.log(row.is_completed);
                // Return the JSX for each entry here
                return (
                  <div key={index}>
                    {/* Example: Display entry description */}
                    <p>
                      {index + 1}.) {entry.objective_entry.description} -{" "}
                      {entry.status === 1 ? "Completed" : "In Progress"}
                    </p>
                  </div>
                );
              })}
        </span>
      ),
    },
    {
      name: "Campus",
      cell: (row) => <>{row.user.campus.name}</>,
    },
    {
      name: "Designation",
      cell: (row) => <>{row.user.designation.name}</>,
    },
    // {
    //   name: "Objective Title",
    //   cell: (row) => <>{row.objective.title}</>,
    // },
    {
      name: "Objective Status",
      cell: (row) => (
        <span>
          {
            // check if entries is empty
            row.entries.length === 0
              ? row.is_completed
                ? "Completed"
                : "In Progress"
              : // check if all entries are completed
              row.entries.every((entry) => entry.status == 1)
              ? "Completed"
              : "In Progress"
          }
        </span>
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
    // action : approve, reject
    {
      name: "Action",
      cell: (row) => (
        <div className="flex flex-col">
          <Link className="btn btn-primary mb-1">Approve</Link>
          <Link className="btn btn-danger mb-1">Reject</Link>
        </div>
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
    <PanelLayout headerTitle="Objective Monitoring">
      <div className="content-wrapper">
        {/* y ear date selector */}

        <div className="flex">
          <div className="mx-2">
            <div>
              <p className="font-bold mb-0">Select Year</p>
            </div>
            <DatePicker
              selected={selectedYear}
              onChange={handleYearChange}
              dateFormat="yyyy"
              showYearPicker
              scrollableYearDropdown
              yearDropdownItemNumber={10}
              customInput={
                <input className="border-slate-300 rounded-md hover:border-slate-400  " />
              }
            />
          </div>

          {/* quarter dropdown option ( 1st quarter - jan-march, 2nd quarter - Apr-Jun, 3rd quarter - Jul-Sept, 4th - Oct-Dec) */}
          <div className="z-50 mx-2">
            <div>
              <p className="font-bold mb-0">Select Quarter</p>
            </div>
            <select
              className="border-slate-300 rounded-md hover:border-slate-400"
              name="quarter"
              id="quarter"
              value={selectedQuarter}
              onChange={handleQuarterChange}
            >
              <option>Select Quarter</option>
              <option value="1">1st Quarter</option>
              <option value="2">2nd Quarter</option>
              <option value="3">3rd Quarter</option>
              <option value="4">4th Quarter</option>
            </select>
          </div>
        </div>

        <div className="mt-4 z-10 border p-2 bg-white border-slate-200 rounded-md overflow-hidden">
          <h3 className="text-lg ml-2 mt-2 font-semibold">Objectives</h3>
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

export default ObjectiveMonitoring;
