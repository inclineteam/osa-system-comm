import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import DashboardCard from './DashboardCard'
import { usePage } from '@inertiajs/react'
import CalendarCard from './CalendarCard'
import AnnouncementsCard from './AnnouncementsCard'

const AdminDashboard = ({ }) => {
    const { auth } = usePage().props;
    return (
        <Row className='gy-3'>
            <Col lg={4}>
                {/* <DashboardCard
                        subLabel='Unit Heads'
                        label={auth.user.campus.name}
                        icon={<i className='fi fi-rr-user'></i>}
                        value={0}
                        variant='success'
                    /> */}
                <AnnouncementsCard className='' />
            </Col>
            <Col>
                <CalendarCard expandButton />
            </Col>
        </Row>
    )
}

export default AdminDashboard
