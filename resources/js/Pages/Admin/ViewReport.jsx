import CommentsView from '@/Components/CommentsView';
import FileIcon from '@/Components/FileIcon';
import HeaderTitle from '@/Components/HeaderTitle';
import { formatDate } from '@/Components/Helper';
import ModalComponent from '@/Components/ModalComponent';
import TextProfilePic from '@/Components/TextProfilePic';
import PanelLayout from '@/Layouts/PanelLayout'
import { Head, useForm, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react'
import { Button, Card, Col, Dropdown, Form, Image, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import DocViewer, { DocViewerRenderers, PDFRenderer } from 'react-doc-viewer';

const ViewReport = ({ report }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const { prevPage, auth } = usePage().props
    const [showFileModal, setShowFileModal] = useState(false)
    const [showStatusModal, setShowStatusModal] = useState(false)
    // const [status, setStatus] = useState(report.status)

    const { data, setData, patch } = useForm({
        status: report.status
    })

    const updateStatus = (e) => {
        e.preventDefault();
        patch(route('reports.status.update', { id: report.id }));
    }

    console.log(report)

    useEffect(() => {
        setSelectedFile(report.attachments[0]);
    }, [])

    return (
        <PanelLayout
            headerTitle={(
                <HeaderTitle
                    text={report.submission_bin.title}
                    backButton
                    backButtonLink={route('admin.reports.view', { submission_bin_id: report.submission_bin.id })}
                />
            )}
            defaultActiveLink="submission-bins"
        >
            <ModalComponent
                className={"rounded-0 bg-transparent"}
                bodyClassname='p-0 overflow-hidden'
                show={showFileModal}
                handleClose={() => {
                    setShowFileModal(s => !s)
                }}
                closeButton
                title={selectedFile?.name}
                size='fullscreen'
            >
                <hr className='my-1' />
                {
                    selectedFile && (
                        <DocViewer
                            style={{ maxHeight: '100% !important', height: "100%" }}
                            pluginRenderers={DocViewerRenderers}
                            documents={[
                                { uri: selectedFile.uri }
                            ]}
                            config={
                                {
                                    zoom: 0.5,
                                    header: {
                                        disableHeader: true
                                    }
                                }
                            }

                            theme={{
                                primary: "#5296d8",
                                secondary: "#ffffff",
                                tertiary: "#5296d899",
                                text_primary: "#ffffff",
                                text_secondary: "#5296d8",
                                text_tertiary: "#00000099",
                                disableThemeScrollbar: false,
                            }}
                        />


                    )
                }
            </ModalComponent>
            <Head title={report.unit_head.firstname + " " + report.unit_head.lastname + ' | ' + report.submission_bin.title} />
            <div className="content-wrapper">
                <Row className=' bg-transparent gy-2 gx-2'>
                    <Col>
                        <Card className='border-0 shadow-sm rounded-0 p-2 mb-2'>
                            <Card.Body className='h-100'>
                                <div className="flex justify-between items-center">
                                    <p className='text-sm fw-bolder my-0 col-4'>Submitted By</p>
                                    <div className="flex">
                                        {
                                            auth.role === 'admin' && (
                                                <>
                                                    <Dropdown>
                                                        <Dropdown.Toggle
                                                            variant={'light'}
                                                            // className='rounded-0'
                                                            bsPrefix='null'
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span className='fw-bold'>{data.status}</span>
                                                                <span className='bx bx-chevron-down leading-none'></span>
                                                            </div>
                                                            {/* <div className="flex gap-2">
                                                    <div className="text-sm my-0 fw-bold ">
                                                        <span className='me-2 text-dark'>Status:</span>
                                                        <span className='text-purple'>{data.status}</span>
                                                    </div>
                                                    <span className='bx bx-pencil'></span>
                                                </div> */}
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            {
                                                                ['Pending', 'Approved', 'Rejected']
                                                                    .map((status, index) => (
                                                                        <>
                                                                            <Dropdown.Item as={"p"} className='mb-2 cursor-pointer' onClick={() => setData('status', status)} key={index}>{status}</Dropdown.Item>
                                                                        </>
                                                                    ))
                                                            }
                                                        </Dropdown.Menu>
                                                    </Dropdown>

                                                    {
                                                        data.status !== report.status && (
                                                            <div className='ms-3 flex gap-1'>
                                                                <Button size='sm' onClick={updateStatus} variant='light-success'>Save</Button>
                                                                <Button size='sm' onClick={() => {
                                                                    setData('status', report.status)
                                                                }}
                                                                    variant='light-secondary'
                                                                >
                                                                    Discard Changes
                                                                </Button>
                                                            </div>
                                                        )
                                                    }
                                                </>
                                            )
                                        }

                                        {
                                            auth.role === 'super_admin' && (
                                                <div className='text-end'>
                                                    {
                                                        report.status === 'Approved' ? (
                                                            <>
                                                                <p className={`text-success fw-bold my-0`}>
                                                                    <i className='bx bxs-check-circle me-2'></i>
                                                                    {report.status}
                                                                </p>
                                                                <p className={`text-sm my-0 ${report.remarks.toLowerCase() == 'submitted on time' ? 'text-success' : 'text-danger'}`}>
                                                                    <small>{report.remarks}</small>
                                                                </p>
                                                            </>
                                                        ) : (
                                                            <p className={`text-secondary fw-bold my-0`}>
                                                                {report.status}
                                                            </p>
                                                        )
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                                <hr />
                                <div className='flex gap-x-4 w-100'>
                                    <div>
                                        {
                                            report.unit_head.image ? (
                                                <Image
                                                    src={report.unit_head.image}
                                                    width={50}
                                                    height={50}
                                                    roundedCircle
                                                />
                                            ) : (
                                                <TextProfilePic className="text-light" size='sm' text={report.unit_head.firstname[0]} />
                                            )
                                        }
                                    </div>
                                    <div className='w-100 '>
                                        <p className="my-0 fw-bold">{report.unit_head.firstname + ' ' + report.unit_head.lastname}</p>
                                        <p className="my-0 text-secondary text-sm">
                                            <small>Unit Head</small>
                                        </p>
                                        {/* <hr className='my-1' /> */}
                                        {/* <p className=' mt-2 mb-0 text-sm text-dark'>
                                            {report.unit_head.campus.name} Campus
                                        </p> */}
                                    </div>
                                </div>

                                <ListGroup className='mt-2' variant='flush'>
                                    <ListGroupItem className='px-0'>
                                        <p className='my-1 text-dark text-sm'>
                                            <span className='text-secondary'>Campus:</span> <strong>{report.unit_head.campus.name} </strong>
                                        </p>
                                    </ListGroupItem>
                                    <ListGroupItem className='px-0'>
                                        <p className='my-1 text-dark text-sm'>
                                            <span className='text-secondary'>Designation:</span> <strong>{report.unit_head.designation.name} </strong>
                                        </p>
                                    </ListGroupItem>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                        <Card className='border-0 shadow-sm rounded-0 p-2 mb-2'>
                            <Card.Body className='h-100'>
                                <p className='text-sm text-danger fw-bold mb-1'>Attachments</p>
                                {
                                    report.is_submitted? (
                                        <>
                                            {
                                                auth.role === 'super_admin' ? (
                                                    report.status === 'Approved' ? (
                                                        <p className='text-sm text-secondary my-0 fw-bold'>
                                                            <span>Submitted on {formatDate(new Date(report.date_submitted))}</span>
                                                        </p>
                                                    ) : null
                                                ) : (
                                                    <p className='text-sm text-secondary my-0 fw-bold'>
                                                        <span>Submitted on {formatDate(new Date(report.date_submitted))}</span>
                                                    </p>
                                                )
                                            }
                                        </>
                                    ):null
                                }
                                <hr />
                                <div className="">
                                    {
                                        auth.role === 'admin' ? (
                                            <div className="row g-3">
                                                {
                                                    report.attachments.length == 0 && (
                                                        <p>No submission yet.</p>
                                                    )
                                                }
                                                {
                                                    report.attachments.map((att, index) => (
                                                        // <ListGroupItem key={index} className={` cursor-pointer ${att.id === selectedFile.id ? 'bg-light-primary rounded-1' : ''}`} onClick={() => setSelectedFile(att)}>
                                                        //     {att.name}
                                                        // </ListGroupItem>
                                                        <Col key={index} xl={2} lg={3} sm={4} xs={6}>
                                                            <div onClick={() => {
                                                                setSelectedFile(att)
                                                                setShowFileModal(true)
                                                            }} className={`text-center rounded p-3 cursor-pointer ${selectedFile?.id === att.id ? 'bg-light' : ''}`} title={att.name}>
                                                                <FileIcon
                                                                    file={att}
                                                                    className={"mx-auto"}
                                                                    size='sm'
                                                                />
                                                                <p className="text-center mt-3 mb-0 col-11 text-sm text-truncate">
                                                                    <small>{att.name}</small>
                                                                </p>
                                                            </div>
                                                        </Col>
                                                    ))
                                                }

                                            </div>
                                        ) : (
                                            <>
                                                {
                                                    report.status === 'Approved' ? (
                                                        <div className="row g-3">
                                                            {
                                                                report.attachments.length == 0 && (
                                                                    <p>No submission yet.</p>
                                                                )
                                                            }
                                                            {
                                                                report.attachments.map((att, index) => (
                                                                    // <ListGroupItem key={index} className={` cursor-pointer ${att.id === selectedFile.id ? 'bg-light-primary rounded-1' : ''}`} onClick={() => setSelectedFile(att)}>
                                                                    //     {att.name}
                                                                    // </ListGroupItem>
                                                                    <Col key={index} xl={2} lg={3} sm={4} xs={6}>
                                                                        <div onClick={() => {
                                                                            setSelectedFile(att)
                                                                            setShowFileModal(true)
                                                                        }} className={`text-center rounded p-3 cursor-pointer ${selectedFile?.id === att.id ? 'bg-light' : ''}`} title={att.name}>
                                                                            <FileIcon
                                                                                file={att}
                                                                                className={"mx-auto"}
                                                                                size='sm'
                                                                            />
                                                                            <p className="text-center mt-3 mb-0 col-11 text-sm text-truncate">
                                                                                <small>{att.name}</small>
                                                                            </p>
                                                                        </div>
                                                                    </Col>
                                                                ))
                                                            }

                                                        </div>
                                                    ) : (
                                                        <p>No submission yet.</p>
                                                    )
                                                }
                                            </>
                                        )
                                    }
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xl={3} md={4} className=' '>
                        <Card className='border-0 shadow-sm  rounded-0'>
                            <Card.Body className='p-4 '>
                                <p className='text-sm fw-bold text-primary'>Private Comments</p>
                                <hr />
                                <CommentsView report={report} user={auth.user} submissionBin={report.submission_bin} unitHead={report.unit_head} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </PanelLayout>
    )
}

export default ViewReport
