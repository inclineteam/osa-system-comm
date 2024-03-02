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
                <p className="text-slate-600 my-1 whitespace-pre-wrap">
                  {submissionBin.instruction}
                </p>
              </>
            ) : (
              <p className="text-slate-600 my-1">No instruction.</p>
            )}

            <hr />
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
                <p className="mb-0">No attached file.</p>
              )}
            </div>
          </Card.Body>
        </Card>
        {/* report comments */}
        <Row className="!mt-8">
          <Col className="space-y-8">
            <SubmissionBinEntryForm submissionBinId={submissionBin.id} />
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
