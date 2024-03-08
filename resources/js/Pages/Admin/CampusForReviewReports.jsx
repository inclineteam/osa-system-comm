import FileIcon from "@/Components/FileIcon";
import HeaderTitle from "@/Components/HeaderTitle";
import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";
import { Link, router } from "@inertiajs/react";
import axios from "axios";
import dayjs from "dayjs";
import { Accordion } from "react-bootstrap";
import { toast } from "sonner";

export default function CampusForReviewReports({ offices, campus }) {
  const officesArr = Object.keys(offices);

  return (
    <PanelLayout
      layout={LayoutType.ADMIN}
      defaultActiveLink="for review"
      pageTitle="Reports | For review"
      headerTitle={
        <HeaderTitle
          text={"Review reports for " + campus}
          backButton
          backButtonLink={route("admin.reports.for-review")}
        />
      }
    >
      <div className="content-wrapper">
        <div className="p-4 border-b border-slate-300 rounded-lg shadow-sm bg-white">
          <h1 className="text-2xl font-semibold tracking-tight mb-2 leading-none">
            For review reports for {campus}
          </h1>
          <p className="border-b border-slate-200 pb-4 leading-none mb-4 text-slate-500">
            See all the reports that needs to be reviewed.
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
                      <tr className="[&>th]:text-slate-500 [&>th]:bg-slate-50 [&>th]:border-l [&>th:first-child]:border-0 [&>th]:px-5 [&>th]:py-2.5 border-b [&>th]:text-sm [&>th]:font-medium">
                        <th>Name</th>
                        <th>Date Submitted</th>
                        <th>Campus</th>
                        <th>Office</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {offices[officeItem].map((report) => (
                        <tr
                          key={report.id}
                          className="border-b border-slate-200 last:border-0 [&>td]:text-sm [&>td]:border-l [&>td:first-child]:border-0 [&>td]:px-5 [&>td]:py-4"
                        >
                          <td>
                            {report.unit_head.firstname}{" "}
                            {report.unit_head.lastname}
                          </td>
                          <td>
                            {dayjs(report.created_at).format("MMM. D, YYYY")}
                          </td>
                          <td>{report.unit_head.campus.name}</td>
                          <td>{report.unit_head.designation.name}</td>
                          <td>
                            <Link
                              href={route("admin.report.open", report.id)}
                              className="hover:underline"
                            >
                              View Reports
                            </Link>
                          </td>
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
