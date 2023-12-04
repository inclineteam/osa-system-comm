import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";
import { Link } from "@inertiajs/react";

export default function ForReviewReports({ campuses }) {
  return (
    <PanelLayout
      layout={LayoutType.ADMIN}
      pageTitle="Reports | For review"
      defaultActiveLink="for review"
    >
      <div className="content-wrapper">
        <div className="p-4 border-b border-slate-300 rounded-lg shadow-sm bg-white">
          <h1 className="text-xl font-bold mb-2 leading-none">
            For review reports
          </h1>
          <p className="border-b border-slate-200 pb-4 leading-none mb-4 text-slate-500">
            Click on the campus to view all of its reports
          </p>
          <div className="flex flex-wrap gap-4">
            {campuses.map((campus) => (
              <Link
                key={campus.id}
                href={route("admin.reports.for-review.campus", [
                  encodeURIComponent(campus.name),
                ])}
                className="hover:border-slate-400 transition uppercase rounded-md text-xl text-slate-800 text-center flex flex-col items-center justify-center p-6 border-[1px] border-slate-200"
              >
                <i class="fi fi-rr-cabin text-3xl mb-3 text-slate-500"></i>
                <span>{campus.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PanelLayout>
  );
}
