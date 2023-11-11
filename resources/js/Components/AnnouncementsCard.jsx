import { Link } from '@inertiajs/react';
import axios from 'axios';
import { format } from 'date-fns';
import moment from 'moment/moment';
import React, { useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Image, ListGroup, ListGroupItem, Placeholder, Row } from 'react-bootstrap'
import ReactTimeAgo from 'react-time-ago';

const AnnouncementsCard = ({ className = "",link=null }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    /* placeholders while fetching data */
    const PlaceHolders = () => (
        <ListGroupItem>
            <Row className='mb-3'>
                <div className='col col-auto'>
                    <Placeholder animation='wave'>
                        <div className='w-[50px] h-[50px] bg-light shadow-sm'></div>
                    </Placeholder>
                </div>
                <Col>
                    <Placeholder as="p" animation='wave' className="my-0 ">
                        <Placeholder xs={12} bg="light" />
                    </Placeholder>
                    <Placeholder as="p" animation='wave' className="my-0 ">
                        <Placeholder xs={12} bg="light" />
                    </Placeholder>
                </Col>
            </Row>
            <Row className='mb-3'>
                <div className='col col-auto'>
                    <Placeholder animation='wave'>
                        <div className='w-[50px] h-[50px] bg-light shadow-sm'></div>
                    </Placeholder>
                </div>
                <Col>
                    <Placeholder as="p" animation='wave' className="my-0 ">
                        <Placeholder xs={12} bg="light" />
                    </Placeholder>
                    <Placeholder as="p" animation='wave' className="my-0 ">
                        <Placeholder xs={12} bg="light" />
                    </Placeholder>
                </Col>
            </Row>
            <Row className='mb-3'>
                <div className='col col-auto'>
                    <Placeholder animation='wave'>
                        <div className='w-[50px] h-[50px] bg-light shadow-sm'></div>
                    </Placeholder>
                </div>
                <Col>
                    <Placeholder as="p" animation='wave' className="my-0 ">
                        <Placeholder xs={12} bg="light" />
                    </Placeholder>
                    <Placeholder as="p" animation='wave' className="my-0 ">
                        <Placeholder xs={12} bg="light" />
                    </Placeholder>
                </Col>
            </Row>
        </ListGroupItem>
    );

    /* fetch announcements */
    useEffect(() => {
        const fetchAnnouncements = () => {
            setFetching(true);
            axios.get('/announcements/dashboard')
                .then((res) => {
                    setAnnouncements(res.data.announcements);
                    setTimeout(() => setFetching(false), 1000)
                    setIsLoaded(true)
                })
                .catch(err => {
                    console.log(err)
                    setTimeout(() => setFetching(false), 1000)
                    setIsLoaded(true)
                })
        }

        if (!isLoaded) fetchAnnouncements();
    }, [])

    const dateTimeLabel = (start, end) => {
        const startDate = moment(start);
        const timeEnd = moment(end);
        const diff = timeEnd.diff(startDate);
        const diffDuration = moment.duration(diff);
        if (diffDuration.days() <= 1) {
            return <ReactTimeAgo timeStyle="twitter" date={new Date(start)} locale='en-US' />
        }
        else if (diffDuration.weeks() <= 1) {
            return format(new Date(start), 'iiii, h:m aaa')
        } else {
            return format(new Date(start), 'MMM dd, yyy')
        }
    }

    return (
        <Card className={`border-0 rounded-0 shadow-sm p-3 ${className}`}>
            <Card.Body>
                <p className="mt-0 mb-4 fw-bold position-relative">
                    Announcements
                    <div className="w-[10px] h-[10px] rounded-cirlce"></div>
                </p>
                {
                    fetching ? (
                        <PlaceHolders />
                    ) : (
                        announcements.length > 0 ? (
                            <>
                                {
                                    announcements.map((announcement, index) => (
                                        <div className='mb-2 ' key={announcement.id}>
                                            <Row >
                                                {
                                                    announcement.image && (
                                                        <div className='col-2'>
                                                            <Image
                                                                src={announcement.image}
                                                                className='shadow-sm'
                                                                width={50}
                                                                height={50}
                                                            />
                                                        </div>
                                                    )
                                                }
                                                <Col className='col-10'>
                                                    <p className="mt-0 mb-1 text-sm text-truncate fw-bolder text-secondary">
                                                        {announcement.title}
                                                    </p>
                                                    <div className="col-12 ">
                                                        <p className="mt-0 mb-1 text-truncate text-sm text-black-50">
                                                            {announcement.content}
                                                        </p>
                                                    </div>
                                                    <p className="mt-2 text-sm text-black-50">
                                                        {/* <small>{dateTimeLabel(new Date(announcement.updated_at || announcement.created_at), new Date())}</small> */}
                                                        <ReactTimeAgo timeStyle="mini-minute-now" date={new Date(announcement.updated_at || announcement.created_at)} locale='en-US' />

                                                    </p>
                                                </Col>
                                            </Row>
                                        </div>
                                    ))
                                }
                                <Link
                                    href={link ?? route('unit_head.announcements')}
                                    className='link-primary text-sm'
                                >
                                    See All...
                                </Link>
                            </>
                        ) : (
                            <p className='text-sm text-secondary'>Nothing to show.</p>
                        )
                    )}
            </Card.Body>
        </Card>
    )
}

export default AnnouncementsCard;
