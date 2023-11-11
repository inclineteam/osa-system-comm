import CardComponent from '@/Components/CardComponent'
import PanelLayout from '@/Layouts/PanelLayout'
import { Link, useForm } from '@inertiajs/react'
import React from 'react'
import { Button, Card, Container, Form } from 'react-bootstrap'

const CreateSubmissionBin = () => {
    const { post, processing, data, setData } = useForm({
        title: '',
        instruction: '',
        deadline_date: '',
        deadline_time: '',
    })

    const onSubmit = (e) => {
        e.preventDefault();
        post(route('submission_bins.create'))
    }

    return (
        <PanelLayout defaultActiveLink="submission-bins" headerTitle="Submission Bins">
            <div className='content-wrapper'>
                <CardComponent>
                    <Card.Body>
                        <Form onSubmit={onSubmit}>
                            <div className="flex mb-4 gap-2 flex-wrap justify-content-between">
                                <p className='flex items-center gap-2 my-1 me-auto fw-bolder'>
                                    <i className='fi fi-rr-box'></i>
                                    <span>New Submission Bin</span>
                                </p>

                            </div>
                            <div className="mb-3">
                                <Form.Label>Title:</Form.Label>
                                <Form.Control
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    type='text'
                                />
                            </div>
                            <div className="mb-3">
                                <Form.Label>Instruction:</Form.Label>
                                <textarea className='form-control' rows={8} value={data.instruction} onChange={e => setData('instruction', e.target.value)} />
                            </div>
                            <hr />
                            <div className="mb-3">
                                <p className='fw-bold mb-2'>Deadline of submission</p>
                                <div className="row">
                                    <div className="col-md">
                                        <Form.Label>Date:</Form.Label>
                                        <Form.Control
                                            type='date'
                                            value={data.deadline_date}
                                            onChange={e => setData('deadline_date', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md">
                                        <Form.Label>Time:</Form.Label>
                                        <Form.Control
                                            type='time'
                                            value={data.deadline_time}
                                            onChange={e => setData('deadline_time', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <br />
                            <div className='flex gap-2 justify-end'>
                                <Link disabled={processing} href={route('admin.submission_bins')} className="btn btn-light">
                                    Cancel
                                </Link>
                                <Button disabled={processing} variant='primary' size='md' type='submit'>
                                    Submit <i className=' bx bx-right-arrow-alt'></i>
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </CardComponent>
            </div>
        </PanelLayout>
    )
}

export default CreateSubmissionBin
