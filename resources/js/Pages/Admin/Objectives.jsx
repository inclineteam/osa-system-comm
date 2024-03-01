import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Button, Card } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";

function CreateObjectives() {
  const [objectives, setObjectives] = useState([]);

  // fetch all objectives
  const fetchObjectives = () => {
    axios
      .get(route("objectives.all"))
      .then((res) => {
        console.log("test", res.data);
        setObjectives(res.data);
      })
      .catch((error) => console.log("error getting objectives ", error));
  };

  const columns = [
    {
      name: "Objective",
      cell: (row) => <span>{row.title}</span>,
    },
    {
      name: "Objective Type",
      // if 0 -> self check, if 1 -> submission use ternary operator it must check if the objective_type is 0 or 1 because there is also a possibility of 2 -> system event
      cell: (row) => (
        <span>{row.objective_type === 0 ? "Self Check" : "Submission"}</span>
      ),
    },
    {
      name: "Submission Bin",
      cell: (row) => <span>{row.submission_bin_id}</span>,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <a
            href={`/admin/objectives/${row.id}/edit`}
            className="transition bg-yellow-600 text-white px-3 py-2 text-sm font-medium shadow hover:bg-indigo-400 rounded-md"
          >
            Edit
          </a>
          <button
            onClick={() => {
              // delete objective
              setObjectives(objectives.filter((data) => data.id !== row.id));
              axios
                .delete(route("admin.objectives.delete", row.id))
                .then(() => {
                  toast.success("Objective successfully deleted.");
                  setObjectives(
                    objectives.filter((data) => data.id !== row.id)
                  );
                });
            }}
            className="transition bg-red-600 text-white px-3 py-2 text-sm font-medium shadow hover:bg-red-400 rounded-md ml-2"
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  const customStyles = {
    // rows: {
    //   style: {
    //     minHeight: "72px", // override the row height
    //   },
    // },
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

  useEffect(() => {
    fetchObjectives();
  }, []);

  return (
    <PanelLayout
      layout={LayoutType.SUPER_ADMIN}
      defaultActiveLink="generated reports annually"
    >
      <div className="content-wrapper">
        <div className="bg-white p-6">
          <div className="flex bg-white flex-col">
            <h1 className="text-xl font-bold mb-2 leading-none">
              Create Objective
            </h1>
            <p className=" leading-none text-slate-500">
              Generate a objective for users to complete.
            </p>

            <button
              // onClick={() => handleSubmission()}
              onClick={() =>
                (window.location.href = route("admin.objectives.create"))
              }
              className=" w-max transition bg-indigo-600 mb-3 text-white px-3 py-2 text-sm font-medium shadow hover:bg-indigo-400 rounded-md flex"
            >
              <i class="fi fi-rs-add-document text-base mr-2"></i>
              <span>Create Objective</span>
            </button>
          </div>

          <hr className="my-8 border-slate-400" />

          <h1 className="mt-4 text-xl font-bold mb-2 leading-none">
            All objectives
          </h1>
          <p className="border-b border-slate-200 pb-4 leading-none mb-4 text-slate-500">
            Check out all the created Objectives
          </p>

          <div className="mt-4  rounded-md overflow-hidden">
            <DataTable
              columns={columns}
              pagination
              data={objectives}
              customStyles={customStyles}
            />
          </div>
        </div>
      </div>
    </PanelLayout>
  );
}

export default CreateObjectives;
