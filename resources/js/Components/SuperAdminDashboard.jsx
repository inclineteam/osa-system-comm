import React from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import DashboardCard from './DashboardCard'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import googleCalendarPlugin from '@fullcalendar/google-calendar'
import interactionPlugin from '@fullcalendar/interaction'
import { Link } from '@inertiajs/react'
import CalendarCard from './CalendarCard'
import AnnouncementsCard from './AnnouncementsCard'

const SuperAdminDashboard = () => {
    const [campuses, setCampuses] = useState([]);
    const [fetchingCampus, setFetchingCampus] = useState(true);
    const [events, setEvents] = useState([])
    const [announcements, setAnnouncements] = useState([])

    useEffect(() => {
        const fetchCampuses = () => {
            setFetchingCampus(true)
            axios.get('/campus')
                .then((res) => {
                    console.log(res)
                    setCampuses(res.data.campuses);
                    setFetchingCampus(false);
                })
        }
        const fetchEvents = () => {
            axios.get('/calendar')
                .then(res => {
                    setEvents(res.data.events)
                })
        }

        const fetchAnnouncements = () => {
            axios.get('/announcements')
                .then(res => {
                    console.log('announcements: ', res.data)
                    setAnnouncements(res.data.announcements)
                })
        }

        fetchAnnouncements()
        fetchEvents()
        fetchCampuses();
    }, []);

    return (
        <div>
            <Row className='gx-2 gy-3'>
                <Col>
                    <Row className='gy-3 gx-3'>
                        {
                            fetchingCampus ? (
                                <>
                                    <Col lg={6} md={6} xs={6}>
                                        {/* submission bins */}
                                        <DashboardCard
                                            label='Unit Heads'
                                            subLabel="..."
                                            value="..."
                                            variant='success'
                                            icon={<i className='fi fi-rr-user fs-5'></i>}
                                        />
                                    </Col>
                                    <Col lg={6} md={6} xs={6}>
                                        {/* submission bins */}
                                        <DashboardCard
                                            label='Unit Heads'
                                            subLabel="..."
                                            value="..."
                                            variant='success'
                                            icon={<i className='fi fi-rr-user fs-5'></i>}
                                        />
                                    </Col>
                                    <Col lg={6} md={6} xs={6}>
                                        {/* submission bins */}
                                        <DashboardCard
                                            label='Unit Heads'
                                            subLabel="..."
                                            value="..."
                                            variant='success'
                                            icon={<i className='fi fi-rr-user fs-5'></i>}
                                        />
                                    </Col>
                                    <Col lg={6} md={6} xs={6}>
                                        {/* submission bins */}
                                        <DashboardCard
                                            label='Unit Heads'
                                            subLabel="..."
                                            value="..."
                                            variant='success'
                                            icon={<i className='fi fi-rr-user fs-5'></i>}
                                        />
                                    </Col>
                                </>
                            ) : (
                                <>
                                    {
                                        campuses.map((campus, index) => (
                                            <Col key={index} lg={6} md={6} xs={6}>
                                                {/* submission bins */}
                                                <DashboardCard
                                                    label='Unit Heads'
                                                    subLabel={campus.name}
                                                    value={campus.unit_heads?.length ?? 0}
                                                    variant='success'
                                                    key={index}
                                                    icon={<i className='fi fi-rr-user fs-5'></i>}
                                                />
                                            </Col>
                                        ))
                                    }
                                </>
                            )
                        }


                    </Row>
                    <CalendarCard viewButton className='mt-3' />
                </Col>
                <Col lg={3}>
                    <AnnouncementsCard link={route('admin.announcements')} />
                    {/* <Card className='border-0 p-3 shadow-sm'>
                        <Card.Body>
                            <p className='fs-6 fw-bold text-sm text-black-50'>Announcements</p>
                            {
                                announcements.map((item, index) => (
                                    <div className="mb-3" key={index}>
                                        <p>{item.title}</p>
                                    </div>
                                ))
                            }
                        </Card.Body>
                    </Card> */}
                </Col>
            </Row>

        </div>
    )
}

export default SuperAdminDashboard
