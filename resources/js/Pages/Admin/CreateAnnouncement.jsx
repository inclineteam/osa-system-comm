import ImageUploader from '@/Components/ImageUploader'
import PanelLayout, { LayoutType } from '@/Layouts/PanelLayout'
import { Head, Link, useForm } from '@inertiajs/react'
import React, { useState } from 'react'
import { Alert, Button, Card, Form, Image } from 'react-bootstrap'

const CreateAnnouncement = ({ auth }) => {
    const [count, setCount] = useState(0)
    const [showUploader, setShowUploader] = useState(false)
    const { data, setData, processing, post } = useForm({
        title: '',
        content: '',
        image: ''
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route('announcements.create'))
    }

    return (
        <PanelLayout userAuth={auth} layout={LayoutType.SUPER_ADMIN} headerTitle="Create Announcement" defaultActiveLink="announcements">
            <ImageUploader closeOnComplete onCompleted={imgUrl => setData('image', imgUrl)} show={showUploader} handleClose={() => setShowUploader(false)} />
            <div className='py-3'>
                <div className="container-fluid">
                    <Card className='border-0 shadow-sm p-2 p-lg-3'>
                        <Card.Body>
                            <p className="form-text">New Announcement</p>
                            <hr />
                            <Form onSubmit={onSubmit}>
                                <div className="mb-3">
                                    <Form.Label className='text-secondary'>Title:</Form.Label>
                                    <Form.Control
                                        type='text'
                                        required
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        placeholder='Enter title here...'
                                    />
                                </div>
                                <div className="mb-3">
                                    <Form.Label className='text-secondary'>Content:</Form.Label>
                                    <textarea className='form-control' onChange={e => setData('content', e.target.value)} rows={3}></textarea>
                                </div>
                                <div className="mt-3">
                                    <Button onClick={() => setShowUploader(true)} size='sm' className='rounded-1 mb-3 btn-light-primary'>
                                        <span className='text-sm'>{data.image == '' ? 'Add' : 'Change'} Image</span>
                                    </Button>
                                    {
                                        data.image !== '' && (
                                            <>
                                                <Button onClick={() => setShowUploader(true)} size='sm' className='rounded-1 mb-3 ms-2 btn-light-secondary'>
                                                    <span className='text-sm'>Remove Image</span>
                                                </Button>
                                                <div className="col-lg-4 h-[150px] overflow-hidden p-3 border hover:shadow-inner position-relative">
                                                    <div className="cursor-pointer bg-gray-400 opacity-30 position-absolute w-full h-full top-0 left-0 hover:opacity-10 hover:shadow transition-all"></div>
                                                    <Image
                                                        src={data.image}
                                                        fluid
                                                    />
                                                </div>
                                            </>
                                        )
                                    }
                                </div>
                                <div className="text-end mt-3 flex items-center justify-end gap-3">
                                    <Link className='link link-secondary text-sm text-decoration-none' href={route('admin.announcements')}>
                                        <i className='fi fi-rr-arrow-back'></i> Cancel
                                    </Link>
                                    <Button className='rounded-1 btn-primary ' type='submit'>
                                        <div className="flex justify-center items-center gap-1">
                                            <span className="text-sm">Submit</span>
                                            <i className='bx bx-right-arrow-alt leading-none'></i>
                                        </div>
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </PanelLayout>
    )
}

export default CreateAnnouncement
