import { useState, useEffect } from "react";
import axios from "axios";
import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";
import { Card } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

export default function AnnualReport({ auth }) {
  const [selectedYear, setSelectedYear] = useState("");
  const [reports, setReports] = useState({ data: [], loading: true });

  useEffect(() => {
    axios
      .get(route("admin.annual_reports.index"))
      .then((response) => {
        const responseData = response.data || {};
        setReports({ data: responseData.reports || [], loading: false });
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
        setReports({ data: [], loading: false });
      });
  }, []);

  const handleYearChange = (date) => {
    setSelectedYear(date);
  };

  const handleSubmission = () => {
    // check if selectedYear is empty
    if (!selectedYear) {
      toast.error("Please select a year.");
      return;
    }

    axios
      .post(route("admin.annual_reports.create"), {
        data: {
          year: selectedYear.getFullYear(),
          user: auth.user.id,
        },
      })
      .then((data) => {
        // reloadpage
        toast.success("Report successfully generated.");
        window.location.reload();
      })
      .catch((error) => console.error("Error submitting report:", error));
  };

  return (
    <PanelLayout
      layout={LayoutType.SUPER_ADMIN}
      defaultActiveLink="generated_reports_annually"
    >
      <div className="content-wrapper">
        <div className="bg-white p-6">
          <button
            onClick={() => handleSubmission()}
            className="transition bg-indigo-600 mb-3 text-white px-3 py-2 text-sm font-medium shadow hover:bg-indigo-400 rounded-md"
          >
            General annual report
          </button>
          <div className="flex bg-white flex-col">
            <div>
              <p className="font-bold">Select Year</p>
            </div>
            <DatePicker
              selected={selectedYear}
              onChange={handleYearChange}
              dateFormat="yyyy"
              showYearPicker
              scrollableYearDropdown
              yearDropdownItemNumber={10}
            />
          </div>

          <table className="mt-4 w-full">
            <thead className="">
              <tr className="[&>th]:text-slate-500 [&>th]:bg-slate-50 [&>th]:border-l [&>th:first-child]:border-0 [&>th]:px-4 [&>th]:py-2 border-b [&>th]:text-sm [&>th]:font-bold">
                <th>Report Year</th>
                <th>Generated By</th>
                <th>Generated At</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {reports.loading ? (
                <tr className="text-center">
                  <td colSpan="4" className="p-3">
                    Loading...
                  </td>
                </tr>
              ) : reports.data.length === 0 ? (
                <tr className="text-center">
                  <td colSpan="4" className="p-3">
                    No reports available.
                  </td>
                </tr>
              ) : (
                reports.data.map((report) => (
                  <tr
                    key={report.id}
                    className="[&>td]:text-sm [&>td]:border-l [&>td:first-child]:border-0 [&>td]:px-4 [&>td]:py-2.5"
                  >
                    <td>
                      {new Date(report.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      {report.generated_by.firstname}{" "}
                      {report.generated_by.lastname}
                    </td>
                    <td>{report.generated_at}</td>
                    <td className="flex items-center">
                      <a
                        href={route("admin.annual_reports.specific", report.id)}
                        className="transition bg-indigo-600 text-white px-3 py-2 text-sm font-medium shadow hover:bg-indigo-400 rounded-md"
                      >
                        Show
                      </a>
                      <a
                        onClick={() => {
                          setReports({
                            data: reports.data.filter(
                              (data) => data.id !== report.id
                            ),
                            loading: true,
                          });

                          axios
                            .delete(
                              route("admin.annual_reports.delete", report.id)
                            )
                            .then(() => {
                              toast.success("Report successfully deleted.");
                              setReports({
                                data: reports.data.filter(
                                  (data) => data.id !== report.id
                                ),
                                loading: false,
                              });
                            });
                        }}
                        className="transition bg-red-600 text-white px-3 py-2 text-sm font-medium shadow hover:bg-red-400 rounded-md ml-2"
                      >
                        Delete
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PanelLayout>
  );
}
