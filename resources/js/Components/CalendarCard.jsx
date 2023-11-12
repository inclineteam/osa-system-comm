import FullCalendar from '@fullcalendar/react'
import React from 'react'
import { Button, Card, Col } from 'react-bootstrap'
import dayGridPlugin from '@fullcalendar/daygrid'
import listViewPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import axios from 'axios'
import { useEffect } from 'react'
import { Link } from '@inertiajs/react'
import { useState } from 'react'
import ModalComponent from './ModalComponent'

const CalendarCard = ({ viewButton = false, className = "", expandButton = false }) => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false)

    const fetchEvents = () => {
        axios.get(route('calendar.index'))
            .then((res) => {
                setEvents(res.data.events)
            })
    }

    useEffect(() => {
        fetchEvents();
    }, [])
    return (
        <>
            <ModalComponent
                size='fullscreen'
                show={showModal}
                handleClose={() => setShowModal(false)}
                closeButton
                title='Event Calendar'
            >
                <div className=''>
                    <FullCalendar
                        viewClassNames={"custom-scroll"}
                        plugins={[dayGridPlugin, interactionPlugin, listViewPlugin, timeGridPlugin]}
                        initialView="dayGridMonth"
                        weekends:false
                        events={events}
                        headerToolbar={{
                            left: 'title',
                            center: '',
                            right: 'prev,next',

                        }}
                        titleFormat={
                            { year: 'numeric', month: 'short' }
                        }
                        themeSystem="bootstrap5"
                    />
                </div>
            </ModalComponent>
            <Card className={`border-0 shadow-sm ${className}`}>
                <Card.Header className='bg-white px-4'>
                    <div className="flex justify-between items-center">
                        <p className="my-0 fw-bold">
                            Event Calendar
                        </p>
                        {
                            viewButton && (
                                <Link href={route('calendar')} className='text-sm px-3 py-2 text-green-600 font-medium rounded-md'>
                                    View
                                </Link>
                            )
                        }
                        {
                            expandButton && (
                                <button className='btn btn-link link-dark text-decoration-none' type='button' onClick={() => setShowModal(true)}>
                                    <i className='fi fi-rr-expand'></i>
                                </button>
                            )
                        }
                    </div>
                </Card.Header>
                <Card.Body className='p-4 text-sm'>
                    <FullCalendar
                        viewClassNames={"custom-scroll"}
                        plugins={[dayGridPlugin, interactionPlugin, listViewPlugin, timeGridPlugin]}
                        initialView="dayGridMonth"
                        weekends:false
                        events={events}
                        headerToolbar={{
                            left: 'title',
                            center: '',
                            right: 'prev,next',

                        }}
                        titleFormat={
                            { year: 'numeric', month: 'short' }
                        }
                        themeSystem="bootstrap5"
                    />
                </Card.Body>
            </Card>
        </>
    )
}

export default CalendarCard
