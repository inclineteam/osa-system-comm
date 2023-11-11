import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { Badge, Card, ListGroup, ListGroupItem } from 'react-bootstrap'
import { formatDate } from './Helper';

const RemindersCard = ({ className = "" }) => {
    const [reminders, setReminders] = useState([]);

    useEffect(() => {
        const fetchReminders = () => {
            axios.get('/reminders/all')
                .then((res) => {
                    setReminders(res.data.reminders);
                })
        }
    }, [])

    return (
        <Card className={`border-0 shadow-sm rounded-0 ${className}`}>
            <Card.Body>
                <p className="fw-bold">Reminders</p>
                <ListGroup>
                    {
                        reminders.map((reminder, index) => (
                            <ListGroupItem>
                                <Badge bg='blue'>
                                    {formatDate(new Date(reminder.created_at))}
                                </Badge>
                                <p>{reminder.content}</p>
                            </ListGroupItem>
                        ))
                    }
                </ListGroup>
                {
                    reminders.length == 0 && (
                        <p className='text-sm text-secondary'>Nothing to show.</p>
                    )
                }
            </Card.Body>
        </Card>
    )
}

export default RemindersCard
