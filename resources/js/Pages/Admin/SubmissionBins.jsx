import ConfirmModal from '@/Components/ConfirmModal'
import PanelLayout, { LayoutType } from '@/Layouts/PanelLayout'
import { Link, router } from '@inertiajs/react'
import axios from 'axios'
import { format } from 'date-fns'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { Accordion, Button, Card, Container, Dropdown, Form, Placeholder, useAccordionButton } from 'react-bootstrap'
import { toast } from 'react-toastify'

const SubmissionBins = ({ auth, submission_bins, rows, reports = [] }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [id, setId] = useState(null);
    const [processing, setProcessing] = useState(false)
    const [submissionBins, setSubmissionBins] = useState([...submission_bins])
    const [lastRowId, setLastRowId] = useState(submission_bins.length == 0 ? (0) : (submission_bins[submission_bins.length - 1]?.id));
    const [fetching, setFetching] = useState(false)
    const [searching, setSearching] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [searchedFor, setSearchedFor] = useState('')
    const [hasRows, setHasRows] = useState(rows > 10)

    const fetchSubmissionBins = () => {
        setFetching(true)
        axios.get(`/submissionBins/${lastRowId}`)
            .then((res) => {
                let bins = res.data.submissionBins;
                setLastRowId(bins[bins.length - 1].id);
                setTimeout(() => {
                    setFetching(false)
                    setSubmissionBins(prev => [...prev, ...bins])
                    setHasRows(res.data.hasRows)
                    console.log(res)
                }, 1500)
            })
    }

    const getReportsCount = (submission_bin_id) => {
        let count = 0;
        for (let report of reports) {
            if (report.submission_bin_id == submission_bin_id) {
                count++;
            }
        }

        return count;
    }

    function CustomToggle({ children, eventKey }) {
        const decoratedOnClick = useAccordionButton(eventKey, () =>
            console.log('totally custom!'),
        );

        return (
            <button
                className='col-12 bg-transparent cursor-pointer border-0 text-left py-[1.2rem] px-2'
                onClick={decoratedOnClick}
            >
                {children}
            </button>
        );
    }

    const deleteRow = (id) => {
        setId(id);
        setShowConfirmModal(true)
    }

    const onConfirmDelete = () => {
        setShowConfirmModal(false)
        if (id) {

            router.delete(route('submission_bins.delete', { id }), {
                preserveState: false
            });
        }
    }

    const onCancel = () => {
        setShowConfirmModal(false)
        setId(null);
    }

    const closeSearching = () => {
        setSearching(false)
        setSearchText("")
        setSearchResult([])
        setSearchedFor('')
    }

    const onSearchSubmit = (e) => {
        e.preventDefault()
        if (searchText.length > 0) {
            setSearching(true)
            setProcessing(true)
            axios.get(`/submissionBins/${searchText}/search`)
                .then((res) => {
                    setProcessing(false)
                    console.log('search:', res)
                    setSearchResult(res.data.submissionBins);
                    setSearchedFor(res.data.searchText)
                })
        }
    }

    console.log('rows: ', rows)

    return (
        <PanelLayout userAuth={auth} layout={LayoutType.SUPER_ADMIN} defaultActiveLink="submission_bin" headerTitle="Submission Bins">
            {
                id && (
                    <ConfirmModal
                        show={showConfirmModal}
                        handleClose={onCancel}
                        onCancel={onCancel}
                        onConfirm={onConfirmDelete}
                        title='Are you sure to delete submission bin?'
                        message='Warning, this cannot be undone'
                    />
                )
            }
            <div className='content-wrapper'>
                {
                    auth.role === 'super_admin' ? (
                        <>
                            <div className="flex justify-between items-end">
                                <div>
                                    <Link href={route('admin.create_submission_bin')} variant='primary' className='btn btn-primary rounded-pill py-2 px-3 mt-3'>
                                        <i className='bx bx-plus'></i> Create
                                    </Link>
                                    <p className="text-sm mt-3 text-secondary">This is where you can create submission bins for the accomplishment reports of unit heads.</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-sm mt-3 text-secondary">Submission bins for the accomplishment reports of unit heads.</p>
                        </>
                    )
                }
                <hr />

                <div className="mb-3">
                    <Form onSubmit={onSearchSubmit}>
                        <div className="flex">
                            <div className=" position-relative flex-1">
                                <Form.Control
                                    type='search'
                                    required
                                    value={searchText}
                                    onChange={e => setSearchText(e.target.value)}
                                    size='lg'
                                    className='shadow-sm rounded-1 border ps-5 fs-6'
                                    placeholder='Search'
                                />
                                <div className="position-absolute top-[50%] translate-y-[-50%] left-[15px!important] flex items-center">
                                    <i className='fi fi-rr-search leading-none text-secondary'></i>
                                </div>
                            </div>
                            <Button className='rounded-1' variant='secondary' type='submit'>
                                Find
                            </Button>
                        </div>
                    </Form>
                </div>
                {
                    !searching ? (
                        <Accordion defaultActiveKey="0">
                            {
                                submissionBins && submissionBins.map((item, index) => (
                                    <Card className='border-0 mb-1 shadow-sm' key={index}>
                                        <Card.Header className='bg-white'>
                                            <CustomToggle eventKey={index}>
                                                <div className="row items-center ">
                                                    <div className="col">
                                                        <div className="flex items-center gap-x-3 text-secondary">
                                                            <i className='fi fi-rr-box fs-5'></i>
                                                            <span className='fw-bold'>{item.title}</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-auto text-end">
                                                        <div className="flex justify-end items-center gap-2">
                                                            {
                                                                item.deadline_date && (
                                                                    <p className='my-0 text-sm text-secondary'>Due {format(new Date(item.deadline_date), 'MMM dd, yyyy')}</p>
                                                                )
                                                            }

                                                        </div>
                                                    </div>
                                                </div>
                                            </CustomToggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey={index}>
                                            <>
                                                <Card.Body className='p-4'>
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <p className='mt-0 mb-3 text-sm text-secondary'>
                                                                <small>Created on {format(new Date(item.created_at), 'MMM dd, yyyy')}</small>
                                                            </p>
                                                            <p className='text-sm'>{item.instruction || 'No instruction.'}</p>
                                                        </div>
                                                        {
                                                            auth.role === 'super_admin' && (
                                                                <Dropdown>
                                                                    <Dropdown.Toggle bsPrefix='toggler' className=' btn-link bg-transparent text-decoration-none'>
                                                                        <i className=' fi fi-br-menu-dots-vertical'></i>
                                                                    </Dropdown.Toggle>
                                                                    <Dropdown.Menu align="end">
                                                                        <Dropdown.Item href={route('admin.edit_submission_bin', { id: item.id })}>Edit</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => deleteRow(item.id)}>Delete</Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="flex justify-end items-center gap-4">
                                                        <div className='text-center'>
                                                            <p className='fs-3 fw-bold text-primary'>
                                                                {
                                                                    auth.role == 'super_admin' ? (
                                                                        item.approved_reports?.length ?? 0
                                                                    ) : (
                                                                        getReportsCount(item.id)
                                                                    )
                                                                }
                                                            </p>
                                                            <p className='text-sm mb-0'>Submitted</p>
                                                        </div>
                                                    </div>
                                                </Card.Body>
                                                <Card.Footer className='bg-white py-3'>
                                                    <div className="flex items-center justify-end">
                                                        {/* <Link href={route('admin.submission_bin.details',{id:item.id})} className='rounded-1 text-sm btn btn-light'>
                                                        <small>View more details</small>
                                                    </Link> */}
                                                        <Link as={'button'} disabled={auth.role === 'super_admin' ? item.approved_reports.length == 0 : getReportsCount(item.id) == 0} href={route('admin.reports.view', { submission_bin_id: item.id })} className='rounded-1 text-sm btn btn-primary'>
                                                            <small>View Reports</small>
                                                        </Link>
                                                    </div>
                                                </Card.Footer>
                                            </>
                                        </Accordion.Collapse>
                                    </Card>
                                ))
                            }
                        </Accordion>
                    ) : (
                        <>
                            <Button onClick={closeSearching} disabled={processing} variant='outline-success' className='rounded-pill mb-3 text-sm' type='button'>
                                {
                                    !processing ? (
                                        <>
                                            <span className='text-sm'>
                                                Search Result: {searchedFor}
                                            </span>
                                            <i className='bx bx-x'></i>
                                        </>
                                    ) : (
                                        <span className='text-sm'>
                                            Searching...
                                        </span>
                                    )
                                }

                            </Button>
                            {
                                searchResult.length > 0 ? (
                                    <Accordion defaultActiveKey="0">
                                        {
                                            searchResult && searchResult.map((item, index) => (
                                                <Card className='border-0 mb-1 shadow-sm' key={index}>
                                                    <Card.Header className='bg-white'>
                                                        <CustomToggle eventKey={index}>
                                                            <div className="row items-center ">
                                                                <div className="col">
                                                                    <div className="flex items-center gap-x-3 text-secondary">
                                                                        <i className='fi fi-rr-box fs-5'></i>
                                                                        <span className='fw-bold'>{item.title}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-auto text-end">
                                                                    <div className="flex justify-end items-center gap-2">
                                                                        {
                                                                            item.deadline_date && (
                                                                                <p className='my-0 text-sm text-secondary'>Due {format(new Date(item.deadline_date), 'MMM dd, yyyy')}</p>
                                                                            )
                                                                        }

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CustomToggle>
                                                    </Card.Header>
                                                    <Accordion.Collapse eventKey={index}>
                                                        <>
                                                            <Card.Body className='p-4'>
                                                                <div className="flex justify-between">
                                                                    <div>
                                                                        <p className='mt-0 mb-3 text-sm text-secondary'>
                                                                            <small>Created on {format(new Date(item.created_at), 'MMM dd, yyyy')}</small>
                                                                        </p>
                                                                        <p className='text-sm'>{item.instruction || 'No instruction.'}</p>
                                                                    </div>
                                                                    {
                                                                        auth.role === 'super_admin' && (
                                                                            <Dropdown>
                                                                                <Dropdown.Toggle bsPrefix='toggler' className=' btn-link bg-transparent text-decoration-none'>
                                                                                    <i className=' fi fi-br-menu-dots-vertical'></i>
                                                                                </Dropdown.Toggle>
                                                                                <Dropdown.Menu align="end">
                                                                                    <Dropdown.Item href={route('admin.edit_submission_bin', { id: item.id })}>Edit</Dropdown.Item>
                                                                                    <Dropdown.Item onClick={() => deleteRow(item.id)}>Delete</Dropdown.Item>
                                                                                </Dropdown.Menu>
                                                                            </Dropdown>
                                                                        )
                                                                    }
                                                                </div>
                                                                <div className="flex justify-end items-center gap-4">
                                                                    <div className='text-center'>
                                                                        <p className='fs-3 fw-bold text-primary'>
                                                                            {
                                                                                auth.role == 'super_admin' ? (
                                                                                    item.approved_reports?.length ?? 0
                                                                                ) : (
                                                                                    item.reports?.length ?? 0
                                                                                )
                                                                            }
                                                                        </p>
                                                                        <p className='text-sm mb-0'>Submitted</p>
                                                                    </div>
                                                                </div>
                                                            </Card.Body>
                                                            <Card.Footer className='bg-white py-3'>
                                                                <div className="flex items-center justify-end">
                                                                    {/* <Link href={route('admin.submission_bin.details',{id:item.id})} className='rounded-1 text-sm btn btn-light'>
                                                        <small>View more details</small>
                                                    </Link> */}
                                                                    <Link as={'button'} disabled={item.reports.length == 0} href={route('admin.reports.view', { submission_bin_id: item.id })} className='rounded-1 text-sm btn btn-primary'>
                                                                        <small>View Reports</small>
                                                                    </Link>
                                                                </div>
                                                            </Card.Footer>
                                                        </>
                                                    </Accordion.Collapse>
                                                </Card>
                                            ))
                                        }
                                    </Accordion>
                                ) : (
                                    <p className='text-center'>Nothing found.</p>
                                )
                            }
                        </>
                    )
                }
                {
                    (!submission_bins || submission_bins.length == 0) && (
                        <p>No submission bin to show.</p>
                    )
                }
                {
                    fetching && (
                        <>
                            <Placeholder as="div" animation='wave' className="my-0 ">
                                <div className="col-12 bg-white shadow-sm h-[60px]">
                                    <Container>
                                        <Placeholder as="p" animation='wave' className="my-0 ">
                                            <Placeholder xs={5} bg="light" />
                                        </Placeholder>
                                    </Container>
                                </div>
                            </Placeholder>
                        </>
                    )
                }
                {
                    !searching && hasRows && (
                        <div className="text-center my-2">
                            <Button disabled={fetching} variant='light' className='text-primary fw-bold' onClick={fetchSubmissionBins}>
                                {fetching ? 'Load more...' : 'Load more'}
                            </Button>
                        </div>
                    )
                }

            </div>
        </PanelLayout>
    )
}

export default SubmissionBins
