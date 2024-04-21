export const ObjectiveTableInput = ({
  data,
  handleInputChange,
  inputData,
  entry,
}) => {
  return (
    <div>
      <table className="table-auto">
        <thead>
          <tr>
            {Object.values(data).map((v, i) => (
              <th key={i} className="px-4 py-2">
                {v}
              </th>
            ))}
            <th className="px-4 py-2">Documentation</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-200" key={entry}>
            {Object.keys(data).map((k, i) => (
              <td key={i} className="px-4 py-2">
                <input
                  type="text"
                  className="border-none"
                  defaultValue={inputData[entry] ? inputData[entry][k] : ""}
                  onChange={(e) => handleInputChange(entry, k, e.target.value)}
                  required
                />
              </td>
            ))}
            <td className="px-4 py-2">
              <input
                type="file"
                className="border-none"
                defaultValue={
                  inputData[entry] ? inputData[entry]["documentation"] : ""
                }
                onChange={(e) =>
                  handleInputChange(entry, "documentation", e.target.files[0])
                }
                required
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
