import FileIcon from "@/Components/FileIcon";
import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";
import { Link, router } from "@inertiajs/react";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Accordion, Card } from "react-bootstrap";
import { toast } from "react-toastify";

export default function ForReviewReports({ auth, reportsForReview }) {
  const campuses = Object.keys(reportsForReview);

  const approveReport = async (id) => {
    const res = await axios.patch(
      route("report.action.approve", {
        report_id: id,
      })
    );
    if (res.data.message) {
      router.reload();
      toast.success(res.data.message);
    }
    return;
  };

  const rejectReport = async (id) => {
    const res = await axios.patch(
      route("report.action.reject", {
        report_id: id,
      })
    );

    if (res.data.message) {
      router.reload();
      toast.success(res.data.message);
    }
    return;
  };

  return (
    <PanelLayout
      layout={LayoutType.ADMIN}
      pageTitle="Reports | For review"
      defaultActiveLink="for_review"
    >
      <div className="content-wrapper">
        <div className="p-4 border-b border-slate-300 rounded-lg shadow-sm bg-white">
          <h1 className="text-xl font-bold mb-2 leading-none">For review</h1>
          <p className="leading-none mb-4 text-slate-500 text-sm">
            See all the reports that needs to be reviewed.
          </p>

          <div>
            {campuses.map((campus, i) => (
              <div key={i} className="mt-4 first:!mt-0">
                <div className="uppercase pb-2 border-b mb-4 border-zinc-200">
                  <p className="font-bold mb-0">{campus} Campus</p>
                </div>
                {Object.keys(reportsForReview[campus].offices).map(
                  (office, i) => (
                    <div key={i} className="ml-2 mt-4 first:!mt-0">
                      <p className="font-medium">{office} Office</p>
                      <Accordion defaultActiveKey="0" className="flex flex-col">
                        {reportsForReview[campus].offices[office].map(
                          (report, i) => (
                            <Accordion.Item eventKey={i} key={report.id}>
                              <Accordion.Header className="!border-0">
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
                              </Accordion.Header>

                              <Accordion.Body className="!pt-10 lg:!pl-16">
                                <div>
                                  <h1 className="text-xl text-slate-800 font-bold mb-2 leading-none">
                                    Details
                                  </h1>

                                  <p className="leading-none text-slate-500 text-sm">
                                    Check the details regarding{" "}
                                    {report.unit_head.firstname}'s report.
                                  </p>

                                  <div className="mt-3 mb-4 flex-wrap flex gap-4">
                                    <div className="p-4 border-[1px] w-max flex items-center justify-center flex-col border-slate-200 rounded-md">
                                      <i className="text-slate-500 fi fi-rr-calendar-clock text-3xl"></i>
                                      <p className="mt-2 mb-0 font-semibold uppercase">
                                        {dayjs(report.created_at).format(
                                          "MMM D, h:mm A"
                                        )}
                                      </p>
                                      <p className="text-sm font-normal mb-0 text-slate-500">
                                        Submission Date
                                      </p>
                                    </div>

                                    <div className="p-4 border-[1px] w-max flex items-center justify-center flex-col border-slate-200 rounded-md">
                                      <i className="text-slate-500 fi fi-rr-cabin text-3xl"></i>
                                      <p className="mt-2 mb-0 font-semibold uppercase">
                                        {report.unit_head.campus.name}
                                      </p>
                                      <p className="text-sm font-normal mb-0 text-slate-500">
                                        Campus
                                      </p>
                                    </div>

                                    <div className="p-4 border-[1px] w-max flex items-center justify-center flex-col border-slate-200 rounded-md">
                                      <i className="text-slate-500 fi-rr-city text-3xl"></i>
                                      <p className="mt-2 mb-0 font-semibold uppercase">
                                        {report.unit_head.designation.name}
                                      </p>
                                      <p className="text-sm font-normal mb-0 text-slate-500">
                                        Office
                                      </p>
                                    </div>
                                  </div>

                                  <p className="mb-0 text-slate-500">
                                    Attachments:
                                  </p>
                                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {report.attachments.map((attachment, i) => (
                                      <div className="mx-auto p-2 bg-slate-100 mt-2 w-full rounded-md">
                                        <FileIcon
                                          file={attachment}
                                          className={"mx-auto"}
                                          size="md"
                                        />
                                        <p className="mx-auto text-sm truncate max-w-[30ch]">
                                          {attachment.name}
                                        </p>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="flex items-center justify-between mt-6 space-x-2">
                                    <div></div>
                                    <div className="space-x-2">
                                      <button
                                        onClick={() => rejectReport(report.id)}
                                        className="transition bg-rose-600 text-white px-3 py-2 text-sm font-medium shadow hover:bg-rose-400 rounded-md"
                                      >
                                        Reject
                                      </button>
                                      <button
                                        onClick={() => approveReport(report.id)}
                                        className="transition bg-indigo-600 text-white px-3 py-2 text-sm font-medium shadow hover:bg-indigo-400 rounded-md"
                                      >
                                        Approve
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </Accordion.Body>
                            </Accordion.Item>
                          )
                        )}
                      </Accordion>
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PanelLayout>
  );
}
