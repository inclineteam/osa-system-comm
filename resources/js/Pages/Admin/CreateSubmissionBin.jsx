import AddFileButton from "@/Components/AddFileButton.SubmissionBin";
import CardComponent from "@/Components/CardComponent";
import PanelLayout from "@/Layouts/PanelLayout";
import { MultipartHeader } from "@/constants/constants";
import { Link, router, useForm } from "@inertiajs/react";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";

const CreateSubmissionBin = ({ auth }) => {
  const { post, processing, data, setData } = useForm({
    title: "",
    instruction: "",
    deadline_date: "",
    deadline_time: "",
  });

  const [showFileModal, setShowFileModal] = useState(false);
  const [viewFile, setViewFile] = useState(null);

  const [files, setFiles] = useState([]);

  const showFile = (file) => {
    setViewFile(file);
    setShowFileModal(true);
  };

  const uploadFile = async () => {
    axios
      .post(route("submission_bins.create"), data, {
        headers: MultipartHeader,
      })
      .then((res) => {
        files.forEach((file) => {
          var formData = new FormData();
          formData.append("bin_id", res.data.bin.id);
          formData.append("file", file);
          axios.post(route("submission_bins.attach-files"), formData, {
            headers: MultipartHeader,
          });
        });

        router.visit(route("admin.submission_bins"));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <PanelLayout
      defaultActiveLink="submission-bins"
      headerTitle="Submission Bins"
    >
      <div className="content-wrapper">
        <CardComponent>
          <Card.Body>
            <div>
              <div className="flex mb-4 gap-2 flex-wrap justify-content-between">
                <p className="flex items-center gap-2 my-1 me-auto fw-bolder">
                  <i className="fi fi-rr-box"></i>
                  <span>New Submission Bin</span>
                </p>
              </div>
              <div className="mb-3">
                <Form.Label>Title:</Form.Label>
                <Form.Control
                  value={data.title}
                  onChange={(e) => setData("title", e.target.value)}
                  type="text"
                />
              </div>
              <div className="mb-3">
                <Form.Label>Instruction:</Form.Label>
                <textarea
                  className="form-control"
                  rows={8}
                  value={data.instruction}
                  onChange={(e) => setData("instruction", e.target.value)}
                />
              </div>
              <hr />
              <div className="mb-3">
                <p className="fw-bold mb-2">Deadline of submission</p>
                <div className="row">
                  <div className="col-md">
                    <Form.Label>Date:</Form.Label>
                    <Form.Control
                      type="date"
                      value={data.deadline_date}
                      onChange={(e) => setData("deadline_date", e.target.value)}
                    />
                  </div>
                  <div className="col-md">
                    <Form.Label>Time:</Form.Label>
                    <Form.Control
                      type="time"
                      value={data.deadline_time}
                      onChange={(e) => setData("deadline_time", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <hr />
              <div className="mb-3">
                <p className="fw-bold mb-2">Attach reference files:</p>

                <AddFileButton
                  accept="application/pdf"
                  handleViewFile={showFile}
                  userId={auth.user.id}
                  files={files}
                  setFiles={setFiles}
                  shouldUpload={false}
                  removable={true}
                />
              </div>
              <br />
              <div className="flex gap-2 justify-end">
                <Link
                  disabled={processing}
                  href={route("admin.submission_bins")}
                  className="btn btn-light"
                >
                  Cancel
                </Link>
                <Button
                  onClick={uploadFile}
                  disabled={processing}
                  variant="primary"
                  size="md"
                  type="submit"
                >
                  Submit <i className=" bx bx-right-arrow-alt"></i>
                </Button>
              </div>
            </div>
          </Card.Body>
        </CardComponent>
      </div>
    </PanelLayout>
  );
};

export default CreateSubmissionBin;
