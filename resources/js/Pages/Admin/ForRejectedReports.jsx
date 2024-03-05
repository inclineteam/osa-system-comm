import FileIcon from "@/Components/FileIcon";
import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";
import dayjs from "dayjs";

export default function ForReviewReports({ auth, reportsForRejected }) {
  return (
    <PanelLayout
      layout={LayoutType.ADMIN}
      pageTitle="Reports | For rejected"
      defaultActiveLink="for rejected"
    >
      <div className="content-wrapper">
        <div className="p-4 border-b border-slate-300 rounded-lg shadow-sm bg-white">
          <h1 className="text-2xl tracking-tight font-semibold mb-2 leading-none">
            For rejected
          </h1>
          <p className="leading-none mb-4 text-slate-500">
            See all the reports that was rejected.
          </p>

          {reportsForRejected.length > 0 ? (
            reportsForRejected.map((report) => (
              <div
                key={report.id}
                className="border-t last:!pb-0 border-slate-200 py-3"
              >
                <div className="space-x-1">
                  <div>
                    <div className="flex space-x-3 items-start">
                      <img
                        src={report.unit_head.image}
                        alt="Avatar"
                        className="mt-1 w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="w-max px-1 py-0.5 rounded-md group-hover:bg-slate-200 duration-75">
                          <p className="text-slate-800 w-max mb-0 font-semibold">
                            {report.unit_head.firstname}{" "}
                            {report.unit_head.lastname}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold ml-1 mb-0 text-sm text-slate-500">
                            {report.unit_head.campus.name}
                          </p>
                        </div>
                        <p className="ml-1 mb-0 font-normal text-sm text-slate-500">
                          Submitted his report on{" "}
                          <span className="font-semibold">
                            "{report.submission_bin.title}"
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* <p className="flex-1 mb-0">{userEvent.description}</p> */}
                </div>
              </div>
            ))
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
