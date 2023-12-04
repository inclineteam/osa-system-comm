import FileIcon from "@/Components/FileIcon";
import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";
import { Link, router } from "@inertiajs/react";
import axios from "axios";
import dayjs from "dayjs";
import { Accordion } from "react-bootstrap";
import { toast } from "react-toastify";

export default function CampusForReviewReports({ offices, campus }) {
  const officesArr = Object.keys(offices);

  return (
    <PanelLayout
      layout={LayoutType.ADMIN}
      pageTitle="Reports | For review"
      defaultActiveLink="for review"
    >
      <div className="content-wrapper">
        <div className="p-4 border-b border-slate-300 rounded-lg shadow-sm bg-white">
          <h1 className="text-xl font-bold mb-2 leading-none">
            For review reports for {campus}
          </h1>
          <p className="border-b border-slate-200 pb-4 leading-none mb-4 text-slate-500">
            See all the reports that needs to be reviewed.
          </p>
          {/* admin.report.open */}
          {officesArr.length ? (
            officesArr.map((officeItem, i) => (
              <div key={i} className="mt-4">
                <div className="pb-2 pt-2 flex border-zinc-200">
                  <i className="text-slate-500 fi-rr-city text-xl mr-2"></i>
                  <p className="font-bold mb-0">{officeItem} Office</p>
                </div>
                {offices[officeItem].map((report, i) => (
                  <Link
                    href={route("admin.report.open", [report.id])}
                    className="!border-0"
                  >
                    <div>
                      <div className="space-x-1">
                        <div>
                          <div className="flex space-x-3 items-start">
                            <img
                              src={report.unit_head.image}
                              alt="Avatar"
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <p className="mt-1 w-max mb-0 font-semibold">
                                {report.unit_head.firstname}{" "}
                                {report.unit_head.lastname}
                              </p>
                              <p className="mt-1 mb-2 font-normal text-sm text-slate-500">
                                Submitted his report on{" "}
                                <span class="font-semibold">
                                  "{report.submission_bin.title}"
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* <p className="flex-1 mb-0">{userEvent.description}</p> */}
                      </div>
                    </div>
                  </Link>
                ))}
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
