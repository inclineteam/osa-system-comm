import { statusColors } from "@/Components/SuperAdminDashboard";
import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";
import { Link } from "@inertiajs/react";
import dayjs from "dayjs";

export default function ForReviewReports({ reports }) {
  console.log(reports);
  return (
    <PanelLayout
      layout={LayoutType.ADMIN}
      pageTitle="Reports | For review"
      defaultActiveLink="for review"
    >
      <div className="content-wrapper">
        <div className="p-4 border-b border-slate-300 rounded-lg shadow-sm bg-white">
          <h1 className="text-xl font-bold mb-2 leading-none">
            For reviewal reports
          </h1>
          <p className="border-b border-slate-200 pb-4 leading-none mb-4 text-slate-500">
            Click on the campus to view all of its reports.
          </p>
          <div className="mt-4 border border-slate-200 rounded-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="[&>th]:text-slate-500 [&>th]:bg-slate-50 [&>th]:border-l [&>th:first-child]:border-0 [&>th]:px-5 [&>th]:py-2.5 border-b [&>th]:text-sm [&>th]:font-medium">
                  <th>Name</th>
                  <th>Date Submitted</th>
                  <th>Campus</th>
                  <th>Office</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-slate-200 last:border-0 [&>td]:text-sm [&>td]:border-l [&>td:first-child]:border-0 [&>td]:px-5 [&>td]:py-4"
                  >
                    <td>
                      {report.unit_head.firstname} {report.unit_head.lastname}
                    </td>
                    <td>{dayjs(report.created_at).format("MMM. D, YYYY")}</td>
                    <td>{report.unit_head.campus.name}</td>
                    <td>{report.unit_head.designation.name}</td>
                    <td>
                      <div
                        className={`inline-block mr-2 w-2 h-2 rounded-full ${
                          statusColors[report.status]
                        }`}
                      ></div>
                      {report.status}
                    </td>
                    <td>
                      <Link href={route("admin.report.open", report.id)}>
                        View Reports
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PanelLayout>
  );
}
