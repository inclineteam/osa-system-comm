import PanelLayout from "@/Layouts/PanelLayout";
import { Link, router } from "@inertiajs/react";
import { set } from "date-fns";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ObjectiveMonitoring = ({ classifications }) => {
  console.log(classifications);
  const [classificationIndex, setClassificationIndex] = useState(null);
  // get all user objectives
  const [userObjectives, setUserObjectives] = useState([]);
  // year date selector
  const [selectedYear, setSelectedYear] = useState(null);

  const handleYearChange = (date) => {
    setSelectedYear(date);
  };

  // get all campus
  const [campuses, setCampuses] = useState([]);

  // quarter
  const [selectedQuarter, setSelectedQuarter] = useState(null);

  const [selectedCampus, setSelectedCampus] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleQuarterChange = (e) => {
    setSelectedQuarter(e.target.value);
  };

  useEffect(() => {
    const getUserObjectives = async () => {
      await axios
        .get(
          route("objectives.user.get", {
            year: selectedYear ? selectedYear.getFullYear() : null,
            quarter: selectedQuarter,
            classificationIndex: classificationIndex,
            campus: selectedCampus,
            status: selectedStatus,
          })
        )
        .then((res) => {
          if (res.status === 200) {
            setUserObjectives(res.data);
          }
        });
    };

    getUserObjectives();
  }, [
    selectedYear,
    selectedQuarter,
    classificationIndex,
    selectedCampus,
    selectedStatus,
  ]);

  useEffect(() => {
    const fetchCampuses = () => {
      axios.get(route("campus.index")).then((res) => {
        setCampuses(res.data.campuses);
      });
    };

    fetchCampuses();
  }, []);

  // user name ( first name + last name ), campus, designation, objective title, objective status ( is_completed ), objective type
  const columns = [
    {
      name: "Activities / Programme",
      cell: (row) => <span>{row.objective.title}</span>,
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
      name: "Actual Accomplished",
      cell: (row) => (
        <>
          {row.entries.map((entry, index) => {
            // Parse the info_data to get the dynamic key and value
            const data = JSON.parse(entry.info_data);
            // Iterate over each key-value pair in the parsed data
            return (
              <div
                className="border-solid border-2 rounded-xl w-[20rem] leading-[0.6rem] border-black p-2"
                key={index}
              >
                {Object.entries(data).map(([key, value]) => (
                  <p className="text-center text-[0.7rem]" key={key}>
                    {/* Display the dynamic key and its value */}
                    <span className="font-bold"> {`${key} `}</span>
                    <span>{value}</span>
                  </p>
                ))}
              </div>
            );
          })}
        </>
      ),
    },
    {
      name: "Documentation",
      cell: (row) => (
        <>
          {row.entries.map((entry, index) => {
            if (entry.file_path) {
              return (
                <div key={index}>
                  <a
                    onClick={() => {
                      axios
                        .get(
                          route(
                            "objectives.documentation.download",
                            entry.file_path
                          ),
                          {
                            responseType: "blob",
                          }
                        )
                        .then((response) => {
                          const url = window.URL.createObjectURL(
                            new Blob([response.data])
                          );
                          const link = document.createElement("a");
                          link.href = url;
                          link.setAttribute("download", `${entry.file_path}`);
                          document.body.appendChild(link);
                          link.click();
                          link.parentNode.removeChild(link);
                        })
                        .catch((error) => {
                          console.log("failed to download file", error);
                        });
                    }}
                    download
                    className="border-solid border-2 rounded-xl w-[20rem] leading-[0.6rem] border-black p-2"
                  >
                    Download
                  </a>
                </div>
              );
            }
          })}
        </>
      ),
    },
    {
      name: "Designation",
      cell: (row) => <>{row.user.designation.name}</>,
    },
    // {
    //   name: "Objective Title",
    //   cell: (row) => <>{row.objective.title}</>,
    // },

    // objective status
    {
      name: "Status",
      cell: (row) => (
        //  1 - on time, 0 - ongoing, 2 - pass due
        <span>
          {row.status == 1
            ? "On Time"
            : row.status == 2
            ? "Pass Due"
            : "On Going"}
        </span>
      ),
    },
    {
      // due date
      name: "Due Date",
      cell: (row) => (
        <>{new Date(row.objective.due_date).toLocaleDateString("en-US")}</>
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
        // check if admin_status is 1 or 2
        <div className="flex flex-col">
          {row.admin_status == 0 ? (
            <div className="flex flex-col">
              {/*  */}
              {row.is_completed && (
                // for reviewal, approve
                <div>
                  <button
                    variant="success"
                    className="bg-green-500 text-white px-2 py-1 rounded-md"
                    onClick={() => {
                      // approve objective
                      axios
                        .put(route("objectives.approve"), {
                          id: row.id,
                        })
                        .then((res) => {
                          if (res.statusText === "OK") {
                            setUserObjectives(
                              userObjectives.map((objective) => {
                                if (objective.id === row.id) {
                                  return {
                                    ...objective,
                                    admin_status: 1,
                                  };
                                }
                                return objective;
                              })
                            );
                          }
                        });
                    }}
                  >
                    Approve
                  </button>
                  {/* for reviewal */}
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded-md mt-2"
                    onClick={() => {
                      // reject objective
                      axios
                        .put(route("objectives.reject"), {
                          id: row.id,
                        })
                        .then((res) => {
                          if (res.statusText === "OK") {
                            // dynamically update the user objectives
                            setUserObjectives(
                              userObjectives.map((objective) => {
                                if (objective.id === row.id) {
                                  return {
                                    ...objective,
                                    admin_status: 2,
                                  };
                                }
                                return objective;
                              })
                            );
                          }
                        });
                    }}
                  >
                    For Review
                  </button>
                </div>
              )}
            </div>
          ) : row.admin_status == 1 ? (
            // display approved
            <span className="text-green-500">Approved</span>
          ) : (
            // display rejected
            <span className="text-red-500">For Reviewal</span>
          )}

          {/* * check if there are entries, if there is show a button to check the entries
          {row.entries.length > 0 && (
            <button
              onClick={() =>
                router.visit(`/admin/objectives/${row.id}/entries`)
              }
              className="bg-blue-500 py-1 px-2 rounded-md text-white mt-2"
            >
              View Entries
            </button>
          )} */}
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
    <PanelLayout headerTitle="Targets Reviewal">
      <div className="content-wrapper">
        {/* y ear date selector */}

        <div className="flex-col lg:flex-row flex lg:items-end">
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

          {/* select campus */}
          <div className="z-50 mx-2">
            <div>
              <p className="font-bold mb-0">Select Campus</p>
            </div>
            <select
              className="border-slate-300 rounded-md hover:border-slate-400"
              name="campus"
              onChange={(e) => setSelectedCampus(e.target.value)}
              id="campus"
            >
              <option>Select Campus</option>
              {campuses.map((campus) => (
                <option key={campus.id} value={campus.id}>
                  {campus.name}
                </option>
              ))}
            </select>
          </div>

          {/* dropdown : In-progress, For reviewal, Completed */}
          <div className="z-50 mx-2">
            <div>
              <p className="font-bold mb-0">Select Status</p>
            </div>
            <select
              className="border-slate-300 rounded-md hover:border-slate-400"
              name="status"
              id="status"
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="0">In Progress</option>
              <option value="2">For Reviewal</option>
            </select>
          </div>

          <div className="z-50 mx-2">
            <div>
              <p className="font-bold mb-0">Select Classification</p>
            </div>
            <select
              required
              className="border-slate-300 w-[90%] rounded-md hover:border-slate-400"
              defaultValue={""}
              onChange={(e) => setClassificationIndex(parseInt(e.target.value))}
            >
              <option value={""} disabled>
                All Offices
              </option>
              {classifications &&
                classifications.map((c, index) => (
                  <optgroup key={index + 1} label={c.name}>
                    {c.designations.map((desig, i) => (
                      <option value={desig.id} key={desig.id}>
                        {desig.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
            </select>
          </div>

          <div className="ml-auto">
            <Link
              className="bg-white px-3 py-2 border border-slate-200 rounded-md hover:bg-slate-200 w-max text-sm font-semibold text-indigo-500 block"
              // href={route("admin.report.open", latestTarget.data.id)}
              href={route("admin.reports.archive")}
            >
              View archives
            </Link>
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
