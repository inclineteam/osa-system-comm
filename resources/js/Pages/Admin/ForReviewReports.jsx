import FileIcon from "@/Components/FileIcon";
import PanelLayout from "@/Layouts/PanelLayout";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Accordion, Card } from "react-bootstrap";

export default function ForReviewReports({ auth, reportsForReview }) {
  const campuses = Object.keys(reportsForReview);

  return (
    <PanelLayout userAuth={auth} pageTitle="Reports | For review">
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
                  <p className="font-bold mb-0">{campus}</p>
                </div>
                {Object.keys(reportsForReview[campus].offices).map(
                  (office, i) => (
                    <div key={i} className="ml-2 mt-4 first:!mt-0">
                      <p className="font-medium">{office}</p>
                      <Accordion defaultActiveKey="0" className="flex flex-col">
                        {reportsForReview[campus].offices[office].map(
                          (report, i) => (
                            <Accordion.Item eventKey={i} key={report.id}>
                              <Accordion.Header>
                                <div>
                                  <div className="space-x-1">
                                    <div>
                                      <p className="w-max mb-0 font-semibold">
                                        {report.unit_head.firstname}{" "}
                                        {report.unit_head.lastname}
                                      </p>
                                      <p className="mb-0 text-sm text-slate-500">
                                        Submission bin "
                                        {report.submission_bin.title}"
                                      </p>
                                    </div>
                                    {/* <div className="mx-auto p-2 bg-slate-100 mt-2 w-full rounded-md">
                                  <FileIcon
                                    file={report.attachments[0]}
                                    className={"mx-auto"}
                                    size="md"
                                  />
                                  <p className="mx-auto text-sm truncate max-w-[30ch]">
                                    {report.attachments[0].name}
                                  </p>
                                </div> */}
                                    {/* <p className="flex-1 mb-0">{userEvent.description}</p> */}
                                  </div>
                                  <p className="mb-0 mt-2.5 text-sm text-slate-500">
                                    {dayjs(report.created_at).format(
                                      "MMM D, h:mm A"
                                    )}
                                  </p>
                                </div>
                              </Accordion.Header>

                              <Accordion.Body>Hey</Accordion.Body>
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
