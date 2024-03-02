import axios from "axios";
import { useEffect, useState } from "react";

const Objective = ({ user }) => {
  const [objectives, setObjectives] = useState([]);

  useEffect(() => {
    const fetchObjectives = () => {
      axios.get(route("objectives.user.all", user.id)).then((res) => {
        if (res.statusText === "OK") {
          setObjectives(res.data);
          console.log(res.data);
        }
      });
    };

    fetchObjectives();
  }, []);

  return (
    <div className="mb-4 bg-white shadow-sm border-b border-slate-300 rounded-lg p-4">
      <div>
        <h1 className="text-xl font-bold mb-2 leading-none">Objective</h1>
        <p className="leading-none mb-4 text-slate-500 text-sm">
          Please finish the following tasks.
        </p>
      </div>
      {objectives.length != 0 && objectives ? (
        <div className="animate-fade-up overflow-hidden p-3 px-4 rounded-md border-slate-200 border relative">
          <div className="absolute top-0 bottom-0 w-1 bg-blue-500 left-0"></div>
          {objectives.map((objective) => (
            <div className="flex">
              {objective.is_completed == 0 &&
              objective.objective.objective_type == 0 ? (
                <div className="flex  items-center w-[3rem] mr-2">
                  <i
                    onClick={() => {
                      axios
                        .put(route("objectives.user.update"), {
                          id: objective.id,
                          is_completed: !objective.is_completed,
                        })
                        .then((res) => {
                          if (res.statusText === "OK") {
                            setObjectives((prev) => {
                              return prev.map((obj) => {
                                if (obj.id === objective.id) {
                                  return {
                                    ...obj,
                                    is_completed: !obj.is_completed,
                                  };
                                }
                                return obj;
                              });
                            });
                          }
                        });
                    }}
                    class="fi p-1 hover:bg-emerald-500 hover:cursor-pointer hover:text-white border-emerald-500 border-1 rounded-lg text-emerald-500 fi-br-check"
                  ></i>
                </div>
              ) : (
                ""
              )}

              {objective.is_completed == 1 && (
                <div className="flex  items-center w-[3rem] mr-2">
                  <i
                    onClick={() => {}}
                    class="fi p-1 hover:bg-blue-500 hover:cursor-pointer hover:text-white border-blue-500 border-1 rounded-lg text-blue-500 fi-rr-box"
                  ></i>
                </div>
              )}
              <div key={objective.id} className="w-full">
                <p className="mb-0.5 font-bold">{objective.objective.title}</p>
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
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-200 text-slate-500 text-sm py-6 text-center">
          There is no objectives posted
        </div>
      )}
    </div>
  );
};

export default Objective;
