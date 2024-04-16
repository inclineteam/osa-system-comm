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
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-200" key={entry.id}>
            {Object.keys(data).map((k, i) => (
              <td key={i} className="px-4 py-2">
                <input
                  type="text"
                  className="border-none"
                  defaultValue={
                    inputData[entry.id] ? inputData[entry.id][k] : ""
                  }
                  onChange={(e) =>
                    handleInputChange(entry.id, k, e.target.value)
                  }
                  required
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
