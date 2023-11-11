import ConfirmModal from '@/Components/ConfirmModal'
import { TextButton } from '@/Components/CustomBtn'
import ModalComponent from '@/Components/ModalComponent'
import PanelLayout, { LayoutType } from '@/Layouts/PanelLayout'
import { Head, Link, router } from '@inertiajs/react'
import axios from 'axios'
import { format } from 'date-fns'
import React, { useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { Badge, Button, Card, Col, Dropdown, Image, ListGroup, ListGroupItem, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'

const Announcements = ({ auth, announcements: announcementList }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [announcements, setAnnouncements] = useState([...announcementList])
    const [reOrdered, setReOrdered] = useState([...announcementList])
    const [announcement, setAnnouncement] = useState(null)
    const [announcementId, setAnnouncementId] = useState(null)
    const [showViewModal, setShowViewModal] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [draggingEnable, setDraggingEnable] = useState(false)
    const [isReordering, setIsReordering] = useState(false)

    const deleteRow = (id) => {
        setAnnouncementId(id);
        setShowConfirmModal(true)
    }

    const onConfirm = () => {
        setProcessing(true);
        axios.delete(`/announcements/${announcementId}`)
            .then((res) => {
                console.log(res)
                removeFromList(announcementId);
            });
    }

    const removeFromList = (id) => {
        let newList = announcements.filter((item, index) => item.id !== id)
        setAnnouncements(newList)

        let newReorderedList = reOrdered.filter((item, index) => item.id !== id)
        setReOrdered(newReorderedList)

        setShowConfirmModal(false)
        setProcessing(false)

        toast.success('Successfully deleted!')
    }

    const viewAnnouncement = (a) => {
        setAnnouncement(a)
        setShowViewModal(true);
    }

    const closeViewModal = () => {
        setShowViewModal(false)
        setTimeout(() => setAnnouncement(null), 500)
    }

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        if(result.destination.index === result.source.index) return;
        let items = [...reOrdered]

        const orderedItems = Array.from(reOrdered)

        const [reorderedItem] = orderedItems.splice(result.source.index, 1);
        orderedItems.splice(result.destination.index, 0, reorderedItem);

        setReOrdered(orderedItems);


        // let srcOrder = items[result.source.index].order;
        // items[result.source.index].order = items[result.destination.index].order;
        // items[result.destination.index].order = srcOrder;
        saveOrder(orderedItems[result.source.index].id, orderedItems[result.destination.index].id)
    }

    const saveOrder = (item1, item2) => {
        setSaving(true)
        axios.patch('/announcements/order', { item_1: item1, item_2: item2 })
            .then((res) => {
                console.log(res);
                setSaving(false)
            })
            .catch((err) => {
                console.log(err);
                setSaving(false)
            })
    }

    return (
        <PanelLayout userAuth={auth} layout={LayoutType.SUPER_ADMIN} defaultActiveLink="announcements">
            <ModalComponent centered size="lg" show={showViewModal} handleClose={closeViewModal}>
                {
                    announcement && (
                        <div className="my-2 container">
                            <p className="fs-4 mb-0 fw-bold">{announcement.title}</p>
                            <p className="mt-0 mb-2 text-sm text-secondary">
                                <small>{format(new Date(announcement.created_at), 'MMM dd, yyy / hh:mm a')}</small>
                            </p>
                            <p className="fs-6 mt-3">{announcement.content}</p>
                            {
                                announcement.image != '' && announcement.image != null && (
                                    <div className="">
                                        <Image
                                            fluid
                                            thumbnail
                                            draggable={false}
                                            className='rounded-0 shadow-sm max-h-[400px]'
                                            src={announcement.image}
                                        />
                                    </div>
                                )
                            }
                            <hr />
                            <div className="text-end">
                                <TextButton text='Close' onClick={closeViewModal}/>
                            </div>
                        </div>
                    )
                }
            </ModalComponent>
            <ConfirmModal processing={processing} show={showConfirmModal} handleClose={() => setShowConfirmModal(false)} onConfirm={onConfirm} onCancel={() => setShowConfirmModal(false)} />
            <div className=''>
                <div className="content-wrapper">
                    <Card className='border-0 shadow-sm mt-3 p-lg-3 p-2'>
                        <Card.Header className='bg-white bg-opacity-80 pb-3'>
                            <div className="lg:flex justify-content-between items-center">
                                <div className='my-1'>
                                    <p className="text-dark my-0 fw-bold fs-5 flex items-center gap-2">
                                        Posted Announcements
                                        <i className="fi fi-rr-bullhorn text-primary"></i>
                                    </p>
                                    <p className='my-0 text-secondary'>
                                        <small>Edit / Remove</small>
                                    </p>
                                </div>
                                <Link href={route('admin.create_announcement')} className='btn btn-light-primary rounded-1 my-1 font-semibold'><i className='bx bx-plus'></i> Create new</Link>
                            </div>
                        </Card.Header>
                        <Card.Body className=' position-relative '>
                            <p className={`text-end text-sm text-secondary mt-0 mb-1 ${saving?'visible':'invisible'}`}>Saving changes...</p>
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                                <Droppable droppableId='announcements'>
                                    {(provided) => (
                                        <ListGroup variant="flushed" className={`list-group-flush`} {...provided.droppableProps} ref={provided.innerRef}>
                                            {
                                                reOrdered && reOrdered.length > 0 ? (
                                                    reOrdered && reOrdered.map((item, index) => (
                                                        <Draggable isDragDisabled={saving} key={item.id} draggableId={`announcement-${item.id}`} index={index}>
                                                            {(provided,snapshot) => (
                                                                <ListGroupItem className={`hover:bg-gray-100 ${snapshot.isDragging? 'dragging':''}`} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                    <Row key={index} className='mt-1 align-items-center gy-3'>
                                                                        <Col lg={6} md={6}>
                                                                            <p className=' fw-bold fs-5 mb-0'>{item.title}</p>
                                                                            <p className="mt-0 mb-2 text-sm text-secondary">
                                                                                <small>{format(new Date(item.created_at), 'MMM dd, yyy / hh:mm a')}</small>
                                                                            </p>
                                                                            <p className=' text-secondary'>{item.content.substr(0, 250)}...</p>
                                                                        </Col>
                                                                        <Col lg={5}>
                                                                            {
                                                                                item.image !== '' && item.image !== null && (
                                                                                    <div className="col-lg-4 col-md-7 col-10 h-[150px] overflow-hidden p-3 border hover:shadow-inner position-relative">
                                                                                        <div className="cursor-pointer bg-gray-400 opacity-30 position-absolute w-full h-full top-0 left-0 hover:opacity-10 hover:shadow transition-all"></div>
                                                                                        <Image
                                                                                            src={item.image}
                                                                                            fluid
                                                                                        />
                                                                                    </div>
                                                                                )
                                                                            }
                                                                        </Col>
                                                                        <Col lg={1}>
                                                                            <div className="flex ">
                                                                                <button className='btn btn-link hover:bg-gray-200 text-decoration-none' type='button' onClick={() => viewAnnouncement(item)}>
                                                                                    <i className='fi fi-br-expand '></i>
                                                                                </button>

                                                                                <Dropdown>
                                                                                    <Dropdown.Toggle bsPrefix='toggler' className=' btn-link bg-transparent text-decoration-none'>
                                                                                        <i className=' fi fi-br-menu-dots-vertical'></i>
                                                                                    </Dropdown.Toggle>
                                                                                    <Dropdown.Menu align="end">
                                                                                        <Dropdown.Item href={route('admin.edit_announcement', { id: item.id })}>Edit</Dropdown.Item>
                                                                                        <Dropdown.Item onClick={() => deleteRow(item.id)}>Delete</Dropdown.Item>
                                                                                    </Dropdown.Menu>
                                                                                </Dropdown>

                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </ListGroupItem>
                                                            )}
                                                        </Draggable>
                                                    ))
                                                ) : (
                                                    <div className='text'>
                                                        <p className='mb-0 text-secondary text-sm'>No reminders to show.</p>
                                                    </div>
                                                )
                                            }
                                            {provided.placeholder}
                                        </ListGroup>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </PanelLayout>
    )
}

export default Announcements
