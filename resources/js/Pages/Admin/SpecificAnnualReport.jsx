import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";

export default function AnnualReport({ report }) {
  console.log(report.data);

  return (
    <PanelLayout
      layout={LayoutType.SUPER_ADMIN}
      defaultActiveLink="generated_reports_annually"
    >
      <div className="content-wrapper">
        <div className="bg-white p-6">
          {Object.entries(report.data).map(([location, data]) => (
            <div key={location} className="mb-10">
              <h4>{location}</h4>
              <p>
                Total overall reports from all offices in all quarters -{" "}
                {data.total}
              </p>
              {/* check length of data.quarters */}
              {Object.entries(data.quarters).map(([quarter, quarterData]) => (
                <div key={quarter}>
                  {/* check quarter initials if st, nd or th */}
                  <p className="font-bold">
                    {quarter == 1
                      ? "1st"
                      : quarter == 2
                      ? "2nd"
                      : quarter == 3
                      ? "3rd"
                      : quarter + "th"}{" "}
                    Quarter
                  </p>
                  <p>Total Reports this quarter - {quarterData.total}</p>
                  {/* quarterData.offices */}
                  <table className="m-2 w-full">
                    <thead>
                      <tr className="[&>th]:text-slate-500 [&>th]:bg-slate-50 [&>th]:border-l [&>th:first-child]:border-0 [&>th]:px-4 [&>th]:py-2 border-b [&>th]:text-sm [&>th]:font-bold">
                        <th>Office</th>
                        <th>Number of Reports</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(quarterData.offices).map(
                        ([office, officeData]) => (
                          <tr
                            key={office}
                            className="[&>td]:text-sm [&>td]:border-l [&>td:first-child]:border-0 [&>td]:px-4 [&>td]:py-2.5"
                          >
                            <td>{office}</td>
                            <td>{officeData}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                  {/* {Object.entries(quarterData.offices).map(
                    ([office, officeData]) => (
                      <p>
                        {office} - {officeData}
                      </p>
                    )
                  )} */}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </PanelLayout>
  );
}
