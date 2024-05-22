import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listViewPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import PanelLayout from "@/Layouts/PanelLayout";
import { Card, Col, Row } from "react-bootstrap";

export default function UnitHeadCalendar({ events }) {
  console.log("events: ", events);
  return (
    <PanelLayout defaultActiveLink="Calendar">
      <div className="content-wrapper">
        <Card className={`!rounded-lg border-0 shadow-sm`}>
          <Row className="gap-2 g-4">
            <Col lg={2} className="mr-2">
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-3">
                  <p className="text-black-500 font-bold text-lg">All Events</p>
                  <div className="mt-3">
                    {events.map((event, index) => (
                      <div className="mb-3" key={index}>
                        <p className="my-0 font-medium">{event.title}</p>
                        <p className="my-0 text-sm text-black-50">
                          <small>{event.start}</small>
                        </p>
                      </div>
                    ))}
                  </div>
                  {events.length == 0 && (
                    <p className="my-1 text-sm">No events to show.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card.Header className="pb-0 pt-4 border-0 bg-white px-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-xl font-bold mb-2 leading-none">
                      Event calendar
                    </h1>
                    <p className="leading-none mb-4 text-slate-500 text-sm">
                      Check out the scheduled dates for events.
                    </p>
                  </div>
                </div>
              </Card.Header>

              <Card.Body className="pt-0 px-4 text-sm">
                <FullCalendar
                  viewClassNames={"custom-scroll"}
                  plugins={[
                    dayGridPlugin,
                    interactionPlugin,
                    listViewPlugin,
                    timeGridPlugin,
                  ]}
                  initialView="dayGridMonth"
                  weekends={false}
                  events={events}
                  headerToolbar={{
                    left: "title",
                    center: "",
                    right: "prev,next",
                  }}
                  titleFormat={{ year: "numeric", month: "short" }}
                  themeSystem="bootstrap5"
                />
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </div>
    </PanelLayout>
  );
}
