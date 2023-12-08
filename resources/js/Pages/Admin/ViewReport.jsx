import CommentsView from "@/Components/CommentsView";
import FileIcon from "@/Components/FileIcon";
import HeaderTitle from "@/Components/HeaderTitle";
import { formatDate } from "@/Components/Helper";
import ModalComponent from "@/Components/ModalComponent";
import TextProfilePic from "@/Components/TextProfilePic";
import PanelLayout from "@/Layouts/PanelLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Image,
  ListGroup,
  ListGroupItem,
  Row,
} from "react-bootstrap";
import DocViewer, { DocViewerRenderers, PDFRenderer } from "react-doc-viewer";

const ViewReport = ({ report }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { auth } = usePage().props;
  const [showFileModal, setShowFileModal] = useState(false);
  // const [status, setStatus] = useState(report.status)

  const { data, setData, patch } = useForm({
    status: report.status,
  });

  const approveReport = async (id) => {
    const res = await axios.patch(
      route("report.action.approve", {
        report_id: id,
        user_id: auth.user.id,
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
        user_id: auth.user.id,
      })
    );

    if (res.data.message) {
      router.reload();
      toast.success(res.data.message);
    }
    return;
  };

  console.log(report);

  useEffect(() => {
    setSelectedFile(report.attachments[0]);
  }, []);

  return (
    <PanelLayout
      headerTitle={
        <HeaderTitle
          text={report.submission_bin.title}
          backButton
          backButtonLink={
            auth.role === "admin"
              ? route("admin.reports.for-review.campus", [
                  report.unit_head.campus.name,
                ])
              : route("admin.reports.checklist")
          }
        />
      }
      defaultActiveLink="submission-bins"
    >
      <ModalComponent
        className={"rounded-0 bg-transparent"}
        bodyClassname="p-0 overflow-hidden"
        show={showFileModal}
        handleClose={() => {
          setShowFileModal((s) => !s);
        }}
        closeButton
        title={selectedFile?.name}
        size="fullscreen"
      >
        <hr className="my-1" />
        {selectedFile && (
          <DocViewer
            style={{ maxHeight: "100% !important", height: "100%" }}
            pluginRenderers={DocViewerRenderers}
            documents={[{ uri: selectedFile.uri }]}
            config={{
              zoom: 0.5,
              header: {
                disableHeader: true,
              },
            }}
            theme={{
              primary: "#5296d8",
              secondary: "#ffffff",
              tertiary: "#5296d899",
              text_primary: "#ffffff",
              text_secondary: "#5296d8",
              text_tertiary: "#00000099",
              disableThemeScrollbar: false,
            }}
          />
        )}
      </ModalComponent>
      <Head
        title={
          report.unit_head.firstname +
          " " +
          report.unit_head.lastname +
          " | " +
          report.submission_bin.title
        }
      />
      <div className="content-wrapper">
        <Row className="bg-transparent gy-2 gx-2">
          <Col>
            <Card className="border-0 shadow-sm rounded-xl p-2 mb-4">
              <Card.Body className="border-0 h-100">
                <div className="flex justify-between items-end">
                  <p className="font-bold mb-0">Submitted By</p>
                  <div className="flex">
                    {auth.role === "admin" && report.status === "Pending" && (
                      <>
                        <button
                          onClick={() => approveReport(report.id)}
                          className="mr-2 transition bg-indigo-600 text-white px-3 py-2 text-sm font-medium shadow hover:bg-indigo-400 rounded-md"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectReport(report.id)}
                          className="transition bg-rose-600 text-white px-3 py-2 text-sm font-medium shadow hover:bg-rose-400 rounded-md"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {auth.role === "super_admin" ||
                      (auth.role === "admin" && (
                        <div className="text-end">
                          {report.status === "Approved" ? (
                            <>
                              <p className={`text-success fw-bold my-0`}>
                                <i className="bx bxs-check-circle me-2"></i>
                                {report.status}
                              </p>
                              <p
                                className={`text-sm my-0 ${
                                  report.remarks.toLowerCase() ==
                                  "submitted on time"
                                    ? "text-success"
                                    : "text-danger"
                                }`}
                              >
                                <small>{report.remarks}</small>
                              </p>
                            </>
                          ) : (
                            <p className={`text-rose-600 fw-bold my-0`}>
                              {report.status}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
                <div className="mt-3 flex gap-x-4 w-100">
                  <div>
                    {report.unit_head.image ? (
                      <Image
                        src={report.unit_head.image}
                        width={50}
                        height={50}
                        roundedCircle
                      />
                    ) : (
                      <TextProfilePic
                        className="text-light"
                        size="sm"
                        text={report.unit_head.firstname[0]}
                      />
                    )}
                  </div>
                  <div className="w-100 ">
                    <p className="my-0 fw-bold">
                      {report.unit_head.firstname +
                        " " +
                        report.unit_head.lastname}
                    </p>
                    <p className="leading-none my-0 text-slate-500">
                      <small>Unit Head</small>
                    </p>
                    {/* <hr className='my-1' /> */}
                    {/* <p className=' mt-2 mb-0 text-sm text-dark'>
                                            {report.unit_head.campus.name} Campus
                                        </p> */}

                    <div className="mt-3 flex gap-3">
                      <div className="w-max transition rounded-md text-slate-800 text-center flex flex-col items-center justify-center px-6 py-3 border-[1px] border-slate-200">
                        <i class="fi fi-rr-cabin text-2xl mb-3 text-slate-500"></i>
                        <span className="font-bold uppercase">
                          {report.unit_head.campus.name}
                        </span>
                        <span className="text-sm text-slate-500">Campus</span>
                      </div>

                      <div className="w-max transition rounded-md text-slate-800 text-center flex flex-col items-center justify-center px-6 py-3 border-[1px] border-slate-200">
                        <i className="text-slate-500 fi fi-rr-city text-2xl mb-3"></i>
                        <span className="font-bold uppercase">
                          {report.unit_head.designation.name}
                        </span>
                        <span className="text-sm text-slate-500">
                          Designation
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
            <Card className="border-0 shadow-sm rounded-xl p-2 mb-2">
              <Card.Body className="h-100">
                <p className="text-sm text-danger fw-bold mb-1">Attachments</p>
                {report.is_submitted ? (
                  <>
                    {auth.role === "super_admin" ? (
                      report.status === "Approved" ? (
                        <p className="text-sm text-secondary my-0 fw-bold">
                          <span>
                            Submitted on{" "}
                            {formatDate(new Date(report.date_submitted))}
                          </span>
                        </p>
                      ) : null
                    ) : (
                      <p className="text-sm text-secondary my-0 fw-bold">
                        <span>
                          Submitted on{" "}
                          {formatDate(new Date(report.date_submitted))}
                        </span>
                      </p>
                    )}
                  </>
                ) : null}
                <hr />
                <div className="">
                  {auth.role === "admin" ? (
                    <div className="row g-3">
                      {report.attachments.length == 0 && (
                        <p>No submission yet.</p>
                      )}
                      {report.attachments.map((att, index) => (
                        // <ListGroupItem key={index} className={` cursor-pointer ${att.id === selectedFile.id ? 'bg-light-primary rounded-1' : ''}`} onClick={() => setSelectedFile(att)}>
                        //     {att.name}
                        // </ListGroupItem>
                        <Col key={index} xl={2} lg={3} sm={4} xs={6}>
                          <div
                            onClick={() => {
                              setSelectedFile(att);
                              setShowFileModal(true);
                            }}
                            className={`text-center rounded p-3 cursor-pointer ${
                              selectedFile?.id === att.id ? "bg-slate-100" : ""
                            }`}
                            title={att.name}
                          >
                            <FileIcon
                              file={att}
                              className={"mx-auto"}
                              size="sm"
                            />
                            <p className="text-center mt-3 mb-0 col-11 text-sm text-truncate">
                              <small>{att.name}</small>
                            </p>
                          </div>
                        </Col>
                      ))}
                    </div>
                  ) : (
                    <>
                      {report.status === "Approved" ? (
                        <div className="row g-3">
                          {report.attachments.length == 0 && (
                            <p>No submission yet.</p>
                          )}
                          {report.attachments.map((att, index) => (
                            // <ListGroupItem key={index} className={` cursor-pointer ${att.id === selectedFile.id ? 'bg-light-primary rounded-1' : ''}`} onClick={() => setSelectedFile(att)}>
                            //     {att.name}
                            // </ListGroupItem>
                            <Col key={index} xl={2} lg={3} sm={4} xs={6}>
                              <div
                                onClick={() => {
                                  setSelectedFile(att);
                                  setShowFileModal(true);
                                }}
                                className={`text-center rounded p-3 cursor-pointer ${
                                  selectedFile?.id === att.id
                                    ? "bg-slate-100"
                                    : ""
                                }`}
                                title={att.name}
                              >
                                <FileIcon
                                  file={att}
                                  className={"mx-auto"}
                                  size="sm"
                                />
                                <p className="text-center mt-3 mb-0 col-11 text-sm text-truncate">
                                  <small>{att.name}</small>
                                </p>
                              </div>
                            </Col>
                          ))}
                        </div>
                      ) : (
                        <p>No submission yet.</p>
                      )}
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={3} md={4} className=" ">
            <Card className="border-0 shadow-sm  rounded-0">
              <Card.Body className="p-4 ">
                <p className="fw-bold text-slate-800 mb-0">Private Comments</p>
                <hr className="my-3 border-slate-400" />
                <CommentsView
                  report={report}
                  user={auth.user}
                  submissionBin={report.submission_bin}
                  unitHead={report.unit_head}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </PanelLayout>
  );
};

export default ViewReport;
