import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";
import { useRef } from "react";
import { Accordion } from "react-bootstrap";
import ReactToPrint, { useReactToPrint } from "react-to-print";

export default function AnnualReport({ report }) {
  console.log(report.data);
  const ref = useRef();
  const print = useReactToPrint({
    content: () => ref.current,
  });

  return (
    <PanelLayout
      layout={LayoutType.SUPER_ADMIN}
      defaultActiveLink="generated_reports_annually"
    >
      <div className="content-wrapper">
        <div className=" bg-white p-6">
          <div className="flex items-center justify-end">
            <button
              onClick={print}
              className="mb-4 bg-indigo-600 space-x-1 flex text-white px-3 py-2 text-sm font-medium shadow hover:bg-indigo-400 rounded-md"
            >
              <i class="fi fi-rr-print"></i>{" "}
              <span className="tracking-wide">Print</span>
            </button>
          </div>
          <div className="" ref={ref}>
            {Object.entries(report.data).map(([location, data], i) => (
              <div
                className="rounded-md overflow-hidden border mb-4 border-slate-200"
                key={location}
                // className="mb-10"
              >
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                  <div>
                    <h4 className="text-lg font-semibold">{location}</h4>
                    <p className="mb-0">
                      Total overall reports from all offices in all quarters -{" "}
                      {data.total}
                    </p>
                  </div>
                </div>
                {/* check length of data.quarters */}
                <div className="px-4 pb-4">
                  {Object.entries(data.quarters).length ? (
                    Object.entries(data.quarters).map(
                      ([quarter, quarterData]) => (
                        <div key={quarter}>
                          {/* check quarter initials if st, nd or th */}
                          <p className="mb-2 mt-4 font-bold">
                            {quarter == 1
                              ? "1st"
                              : quarter == 2
                              ? "2nd"
                              : quarter == 3
                              ? "3rd"
                              : quarter + "th"}{" "}
                            Quarter
                          </p>
                          <p className="mt-0">
                            Total Reports this quarter - {quarterData.total}
                          </p>
                          {/* quarterData.offices */}
                          <div className="border border-slate-200 rounded-md overflow-hidden">
                            <table className="w-full">
                              <thead>
                                <tr className="[&>th]:text-slate-500 [&>th]:bg-slate-50 [&>th]:border-l [&>th:first-child]:border-0 [&>th]:px-4 [&>th]:py-2 border-b [&>th]:text-sm [&>th]:font-bold">
                                  <th>Office</th>
                                  <th>Number of Reports</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.entries(quarterData.offices).map(
                                  ([office, officeData]) => (
                                    <tr
                                      key={office}
                                      className="[&>td]:text-sm [&>td]:border-l [&>td:first-child]:border-0 [&>td]:px-4 [&>td]:py-2.5"
                                    >
                                      <td>{office}</td>
                                      <td>{officeData}</td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <div className="py-8 text-center text-slate-500">
                      No report
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PanelLayout>
  );
}
