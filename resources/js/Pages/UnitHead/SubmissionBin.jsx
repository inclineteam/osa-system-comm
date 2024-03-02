import CommentsView from "@/Components/CommentsView";
import FileIcon from "@/Components/FileIcon";
import ModalComponent from "@/Components/ModalComponent";
import PanelLayout from "@/Layouts/PanelLayout";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import React, { useState } from "react";
import { Card, Col, Form, FormCheck, Row } from "react-bootstrap";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import "react-datepicker/dist/react-datepicker.css";
import Checkbox from "@/Components/Checkbox";
import { SubmissionBinEntryForm } from "../Admin/SubmissionBinEntryForm";
import dayjs from "dayjs";

const SubmissionBin = ({ submissionBin, auth, report }) => {
  const [showFileModal, setShowFileModal] = useState(false);
  const [viewFile, setViewFile] = useState(null);

  const showFile = (file) => {
    setViewFile(file);
    setShowFileModal(true);
  };

  const getStatusColor = () => {
    if (report.status.toLowerCase() == "approved") {
      return "success";
    } else if (report.status.toLowerCase() === "rejected") {
      return "danger fw-bold";
    } else {
      return "secondary";
    }
  };

  console.log(report);

  return (
    <PanelLayout
      defaultActiveLink="reports"
      headerTitle={"Accomplishment Report"}
    >
      <ModalComponent
        className={"rounded-0 bg-transparent"}
        show={showFileModal}
        handleClose={() => {
          setShowFileModal((s) => !s);
          setViewFile(null);
        }}
        closeButton
        title={submissionBin.title}
        size="xl"
      >
        {viewFile && (
          <DocViewer
            pluginRenderers={DocViewerRenderers}
            documents={[{ uri: viewFile.uri }]}
            config={{
              zoom: 1,
            }}
          />
          // <>
          // <iframe className='w-100 h-[90vh]' src={viewFile.uri}/>
          // </>
        )}
      </ModalComponent>
      <div className="content-wrapper">
        <Card className="rounded-3 border-0 shadow-sm ">
          <Card.Body className="p-0">
            <div className="flex space-y-4 flex-col p-4 pb-2">
              <div>
                <p className="text-2xl font-semibold m-0 tracking-tight">
                  {submissionBin.title}
                </p>
                <p className="m-0 text-slate-600">
                  {auth.user.campus.name} campus,{" "}
                  {submissionBin.deadline_date ? (
                    <>
                      Due on{" "}
                      {format(
                        new Date(submissionBin.deadline_date),
                        "MMM d, Y"
                      )}
                    </>
                  ) : (
                    "No deadline"
                  )}
                </p>
              </div>

              {report ? (
                <div>
                  <span className="mr-4 items-center gap-2 w-max flex px-2.5 py-1 border border-slate-300 rounded-md">
                    <i class="fi text-slate-800 fi-ss-check-circle"></i>
                    <p className="text-slate-800 text-sm font-medium m-0">
                      {report.remarks}
                    </p>
                  </span>
                </div>
              ) : null}
            </div>
            <div className="p-4 py-2">
              <div className="font-semibold mb-2">Instruction:</div>

              {submissionBin.instruction ? (
                <>
                  <p className="text-slate-600 my-1 whitespace-pre-wrap">
                    {submissionBin.instruction}
                  </p>
                </>
              ) : (
                <p className="text-slate-600 mb-1">No instruction.</p>
              )}
            </div>

            <hr className="border-t border-slate-400" />
            <div className="p-4 pt-0">
              <div className="font-semibold mb-2">
                Attached reference{" "}
                {submissionBin.attachments.length > 1 ? "files" : "file"}:
              </div>
              <div className="flex flex-wrap gap-2">
                {submissionBin.attachments.length ? (
                  submissionBin.attachments.map((attachment) => (
                    <a
                      title={`Download this file`}
                      target="_blank"
                      download={true}
                      href={attachment.uri}
                      className="border-[1px] space-x-2 w-max flex border-slate-200 p-2 pr-4 hover:bg-slate-100 rounded-md text-indigo-600 font-semibold text-sm"
                    >
                      <FileIcon file={attachment} size="xs" />
                      <span>{attachment.name}</span>
                    </a>
                  ))
                ) : (
                  <p className="mb-0 text-slate-500">No attached file.</p>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>
        {/* report comments */}
        <Row className="!mt-8">
          <Col className="space-y-8">
            {report ? (
              <Card className="rounded-3 border-0 bg-white shadow-sm p-4">
                <p className="tracking-tight text-2xl font-semibold m-0">
                  Submitted Reports
                </p>
                <p className="text-sm text-slate-500 mb-4 m-0">
                  Check your submitted reports
                </p>

                <div className="p-0 border border-slate-200 rounded-md overflow-hidden">
                  <table className="border-collapse w-full">
                    <thead>
                      <tr className="[&>th]:border-l [&>th:first-child]:border-0 [&>th]:text-slate-500 [&>th]:bg-slate-50 [&>th]:px-5 [&>th]:py-2.5 border-b [&>th]:text-sm [&>th]:font-medium">
                        <th>Title of Activities/ Program</th>
                        <th>Date/ Duration</th>
                        <th>Documentation (Pictures)</th>
                        <th>Participants</th>
                        <th>Location</th>
                        <th>Conducted/ Sponsored by:</th>
                        <th className="text-center">Budget/Remark</th>
                      </tr>
                    </thead>

                    <tbody>
                      {report.entries.map((entry, index) => (
                        <tr
                          key={index}
                          className="border-b [&>td]:border-l [&>td:first-child]:border-0 last:border-0 [&>td]:px-5 [&>td]:py-4 [&>td]:text-sm"
                        >
                          <td>{entry.title}</td>
                          <td>
                            {dayjs(entry.date).format("MMM. D, YYYY")} -{" "}
                            {entry.duration}
                          </td>
                          <td className="flex flex-wrap gap-2">
                            {JSON.parse(entry.documentation).map(
                              (image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt="sss"
                                  className="w-20 h-20 rounded-md object-cover"
                                />
                              )
                            )}
                          </td>
                          <td>{entry.participants}</td>
                          <td>{entry.location}</td>
                          <td>{entry.conducted_by}</td>
                          <td>
                            <div className="flex justify-center">
                              <input
                                type="checkbox"
                                checked={entry.budget === 1 ? true : false}
                                disabled
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : (
              <SubmissionBinEntryForm submissionBinId={submissionBin.id} />
            )}
            <Card className="rounded-3 border-0 bg-white shadow-sm">
              <Card.Body>
                <p className="my-1">Private Comments</p>
                <div className="mt-4">
                  <CommentsView
                    report={report}
                    unitHead={auth.user}
                    user={auth.user}
                    submissionBin={submissionBin}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </PanelLayout>
  );
};

export default SubmissionBin;
