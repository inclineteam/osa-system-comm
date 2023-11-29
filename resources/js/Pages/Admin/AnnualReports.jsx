// import CustomYearInput from "@/Components/CustomYearInput";
import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";
import { Card } from "react-bootstrap";
// import DatePicker from "react-datepicker";

export default function AnnualReport() {
  return (
    <PanelLayout
      layout={LayoutType.SUPER_ADMIN}
      defaultActiveLink="generated_reports_annually"
    >
      <div className="content-wrapper">
        <div className="bg-white p-6">
          <button className="transition bg-indigo-600 text-white px-3 py-2 text-sm font-medium shadow hover:bg-indigo-400 rounded-md">
            General annual report
          </button>
          {/* <Card className="flex  flex-col h-[12rem]">
            <div>
              <p className="font-bold">Select Date</p>
            </div>
            <DatePicker
              // selected={selectedYear}
              // onChange={handleYearChange}
              customInput={<CustomYearInput />}
              showYearPicker
            />

            <select>
              <option>Select Semester</option>
              <option value="0">1st Semester</option>
              <option value="1">2nd Semester</option>
            </select>
          </Card> */}
        </div>
      </div>
    </PanelLayout>
  );
}
