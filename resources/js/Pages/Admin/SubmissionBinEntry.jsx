import { useState } from "react";
import { Card, Form, FormCheck } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { SubmissionBinEntryImageInput } from "./SubmissionBinEntryImageInput";

export const SubmissionBinEntry = ({
  deleteDataInEntries,
  addDataInEntries,
  id,
  entryCount,
}) => {
  const [data, setData] = useState({
    title: "",
    date: new Date(),
    documentation: [],
    duration: "",
    participants: "",
    location: "",
    conducted_by: "",
    budget: false,
  });
  const [hide, setHide] = useState(false);

  const handleYearChange = (date) => {
    setData((prevData) => ({ ...prevData, date }));
  };

  const handleChange = (e) => {
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    addDataInEntries(data, id);
    setHide(true);
  };

  return (
    <div>
      <div className="border p-4 rounded-md space-y-4">
        <header className="font-semibold text-base mb-4">
          Entry {entryCount}{" "}
          {hide && `- ${data.title ? data.title : "Untitled"}`}
        </header>
        {!hide ? (
          <div className="space-y-4">
            <div>
              <Form.Label className="text-secondary">
                <span className="text-sm text-danger me-1">*</span>
                Title of Activities/Program
              </Form.Label>
              <Form.Control
                type="text"
                required
                name="title"
                id="title"
                value={data.title}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-4">
              <div class="flex-1">
                <Form.Label className="text-secondary">
                  <span className="text-sm text-danger me-1">*</span>
                  Date
                </Form.Label>
                <div className="block w-full">
                  <DatePicker
                    dateFormat={"yy/mm/dd"}
                    selected={data.date}
                    onChange={handleYearChange}
                    scrollableYearDropdown
                    yearDropdownItemNumber={10}
                    customInput={<Form.Control className="block w-full" />}
                  />
                </div>
              </div>

              <div class="flex-1">
                <Form.Label className="text-secondary">
                  <span className="text-sm text-danger me-1">*</span>
                  Duration
                </Form.Label>
                <Form.Control
                  type="text"
                  required
                  name="duration"
                  id="duration"
                  value={data.duration}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Form.Label className="text-secondary">
                <span className="text-sm text-danger me-1">*</span>
                Documentation (Pictures)
              </Form.Label>
              <SubmissionBinEntryImageInput data={data} setData={setData} />
              <div className="flex flex-wrap gap-4 mt-4">
                {data.documentation.length
                  ? data.documentation.map((previewImage, i) => (
                      <div key={i} className="relative">
                        <button
                          onClick={() => {
                            let files = data.documentation.filter(
                              (file) => file.name !== previewImage.name
                            );

                            setData((prevData) => ({
                              ...prevData,
                              documentation: files,
                            }));
                          }}
                          className="absolute text-xl bg-black/40 text-white backdrop-blur leading-none hover:bg-black/70 w-6 h-6 flex items-center justify-center top-2 right-2 rounded-full"
                        >
                          &times;
                        </button>
                        <img
                          src={URL.createObjectURL(previewImage)}
                          alt="Preview"
                          className="rounded-xl w-40 h-40 object-cover"
                        />
                      </div>
                    ))
                  : null}
              </div>
            </div>

            <div>
              <Form.Label className="text-secondary">
                <span className="text-sm text-danger me-1">*</span>
                Participants
              </Form.Label>
              <Form.Control
                type="text"
                required
                name="participants"
                id="participants"
                value={data.participants}
                onChange={handleChange}
              />
            </div>

            <div>
              <Form.Label className="text-secondary">
                <span className="text-sm text-danger me-1">*</span>
                Location
              </Form.Label>
              <Form.Control
                type="text"
                required
                name="location"
                id="location"
                value={data.location}
                onChange={handleChange}
              />
            </div>

            <div>
              <Form.Label className="text-secondary">
                <span className="text-sm text-danger me-1">*</span>
                Conducted/ Sponsored by:
              </Form.Label>
              <Form.Control
                type="text"
                required
                name="conducted_by"
                id="conducted_by"
                value={data.conducted_by}
                onChange={handleChange}
              />
            </div>

            <div className="gap-2  flex items-center">
              <FormCheck
                value={data.budget}
                onChange={(e) =>
                  setData((prevData) => ({
                    ...prevData,
                    budget: e.target.checked,
                  }))
                }
              />
              <Form.Label className="text-secondary m-0">
                Budget/Remark
              </Form.Label>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setHide(true)}
                className="transition bg-slate-100 text-slate-600 px-3 py-2 text-sm font-medium hover:bg-slate-200 active:bg-slate-300 rounded-md w-max"
              >
                Hide
              </button>

              <div className="space-x-2">
                <button
                  onClick={() => deleteDataInEntries(id)}
                  className="transition bg-rose-100 text-rose-600 px-3 py-2 text-sm font-medium hover:bg-rose-200 active:bg-rose-300 rounded-md w-max"
                >
                  Remove
                </button>
                <button
                  onClick={handleSave}
                  className="transition bg-indigo-600 text-white px-3 py-2 text-sm font-medium shadow hover:bg-indigo-400 rounded-md w-max"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setHide(false)}
              className="transition bg-slate-100 text-slate-600 px-3 py-2 text-sm font-medium hover:bg-slate-200 active:bg-slate-300 rounded-md w-max"
            >
              Show
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
