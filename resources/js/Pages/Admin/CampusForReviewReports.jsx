import { CampusForReviewTable } from "@/Components/CampusForReviewTable";
import HeaderTitle from "@/Components/HeaderTitle";
import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";

export default function CampusForReviewReports({ offices, campus }) {
  const officesArr = Object.keys(offices);

  return (
    <PanelLayout
      layout={LayoutType.ADMIN}
      defaultActiveLink="for review"
      pageTitle="Reports | For review"
      headerTitle={
        <HeaderTitle
          text={"Review reports for " + campus}
          backButton
          backButtonLink={route("admin.reports.for-review")}
        />
      }
    >
      <div className="content-wrapper">
        <div className="p-4 border-b border-slate-300 rounded-lg shadow-sm bg-white">
          <h1 className="text-2xl font-semibold tracking-tight mb-2 leading-none">
            For review reports for {campus}
          </h1>
          <p className="border-b border-slate-200 pb-4 leading-none mb-4 text-slate-500">
            See all the reports that needs to be reviewed.
          </p>
          {/* admin.report.open */}
          {officesArr.length ? (
            officesArr.map((officeItem, i) => (
              <CampusForReviewTable
                key={i}
                officeItem={officeItem}
                offices={offices}
              />
            ))
          ) : (
            <div className="text-slate-500 border-2 rounded-md border-dashed border-slate-200 py-8 text-center">
              There are currently no reports submitted for this campus
            </div>
          )}
        </div>
      </div>
    </PanelLayout>
  );
}
