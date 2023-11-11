import ConfirmModal from '@/Components/ConfirmModal'
import ModalComponent from '@/Components/ModalComponent'
import PanelLayout, { LayoutType } from '@/Layouts/PanelLayout'
import { Head, Link } from '@inertiajs/react'
import axios from 'axios'
import { format } from 'date-fns'
import React, { useState } from 'react'
import { Badge, Button, Card, Col, Dropdown, Image, ListGroup, ListGroupItem, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'

const Reminders = ({ auth, reminders }) => {
    const [reminderList, setReminderList] = useState([...reminders])
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [reminderId, setReminderId] = useState(null)
    const [reminder, setReminder] = useState(null)
    const [showViewModal, setShowViewModal] = useState(false)
    const [processing, setProcessing] = useState(false)

    const confirmAction = (id) => {
        setReminderId(id)
        setShowConfirmModal(true)
    }

    const viewAnnouncement = (a) => {
        setReminder(a)
        setShowViewModal(true);
    }

    const closeViewModal = () => {
        setShowViewModal(false)
        setTimeout(() => setReminder(null), 500)
    }

    const deleteReminder = () => {
        setProcessing(true);
        axios.delete(`/reminders/${reminderId}`)
            .then((res) => {
                console.log(res)
                removeFromList(reminderId);
            });
    }

    const removeFromList = (id) => {
        let newList = reminderList.filter((item, index) => item.id !== id)
        setReminderList(newList)
        setShowConfirmModal(false)
        setProcessing(false)
        toast.success('Successfully deleted!')
    }

    return (
        <PanelLayout userAuth={auth} layout={LayoutType.SUPER_ADMIN} defaultActiveLink="reminders">
            <ModalComponent centered size="lg" show={showViewModal} handleClose={closeViewModal}>
                {
                    reminder && (
                        <div className="my-3">
                            <p className="fs-4 mb-0 fw-bold">{reminder.title}</p>
                            <p className="mt-0 mb-2 text-sm text-secondary">
                                <small>{format(new Date(reminder.created_at), 'MMM dd, yyy / hh:mm a')}</small>
                            </p>
                            <p className="fs-6 mt-3">{reminder.content}</p>
                        </div>
                    )
                }
            </ModalComponent>
            <ConfirmModal title='Are you sure to delete this reminder?' message='This action cannot be undone.' processing={processing} show={showConfirmModal} handleClose={() => setShowConfirmModal(false)} onConfirm={deleteReminder} onCancel={() => setShowConfirmModal(false)} />
            <div className='py-3'>
                <div className="px-[1.5rem]">
                    {/* <div className="text-end mb-2">
                    </div> */}
                    <Card className='border-0 shadow-sm mt-3 p-lg-3 p-3'>
                        <Card.Header className='bg-white bg-opacity-80 lg:flex justify-content-between items-center pb-3'>
                            <div className='my-1'>
                                <p className="text-dark my-0 fw-bold fs-5 flex items-center gap-2">
                                    Reminder list
                                    <i className="fi fi-rr-note text-primary"></i>
                                </p>
                                <p className='my-0 text-secondary'>
                                    <small>Edit / Remove</small>
                                </p>
                            </div>
                            <Link href={route('admin.create_reminder')} className='btn btn-light-primary rounded-1 my-1 font-semibold'><i className='bx bx-plus'></i> Create new</Link>
                        </Card.Header>
                        <Card.Body className=' position-relative '>
                            <ListGroup variant="flushed" className=' list-group-flush'>

                                {
                                    reminderList && reminderList.length > 0? (
                                        reminderList.map((item, index) => (
                                            <ListGroupItem key={index}>
                                                <Row key={index} className='mt-1 align-items-center gy-3'>
                                                    <Col>
                                                        <p className=' fw-bold fs-5 mb-0'>{item.title}</p>
                                                        <p className="mt-0 mb-2 text-sm text-secondary">
                                                            <small>{format(new Date(item.created_at), 'MMM dd, yyy / hh:mm a')}</small>
                                                        </p>
                                                        <p>{item.content}</p>
                                                    </Col>
                                                    <Col lg={1}>
                                                        <div className="flex ">
                                                            <button className='btn btn-link fs-6 hover:bg-gray-200 text-decoration-none' type='button' onClick={() => viewAnnouncement(item)}>
                                                                <i className='fi fi-br-expand'></i>
                                                            </button>
                                                            <Dropdown>
                                                                <Dropdown.Toggle bsPrefix='toggler' className=' btn-link bg-transparent text-decoration-none'>
                                                                    <i className=' fi fi-br-menu-dots-vertical'></i>
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu align="end">
                                                                    <Dropdown.Item href={route('admin.edit_reminder', { id: item.id })}>Edit</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => confirmAction(item.id)}>Delete</Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </ListGroupItem>
                                        ))
                                    ):(
                                        <div className='text'>
                                            <p className='mb-0 text-secondary text-sm'>No reminders to show.</p>
                                        </div>
                                    )
                                }
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </PanelLayout>
    )
}

export default Reminders