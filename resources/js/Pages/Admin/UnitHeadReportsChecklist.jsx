import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";

export default function UnitHeadReportsChecklist({ reports }) {
  console.log(reports);
  return (
    <PanelLayout defaultActiveLink="reports checklist">
      <div className="content-wrapper">
        <div className="p-4 border-b border-slate-300 rounded-lg shadow-sm bg-white">
          <h1 className="text-xl font-bold mb-2 leading-none">
            Reports checklist
          </h1>
          <p className="border-b border-slate-200 pb-4 leading-none mb-4 text-slate-500">
            See all the reports
          </p>
        </div>
      </div>
    </PanelLayout>
  );
}
