import { useState } from "react";
import { Card, Form, FormCheck } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { SubmissionBinEntry } from "./SubmissionBinEntry";

export const SubmissionBinEntryForm = () => {
  const [entries, setEntries] = useState([
    {
      id: crypto.randomUUID(),
      title: "",
      date: new Date(),
      duration: "",
      participants: "",
      location: "",
      conducted_by: "",
      budget: false,
    },
  ]);
  const [entriesCount, setEntriesCount] = useState(1);

  const addDataInEntries = (data, id) => {
    setEntries(
      entries.map((entry) => {
        if (entry.id === id) {
          return { id, ...data };
        } else {
          return entry;
        }
      })
    );
  };

  const deleteDataInEntries = (id) => {
    let newArr = entries.filter((entry) => entry.id !== id);
    console.log(newArr);
    setEntries(newArr);
  };

  return (
    <Card className="space-y-4 rounded-3 border-0 bg-white shadow-sm p-4">
      <div className="font-semibold mb-2">Submit:</div>
      {entries.map((entry, i) => (
        <SubmissionBinEntry
          key={entry.id}
          deleteDataInEntries={deleteDataInEntries}
          addDataInEntries={addDataInEntries}
          id={entry.id}
          entryCount={i + 1}
        />
      ))}
      <button
        onClick={() => {
          setEntriesCount((entry) => entry + 1);
          setEntries((prevEntries) => [
            ...prevEntries,
            {
              id: crypto.randomUUID(),
              title: "",
              date: new Date(),
              duration: "",
              participants: "",
              location: "",
              conducted_by: "",
              budget: false,
            },
          ]);
        }}
        class="bg-slate-100 rounded-md font-medium text-slate-600 py-2 w-full hover:bg-slate-200 outline outline-2 active:bg-slate-300 outline-transparent focus:outline-indigo-600"
      >
        Add Entry
      </button>
      <div className="flex justify-end">
        <button className="transition bg-indigo-600 text-white px-6 py-2.5 text-sm font-medium shadow hover:bg-indigo-400 rounded-md w-max">
          SUBMIT
        </button>
      </div>
    </Card>
  );
};