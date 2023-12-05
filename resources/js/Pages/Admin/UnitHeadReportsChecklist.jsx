import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";
import { Link } from "@inertiajs/react";

export default function UnitHeadReportsChecklist({ offices }) {
  const officesArr = Object.keys(offices);

  const statusColors = {
    Approved: "text-emerald-600",
    Rejected: "text-rose-600",
    Pending: "text-amber-600",
  };
  return (
    <PanelLayout defaultActiveLink="reports checklist">
      <div className="content-wrapper">
        <div className="p-4 border-b border-slate-300 rounded-lg shadow-sm bg-white">
          <h1 className="text-xl font-bold mb-2 leading-none">
            Reports checklist
          </h1>
          <p className="border-b border-slate-200 pb-4 leading-none mb-4 text-slate-500">
            See all the reports within all campuses.
          </p>

          {/* admin.report.open */}
          {officesArr.length ? (
            officesArr.map((officeItem, i) => (
              <div key={i} className="mt-4">
                <div className="pt-2 flex border-zinc-200">
                  <i className="text-slate-500 fi-rr-city text-xl mr-2"></i>
                  <p className="font-bold mb-0">{officeItem} Office</p>
                </div>
                {offices[officeItem].map((report, i) => (
                  <Link
                    href={route("admin.report.open", [report.id])}
                    className="last:border-b-0 border-b group border-slate-200 block py-3"
                  >
                    <div>
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
                                <p
                                  className={`font-semibold rounded-md ml-1 mb-0 text-sm ${
                                    statusColors[report.status]
                                  }`}
                                >
                                  {report.status}
                                </p>
                                <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                                <p className="font-semibold ml-1 mb-0 text-sm text-slate-500">
                                  {report.unit_head.campus.name}
                                </p>
                              </div>
                              <p className="ml-1 mb-0 font-normal text-sm text-slate-500">
                                Submitted his report on{" "}
                                <span class="font-semibold">
                                  "{report.submission_bin.title}"
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* <p className="flex-1 mb-0">{userEvent.description}</p> */}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ))
          ) : (
            <div className="text-slate-500 border-2 rounded-md border-dashed border-slate-200 py-8 text-center">
              There are currently no reports submitted for this campus.
            </div>
          )}
        </div>
      </div>
    </PanelLayout>
  );
}
