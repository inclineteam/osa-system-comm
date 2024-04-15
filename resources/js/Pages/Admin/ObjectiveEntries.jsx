import PanelLayout from "@/Layouts/PanelLayout";
import React from "react";

function ObjectiveEntries({ userObjectiveEntries }) {
  console.log(userObjectiveEntries);
  return (
    <PanelLayout headerTitle="Objective Monitoring">
      <div className="content-wrapper">
        {/* table for : userObjectiveEntries[0].info_data where info_data has : {"test1": 0, "test2": 0} where test1 and test2 are the table titles and its value is the under the title */}
        {/* userObjectiveEntries is {{ }, {}} */}
        <table className="table table-bordered table-hover dataTable">
          {/* table head has the following, the info_data title */}
          <thead>
            <tr>
              {/* user first name and last name */}
              <th>User</th>
              {/* campus */}
              <th>Campus</th>

              {/* check the first time of the userObjectvieEntries */}
              {Object.keys(userObjectiveEntries[0].info_data).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          {/* table body has the following, the info_data value */}
          <tbody>
            {userObjectiveEntries.map((userObjectiveEntry) => (
              <tr key={userObjectiveEntry.id}>
                {console.log(userObjectiveEntry)}
                <td>
                  {userObjectiveEntry.user.firstname}{" "}
                  {userObjectiveEntry.user.lastname}
                </td>

                <td>{userObjectiveEntry.user.campus.name}</td>

                {Object.keys(userObjectiveEntry.info_data).map((key) => (
                  <td key={key}>{userObjectiveEntry.info_data[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PanelLayout>
  );
}

export default ObjectiveEntries;
