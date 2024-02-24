import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";
import { Link } from "@inertiajs/react";

export default function UnitHeadReportsChecklist({ offices }) {
  const officesArr = Object.keys(offices);

  const statusColors = {
    Approved: "text-emerald-600",
    Rejected: "text-rose-600",
    Pending: "text-amber-600",
  };
  return (
    <PanelLayout defaultActiveLink="reports checklist">
      <div className="content-wrapper">
        <div className="p-4 border-b border-slate-300 rounded-lg shadow-sm bg-white">
          <h1 className="text-xl font-bold mb-2 leading-none">
            Reports checklist
          </h1>
          <p className="border-b border-slate-200 pb-4 leading-none mb-4 text-slate-500">
            See all the reports within all campuses.
          </p>

          {/* admin.report.open */}
          {officesArr.length ? (
            officesArr.map((officeItem, i) => (
              <div key={i} className="mt-4">
                <div className="pt-2 flex border-zinc-200">
                  <i className="text-slate-500 fi-rr-city text-xl mr-2"></i>
                  <p className="font-bold mb-0">{officeItem} Office</p>
                </div>
                <div className="mt-4 border border-slate-200 rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="[&>th]:text-slate-500 [&>th]:bg-slate-50 [&>th]:border-l [&>th:first-child]:border-0 [&>th]:px-4 [&>th]:py-2 border-b [&>th]:text-sm [&>th]:font-bold">
                        <th>Unit Head</th>
                        <th>Office</th>
                        <th>Campus</th>
                        <th>Submitted Reports</th>
                      </tr>
                    </thead>

                    <tbody>
                      {offices[officeItem].map((report, i) => (
                        <tr
                          key={i}
                          className="border-b border-slate-200 last:border-0 [&>td]:text-sm [&>td]:border-l [&>td:first-child]:border-0 [&>td]:px-4 [&>td]:py-2.5"
                        >
                          <td>
                            {report.unit_head.firstname}{" "}
                            {report.unit_head.lastname}
                          </td>
                          <td>{report.unit_head.designation.name}</td>
                          <td>{report.unit_head.campus.name}</td>
                          <td>{report.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          ) : (
            <div className="text-slate-500 border-2 rounded-md border-dashed border-slate-200 py-8 text-center">
              There are currently no reports submitted for this campus.
            </div>
          )}
        </div>
      </div>
    </PanelLayout>
  );
}
