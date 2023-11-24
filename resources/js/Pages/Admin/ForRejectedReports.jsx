import PanelLayout from "@/Layouts/PanelLayout";
import dayjs from "dayjs";

export default function ForReviewReports({ auth, reportsForRejected }) {
  return (
    <PanelLayout userAuth={auth} defaultActiveLink="User Events History">
      <div className="content-wrapper">
        <div className="p-4 border-b border-slate-300 rounded-lg shadow-sm bg-white">
          <h1 className="text-xl font-bold mb-2 leading-none">For rejected</h1>
          <p className="leading-none mb-4 text-slate-500 text-sm">
            See all the reports that was rejected.
          </p>

          {reportsForRejected.length > 0 ? (
            <div className="grid lg:grid-cols-2 xl:grid-cols-3">
              <div className="border rounded-lg border-slate-200">
                {reportsForRejected.map((report) => (
                  <div
                    key={report.id}
                    className="border-b last:border-0 border-slate-200 p-3"
                  >
                    <div>
                      <div className="space-x-1">
                        <p className="w-max font-semibold mb-0">
                          {report.unit_head.firstname}{" "}
                          {report.unit_head.lastname}
                        </p>
                        <div className="mx-auto p-2 bg-slate-100 mt-2 w-full rounded-md">
                          <FileIcon
                            file={report.attachments[0]}
                            className={"mx-auto"}
                            size="md"
                          />
                          <p className="mx-auto text-sm truncate max-w-[30ch]">
                            {report.attachments[0].name}
                          </p>
                        </div>
                        {/* <p className="flex-1 mb-0">{userEvent.description}</p> */}
                      </div>
                    </div>

                    <div className="mt-2.5 text-sm text-slate-500">
                      {dayjs(report.created_at).format("MMM D, h:mm A")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm py-10 text-center rounded-lg text-slate-500 border-2 border-dashed border-slate-200">
              No rejected reports.
            </div>
          )}
        </div>
      </div>
    </PanelLayout>
  );
}
