import { useState } from "react";
import { Form } from "react-bootstrap";

export const RequirementsEntryForm = () => {
  const [requirements, setRequirements] = useState([]);
  const [requirement, setRequirement] = useState("");

  return (
    <div className="mt-10">
      <h1 className="text-lg font-bold mb-4 leading-none">Requirements</h1>

      <ul className="p-0 divide-y overflow-hidden border border-slate-200 rounded-md leading-none">
        {requirements.length ? (
          requirements.map((requirement) => (
            <li
              key={requirement.id}
              className="hover:bg-slate-100 flex items-center relative justify-between py-2 pr-2 pl-4"
            >
              <div className="flex items-center space-x-2">
                <span className="block w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                <p className="mb-0">{requirement.requirement}</p>
              </div>

              <button
                onClick={() => {
                  const newArr = requirements.filter(
                    (req) => req.id !== requirement.id
                  );
                  setRequirements([...newArr]);
                }}
                className="bg-white border-[1px] border-rose-600 hover:!bg-rose-600 hover:text-white transition rounded text-rose-600 p-2"
              >
                <i className="fi fi-rr-trash"></i>
              </button>
            </li>
          ))
        ) : (
          <li className="text-center py-10 text-slate-500">
            No requirement yet.
          </li>
        )}
      </ul>

      <div className="flex items-center">
        <div className="flex-1">
          <Form.Control
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            placeholder="Enter requirement"
            required
          />
        </div>

        <button
          type="button"
          onClick={() => {
            if (!requirement) {
              return;
            } else {
              setRequirements((prevEntries) => [
                ...prevEntries,
                {
                  id: crypto.randomUUID(),
                  requirement,
                },
              ]);

              setRequirement("");
            }
          }}
          className="ml-4 bg-slate-100 my-2 px-3 w-max rounded-md font-medium text-slate-600 py-2 hover:bg-slate-200 outline outline-2 active:bg-slate-300 outline-transparent flex space-x-2 items-center focus:outline-indigo-600"
        >
          <i className="bx bx-plus"></i>
          <span>Add Requirement</span>
        </button>
      </div>
    </div>
  );
};
