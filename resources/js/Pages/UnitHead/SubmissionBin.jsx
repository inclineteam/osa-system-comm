import AddFileButton from "@/Components/AddFileButton";
import CardComponent from "@/Components/CardComponent";
import CommentsView from "@/Components/CommentsView";
import FileIcon from "@/Components/FileIcon";
import { formatDate } from "@/Components/Helper";
import ModalComponent from "@/Components/ModalComponent";
import PanelLayout from "@/Layouts/PanelLayout";
import { Link } from "@inertiajs/react";
import axios from "axios";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Placeholder, Row } from "react-bootstrap";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import ReactTimeAgo from "react-time-ago";

const SubmissionBin = ({ submissionBin, auth, report }) => {
  const [showFileModal, setShowFileModal] = useState(false);
  const [viewFile, setViewFile] = useState(null);
  const [isFetchingComments, setIsFetchingComments] = useState(true);
  const [comments, setComments] = useState([]);

  console.log("submissionBin: ", submissionBin);

  const [files, setFiles] = useState(
    report?.attachments.map((a, i) => ({ ...a, uploaded: true })) || []
  );

  const showFile = (file) => {
    setViewFile(file);
    setShowFileModal(true);
  };

  const submitReports = () => {};

  const getStatusColor = () => {
    if (report.status.toLowerCase() == "approved") {
      return "success";
    } else if (report.status.toLowerCase() === "rejected") {
      return "danger fw-bold";
    } else {
      return "secondary";
    }
  };

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
        <p className="fs-6 text-primary">{auth.user?.campus?.name} Campus</p>
        <hr />
        <Card className="rounded-3 border-0 shadow-sm ">
          <Card.Body className="p-4">
            <p className="flex items-center font-medium text-lg my-0">
              <i className="fi fi-rr-box me-2"></i>
              {submissionBin.title}
            </p>
            <div className="text-secondary">
              {submissionBin.deadline_date ? (
                <p className="text-sm mt-2 mb-0 text-rose-600 font-medium">
                  Due{" "}
                  {format(new Date(submissionBin.deadline_date), "MMM d, Y")}
                </p>
              ) : (
                <p className="my-1">No deadline.</p>
              )}
            </div>
            <hr />

            <div className="font-semibold mb-2">Instruction:</div>

            {submissionBin.instruction ? (
              <>
                <p className="text-slate-600 my-1">
                  {submissionBin.instruction}
                </p>
              </>
            ) : (
              <p className="text-slate-600 my-1">No instruction.</p>
            )}

            <hr />
            <div className="font-semibold mb-2">Attached reference/s:</div>
            <div className="flex flex-wrap gap-2">
              {submissionBin.attachments.map((attachment) => (
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
              ))}
            </div>
          </Card.Body>
        </Card>
        {/* report comments */}
        <Row className="mt-3 gy-2">
          <Col className="">
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
          <Col lg={4} className="">
            <Card className="rounded-3 border-0 shadow-sm border-bottom  border-primary">
              <Card.Body>
                <p className="my-1 text-primary">Your Report</p>
                {report?.is_submitted ? (
                  <>
                    <p className="text-start text-sm text-black-50 ">
                      {report.remarks} (
                      {formatDate(new Date(report.date_submitted))})
                    </p>
                    <p
                      className={`my-0 text-sm  text-end fw-bold text-${getStatusColor()}`}
                    >
                      <span className="me-1">{report.status}</span>
                    </p>
                  </>
                ) : (
                  files.length <= 0 &&
                  (submissionBin.deadline_date &&
                  new Date(submissionBin.deadline_date) < new Date() ? (
                    <p className="my-0 text-sm fw-bold uppercas text-end text-dang">
                      Missing
                    </p>
                  ) : (
                    <div className="mt-4 border-2 border-dashed border-slate-200 text-slate-500 text-center py-4 px-3">
                      <p className="my-0 text-sm">No submission yet.</p>
                    </div>
                  ))
                )}

                <div className="">
                  <div className="p-2 max-h-[245px] overflow-auto">
                    <AddFileButton
                      removable={!report?.is_submitted}
                      disableAddingFile={report?.is_submitted}
                      accept="application/pdf"
                      handleViewFile={showFile}
                      submissionBinId={submissionBin.id}
                      userId={auth.user.id}
                      files={files}
                      setFiles={setFiles}
                    />
                  </div>
                  {files &&
                    files.length > 0 &&
                    (!report?.is_submitted ||
                    (report?.status && report?.status === "Rejected") ? (
                      <Link
                        as="button"
                        type="button"
                        method="patch"
                        href={route("reports.submit", { id: submissionBin.id })}
                        className="transition bg-indigo-600 text-white px-3 py-2 text-sm font-medium shadow hover:bg-indigo-400 rounded-md w-full"
                      >
                        {!report?.status
                          ? "Submit Report"
                          : report?.status === "Rejected"
                          ? "Resubmit Report"
                          : "Submit Report"}
                        {/* {!report.status || report.status === "Rejected"
                          ? "Resubmit Report"
                          : "Submit Report"} */}
                      </Link>
                    ) : (
                      <Link
                        disabled={
                          report.status != "Pending" &&
                          report.status != "Rejected"
                        }
                        as="button"
                        type="button"
                        method="patch"
                        href={route("reports.unsubmit", {
                          id: submissionBin.id,
                        })}
                        className="w-full transition bg-rose-600 text-white px-3 py-2 text-sm font-medium shadow hover:bg-rose-400 rounded-md"
                      >
                        Unsubmit
                      </Link>
                    ))}
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
