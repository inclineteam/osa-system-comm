import axios from "axios";
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";

const Objective = ({ user }) => {
  const [objectives, setObjectives] = useState([]);

  useEffect(() => {
    const fetchObjectives = async () => {
      try {
        const res = await axios.get(route("objectives.user.all", user.id));
        setObjectives(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching objectives:", error);
      }
    };

    fetchObjectives();
  }, [user.id]);

  const handleEntryStatusUpdate = (entryId, objectiveId) => {
    axios
      .put(route("objectives.user.update"), {
        id: entryId,
        status: true, // Set the status to true (completed)
      })
      .then((res) => {
        console.log("Update response:", res.data); // Log the response
        if (res.statusText === "OK") {
          // Update the status locally
          setObjectives((prevObjectives) => {
            return prevObjectives.map((obj) => {
              if (obj.id === objectiveId) {
                return {
                  ...obj,
                  entries: obj.entries.map((ent) => {
                    if (ent.id === entryId) {
                      return {
                        ...ent,
                        status: true,
                      };
                    }
                    return ent;
                  }),
                };
              }
              return obj;
            });
          });
        }
      })
      .catch((error) => console.error("Error updating entry status:", error));
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
        objectives.map((objective, index) => (
          <Card className="mb-1 " key={index}>
            <div className="absolute top-0 bottom-0 w-1 bg-blue-500 rounded-md left-0"></div>
            {objective.entries.length !== 0 && objective.entries ? (
              <div>
                {/* objective title */}
                <div className=" text-sm py-6">
                  <h1 className="text-xl ml-5 font-bold mb-2 leading-none">
                    {objective.objective.title}
                  </h1>
                </div>
                {objective.entries.map((entry, entryIndex) => (
                  <Card
                    key={entryIndex}
                    className="ml-5 flex flex-row mb-1 p-2 pt-3 w-[97%] h-[2rem] border-2 border-dashed border-slate-200 rounded-md"
                  >
                    {!entry.status && ( // Only show if status is false
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
                        {entry.status ? "Completed" : "Not Completed"}
                      </p>
                    </div>
                  </Card>
                ))}
                {/* percentage in entries that are already done, status: 1, in percentage form 0.5 is 50% */}
                <div className=" text-slate-500 text-[0.8rem] flex justify-end mr-5 mt-3 ">
                  <p className="leading-none mb-4 text-slate-500 ">
                    {parseFloat(
                      objective.entries.filter((entry) => entry.status).length /
                        objective.entries.length
                    ) * 100}
                    % Completed
                  </p>
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
                        {objective.is_completed ? "Completed" : "Not Completed"}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </Card>
        ))
      ) : (
        <div className="border-2 border-dashed border-slate-200 text-slate-500 text-sm py-6 text-center">
          There are no objectives posted
        </div>
      )}
    </div>
  );
};

export default Objective;
