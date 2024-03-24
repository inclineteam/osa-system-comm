import { RequirementsEntryForm } from "@/Components/RequirementsEntryForm";
import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";
import { Link, useForm } from "@inertiajs/react";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";

function CreateObjective({ auth, classifications }) {
  const [classificationIndex, setClassificationIndex] = useState(0);
  const { data, setData, processing, post } = useForm({
    title: "",
    submission_bin_id: null,
    objective_type: "",
  });

  const [submissionBins, setSubmissionBins] = useState([]);

  // get all submission bins
  // const fetchSubmissionBins = () => {
  //   submission-bins.open

  const fetchSubmissionBins = () => {
    axios
      .get(route("submission-bins.not-closed"))
      .then((res) => {
        console.log("test", res.data);
        setSubmissionBins(res.data);
      })
      .catch((error) => console.log("error getting submission bins ", error));
  };

  useEffect(() => {
    fetchSubmissionBins();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("objectives.store"));
  };

  return (
    <PanelLayout
      userAuth={auth}
      layout={LayoutType.SUPER_ADMIN}
      headerTitle="Create Announcement"
    >
      <div className="py-3">
        <div className="container-fluid">
          <Card className="border-0 shadow-sm p-2 p-lg-3">
            <Card.Body>
              <p className="text-2xl tracking-tight font-semibold">
                New Target
              </p>
              <Form onSubmit={(e) => handleSubmit(e)}>
                <div className="mb-3">
                  <Form.Label className="text-secondary">Title:</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={data.title}
                    onChange={(e) => setData("title", e.target.value)}
                    placeholder="Enter title here..."
                  />
                </div>

                {/* objective type radio button here 2 types : 0 - self checkout, 1 - submission */}
                <div className="mb-3">
                  <Form.Label className="text-secondary">
                    Objective Type:
                  </Form.Label>
                  <div className="d-flex gap-3">
                    <Form.Check
                      type="radio"
                      label="Self Checkout"
                      name="objective_type"
                      value="0"
                      onChange={(e) =>
                        setData("objective_type", e.target.value)
                      }
                    />
                    <Form.Check
                      type="radio"
                      label="Submission"
                      name="objective_type"
                      value="1"
                      onChange={(e) =>
                        setData("objective_type", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* if it is submissipe */}
                {data.objective_type == 1 && (
                  <div className="mb-3">
                    <Form.Label className="text-secondary">
                      Submission Bin:
                    </Form.Label>
                    <Form.Select
                      required
                      value={data.submission_bin_id}
                      onChange={(e) =>
                        setData("submission_bin_id", e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Select Submission Bin
                      </option>
                      {/* loop through submission bins */}
                      {submissionBins.map((bin) => (
                        <option key={bin.id} value={bin.id}>
                          {bin.title}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                )}

                <div className="mb-3">
                  <Form.Label className="text-secondary">
                    Designation:
                  </Form.Label>
                  <Form.Select
                    value={classificationIndex}
                    onChange={(e) => setClassificationIndex(e.target.value)}
                  >
                    {classifications &&
                      classifications.map((c, index) => (
                        <optgroup key={index} label={c.name}>
                          {c.designations.map((desig, i) => (
                            <option value={i} key={i}>
                              {desig.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                  </Form.Select>
                </div>

                <RequirementsEntryForm />

                <div className="text-end mt-3 flex items-center justify-end gap-3">
                  <Link
                    className="link link-secondary text-sm text-decoration-none"
                    href={route("admin.announcements")}
                  >
                    <i className="fi fi-rr-arrow-back"></i> Cancel
                  </Link>
                  <Button className="rounded-1 btn-primary " type="submit">
                    <div className="flex justify-center items-center gap-1">
                      <span className="text-sm">Submit</span>
                      <i className="bx bx-right-arrow-alt leading-none"></i>
                    </div>
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </PanelLayout>
  );
}

export default CreateObjective;
