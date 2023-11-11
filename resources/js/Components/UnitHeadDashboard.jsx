import axios from 'axios';
import { format } from 'date-fns';
import moment from 'moment/moment';
import React, { useEffect, useState } from 'react'
import { Badge, Card, Col, Image, ListGroup, ListGroupItem, Placeholder, Row } from 'react-bootstrap'
import ReactTimeAgo from 'react-time-ago';
import CalendarCard from './CalendarCard';
import RemindersCard from './RemindersCard';
import AnnouncementsCard from './AnnouncementsCard';


const UnitHeadDashboard = () => {

    return (
        <Row>
            <Col xs={12} lg={5}>
                <AnnouncementsCard />
                <RemindersCard className="my-3"/>
            </Col>
            <Col>
                <CalendarCard expandButton/>
            </Col>
        </Row>
    )
}

export default UnitHeadDashboard
