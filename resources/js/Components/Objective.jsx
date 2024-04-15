import axios from "axios";
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { toast } from "sonner";

const Objective = ({ user }) => {
  const [objectives, setObjectives] = useState([]);
  const [inputData, setInputData] = useState({});

  useEffect(() => {
    const fetchObjectives = async () => {
      try {
        const res = await axios.get(route("objectives.user.all", user.id));
        setObjectives(res.data);
        seedInputData(res.data); // Seed the inputData state with required fields
      } catch (error) {
        console.error("Error fetching objectives:", error);
      }
    };

    fetchObjectives();
  }, [user.id, user.designation.id]);

  // Function to seed the inputData state with the required input fields for each entry
  const seedInputData = (objectives) => {
    const data = {};
    objectives.forEach((objective) => {
      objective.entries.forEach((entry) => {
        if (user.designation.id === 1) {
          data[entry.id] = {
            programActivity: "",
            satisfactionRating: "",
            guidanceServices: "",
          };
        } else if (user.designation.id === 2) {
          data[entry.id] = {
            attendance: "",
            printedMaterials: "",
            typeOfMaterials: "",
            satisfactionRating: "",
          };
        }
      });
    });
    setInputData(data);
  };

  const handleEntryStatusUpdate = (entryId, objectiveId) => {
    console.log("Updating entry status for entryId:", entryId); // Debug statement

    // Check if any required input for the current entry is empty
    if (!isInputComplete(entryId)) {
      console.log("Incomplete input for entryId:", entryId); // Debug statement
      toast.error(
        "Please fill in all the required input fields for this entry."
      );
      return; // Prevent status update
    }

    // Proceed with status update if all inputs are filled
    axios
      .put(route("objectives.user.update"), {
        id: entryId,
        status: true,
        info_data: inputData[entryId], // Pass only the data for the specific entry
      })
      .then((res) => {
        if (res.statusText === "OK") {
          console.log("res:", res);
          // Update the objectives state to reflect the status change
          setObjectives((prevObjectives) =>
            prevObjectives.map((obj) =>
              obj.id === objectiveId
                ? {
                    ...obj,
                    entries: obj.entries.map((ent) =>
                      ent.id === entryId ? { ...ent, status: true } : ent
                    ),
                  }
                : obj
            )
          );
        }
      })
      .catch((error) => console.error("Error updating entry status:", error));
  };

  const handleObjectiveSubmit = (objectiveId) => {
    console.log("Submitting objective for objectiveId:", objectiveId); // Debug statement
    axios
      .put(route("objectives.update"), {
        id: objectiveId,
        is_completed: true,
        admin_status: 0,
      })
      .then((res) => {
        if (res.statusText === "OK") {
          console.log("res:", res);
          toast.success("target submitted successfully.");
          // Update the objectives state to reflect the status change
          setObjectives((prevObjectives) =>
            prevObjectives.map((obj) =>
              obj.id === objectiveId
                ? { ...obj, is_completed: true, admin_status: 0 }
                : obj
            )
          );
        }
      })
      .catch((error) => console.error("Error submitting objective:", error));
  };

  const handleInputChange = (entryId, column, value) => {
    setInputData((prevInputData) => ({
      ...prevInputData,
      [entryId]: {
        ...prevInputData[entryId],
        [column]: value,
      },
    }));
  };

  const isInputComplete = (entryId) => {
    const data = inputData[entryId];
    if (!data) return false; // Entry data not found
    // Check if any input field in the entry data is empty
    return Object.values(data).every((value) => value.trim() !== "");
  };

  return (
    <div className="mb-4 bg-white shadow-sm border-b border-slate-300 rounded-lg p-4">
      <div>
        <h1 className="text-xl font-bold mb-2 leading-none">Targets</h1>
        <p className="leading-none mb-4 text-slate-500 text-sm">
          Please finish the following tasks.
        </p>
      </div>
      {objectives.length !== 0 && objectives ? (
        objectives.map((objective) =>
          !objective.is_completed || objective.admin_status == 2 ? (
            <Card key={objective.id} className="mb-1">
              <div className="absolute top-0 bottom-0 w-1 bg-blue-500 rounded-md left-0"></div>
              {objective.entries.length !== 0 ? (
                <div>
                  <div className="flex items-center stext-sm py-6">
                    <h1 className="text-center ml-2 mb-2 leading-none">
                      <span className="font-bold text-xl">
                        {objective.objective.title}
                      </span>
                      {/* <span>{objective.admin_status == 2 && ()</span> */}

                      {objective.admin_status == 2 && (
                        <span className="font-normal text-lg bg-red-500 text-white py-1 px-2 rounded-lg ml-2">
                          For Reviewal
                        </span>
                      )}
                    </h1>
                  </div>
                  {objective.entries.map((entry) => (
                    <Card
                      key={entry.id}
                      className="ml-5 flex flex-row mb-1 p-2 pt-3 w-[97%] h-[2rem] border-2 border-dashed border-slate-200 rounded-md"
                    >
                      {!entry.status && (
                        <div className="flex items-center h-[2rem] w-[1rem] mr-2">
                          <i
                            onClick={() =>
                              handleEntryStatusUpdate(entry.id, objective.id)
                            }
                            className="fi p-1 hover:bg-emerald-500 hover:cursor-pointer hover:text-white border-emerald-500 border-1 rounded-lg text-emerald-500 fi-br-check"
                          ></i>
                        </div>
                      )}
                      <div className="flex flex-col ml-5 justify-center">
                        <h1 className="text-xl font-bold mb-2 leading-none">
                          {entry.objective_entry.description}
                        </h1>
                        <p className="leading-none mb-4 text-slate-500 text-sm">
                          {entry.status ? (
                            "Completed"
                          ) : user.designation.id === 1 ? (
                            <div>
                              <table className="table-auto">
                                <thead>
                                  <tr>
                                    <th className="px-4 py-2">
                                      Number of Program activity for the
                                      students
                                    </th>
                                    <th className="px-4 py-2">
                                      Satisfaction rating of program/activity
                                      conducted
                                    </th>
                                    <th className="px-4 py-2">
                                      Number of students seeks guidance and
                                      counseling services
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr
                                    className="border-b border-slate-200"
                                    key={entry.id}
                                  >
                                    <td className="px-4 py-2">
                                      <input
                                        type="text"
                                        className="border-none"
                                        defaultValue={
                                          inputData[entry.id]
                                            ?.programActivity || ""
                                        }
                                        onChange={(e) =>
                                          handleInputChange(
                                            entry.id,
                                            "programActivity",
                                            e.target.value
                                          )
                                        }
                                        required
                                      />
                                    </td>
                                    <td className="px-4 py-2">
                                      <input
                                        type="text"
                                        className="border-none"
                                        defaultValue={
                                          inputData[entry.id]
                                            ?.satisfactionRating || ""
                                        }
                                        onChange={(e) =>
                                          handleInputChange(
                                            entry.id,
                                            "satisfactionRating",
                                            e.target.value
                                          )
                                        }
                                        required
                                      />
                                    </td>
                                    <td className="px-4 py-2">
                                      <input
                                        type="text"
                                        className="border-none"
                                        defaultValue={
                                          inputData[entry.id]
                                            ?.guidanceServices || ""
                                        }
                                        onChange={(e) =>
                                          handleInputChange(
                                            entry.id,
                                            "guidanceServices",
                                            e.target.value
                                          )
                                        }
                                        required
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          ) : user.designation.id === 2 ? (
                            <div>
                              <table className="table-auto">
                                <thead>
                                  <tr>
                                    <th className="px-4 py-2">
                                      Number of Attendance
                                    </th>
                                    <th className="px-4 py-2">
                                      No of Printed Materials
                                    </th>
                                    <th className="px-4 py-2">
                                      Type of Materials
                                    </th>
                                    <th className="px-4 py-2">
                                      Satisfaction Rating
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr
                                    className="border-b border-slate-200"
                                    key={entry.id}
                                  >
                                    <td className="px-4 py-2">
                                      <input
                                        type="text"
                                        className="border-none"
                                        defaultValue={
                                          inputData[entry.id]?.attendance || ""
                                        }
                                        onChange={(e) =>
                                          handleInputChange(
                                            entry.id,
                                            "attendance",
                                            e.target.value
                                          )
                                        }
                                        required
                                      />
                                    </td>
                                    <td className="px-4 py-2">
                                      <input
                                        type="text"
                                        className="border-none"
                                        defaultValue={
                                          inputData[entry.id]
                                            ?.printedMaterials || ""
                                        }
                                        onChange={(e) =>
                                          handleInputChange(
                                            entry.id,
                                            "printedMaterials",
                                            e.target.value
                                          )
                                        }
                                        required
                                      />
                                    </td>
                                    <td className="px-4 py-2">
                                      <input
                                        type="text"
                                        className="border-none"
                                        defaultValue={
                                          inputData[entry.id]
                                            ?.typeOfMaterials || ""
                                        }
                                        onChange={(e) =>
                                          handleInputChange(
                                            entry.id,
                                            "typeOfMaterials",
                                            e.target.value
                                          )
                                        }
                                        required
                                      />
                                    </td>
                                    <td className="px-4 py-2">
                                      <input
                                        type="text"
                                        className="border-none"
                                        defaultValue={
                                          inputData[entry.id]
                                            ?.satisfactionRating || ""
                                        }
                                        onChange={(e) =>
                                          handleInputChange(
                                            entry.id,
                                            "satisfactionRating",
                                            e.target.value
                                          )
                                        }
                                        required
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            ""
                          )}
                        </p>
                      </div>
                    </Card>
                  ))}
                  <div className="flex ml-5 mb-2 items-center">
                    {parseFloat(
                      objective.entries.filter((entry) => entry.status).length /
                        objective.entries.length
                    ) *
                      100 ===
                    100 ? (
                      <button
                        onClick={() => handleObjectiveSubmit(objective.id)}
                        className="bg-blue-500 text-white py-1 px-2 rounded-md"
                      >
                        Submit
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              ) : (
                <Card className="animate-fade-up overflow-hidden p-3 px-4 rounded-md border-slate-200 border relative">
                  <div className="absolute top-0 bottom-0 w-1 bg-blue-500 rounded-md left-0"></div>
                  <div className="flex">
                    <div key={objective.id} className="w-full">
                      <p className="mb-0.5 font-bold">
                        {objective.objective.title}
                      </p>
                      <div className="flex mb-0.5 justify-between items-center">
                        <p className="text-xs text-slate-500">
                          {objective.is_completed ? "100%" : "0%"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {objective.is_completed
                            ? "Completed"
                            : "Not Completed"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </Card>
          ) : (
            <div className="border-2 border-dashed border-slate-200 text-slate-500 text-sm py-6 text-center">
              There are no objectives posted
            </div>
          )
        )
      ) : (
        <div className="border-2 border-dashed border-slate-200 text-slate-500 text-sm py-6 text-center">
          There are no objectives posted
        </div>
      )}
    </div>
  );
};

export default Objective;
