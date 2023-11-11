import ElegantNav from '@/Components/ElegantNav'
import HeaderTitle from '@/Components/HeaderTitle'
import TextProfilePic from '@/Components/TextProfilePic'
import UnitHeadReportCard from '@/Components/UnitHeadReportCard'
import PanelLayout from '@/Layouts/PanelLayout'
import { router, usePage } from '@inertiajs/react'
import axios from 'axios'
import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Image, ListGroup, ListGroupItem, Placeholder, Row, Spinner } from 'react-bootstrap'
import DataTable from 'react-data-table-component'

const ViewReports = ({ submissionBin, campuses }) => {
    const { auth } = usePage().props;
    const [selectedCampus, setSelectedCampus] = useState(auth.role === 'admin' ? auth.user.campus : campuses[0])
    const [reports, setReports] = useState([]);
    const [fetchingReports, setFetchingReports] = useState(false)
    const [fetchingUnitHeads, setFetchingUnitHeads] = useState(true)
    const [unitHeads, setUnitHeads] = useState([])
    const [selectedUnitHead, setSelectedUnitHead] = useState(null)
    const tableColumns = [
        {
            name: "Unit Head",
            selector: row => row.unit_head.firstname + " " + row.unit_head.lastname,
        },
    ];
    const fetchReports = async () => {
        setFetchingReports(true)
        var reports = {};

        if (auth.role === 'admin') {
            reports = await axios.get(`/reports/${selectedCampus.id}/${submissionBin.id}/${selectedUnitHead.id}/all`);
        } else {
            // if superadmin only get reports that were approved
            reports = await axios.get(`/reports/${selectedCampus.id}/${submissionBin.id}/${selectedUnitHead.id}/approved`);
        }
        console.log('reports: ', reports)
        let unitHeads = await axios.get(`/reports/${selectedCampus.id}/unit_heads`);

        setReports(reports?.data?.reports || [])
        setUnitHeads(unitHeads.data.unitHeads)
        setFetchingReports(false)
    }

    useEffect(() => {
        const getUnitHeads = async () => {
            setFetchingUnitHeads(true)
            let unitHeads = await axios.get(`/reports/${selectedCampus.id}/unit_heads`);
            setUnitHeads(unitHeads.data.unitHeads)
            if (unitHeads.data.unitHeads.length > 0 && selectedUnitHead == null) {
                setSelectedUnitHead(unitHeads.data.unitHeads[0])
            }
            setFetchingUnitHeads(false)
        }

        getUnitHeads();
    }, [selectedCampus])

    useEffect(() => {
        if (selectedUnitHead) {
            fetchReports();
        }
    }, [selectedCampus, selectedUnitHead]);

    const openReport = (report) => {
        router.visit(route('admin.report.open', { report_id: report.id }))
    }

    return (
        <PanelLayout
            pageTitle='View Reports'
            defaultActiveLink="submission-bins"
            headerTitle={(

                <HeaderTitle backButton text='Unit Head Report' />
            )}>

            <div className="content-wrapper">
                <Card className='mb-3 border-0 shadow-sm rounded-0'>
                    <Card.Body>
                        <p className='flex items-center text-lg my-0'>
                            <i className='fi fi-rr-box me-2'></i>
                            {submissionBin.title}
                        </p>
                        <div className="text-secondary">
                            {
                                submissionBin.deadline_date ? (
                                    <p className="text-sm mt-3 mb-0">
                                        Due {format(new Date(submissionBin.deadline_date), 'MMM d, Y / hh:mm aaa')}
                                    </p>
                                ) : (
                                    <p className='mt-3 mb-0 text-sm'>
                                        No deadline.
                                    </p>
                                )
                            }
                        </div>
                        <hr />

                        {
                            submissionBin.instruction ? (
                                <>
                                    <p className='text-sm text-secondary my-1'>
                                        {submissionBin.instruction}
                                    </p>
                                </>
                            ) : (
                                <p className='text-sm text-black-50 my-1'>
                                    No instruction.
                                </p>
                            )
                        }
                    </Card.Body>
                </Card>
                <Card className='border-0 shadow-sm rounded-0'>
                    <Card.Body className='p-lg-4'>
                        {
                            auth.role === 'super_admin' && (
                                <>
                                    <p className="form-text mb-2 text-secondary">Campus</p>

                                    <div className="w-100 border shadow-sm custom-scroll bg-white overflow-auto">
                                        <ElegantNav
                                            list={campuses}
                                            selector={item => item.name}
                                            selectedItem={selectedCampus}
                                            handleSelect={(campus) => setSelectedCampus(campus)}
                                        />
                                    </div>
                                </>
                            )

                        }
                        <div className=" mt-3">
                            <Row className='gy-3'>
                                <Col className='order-1 order-lg-0'>
                                    <p className='fw-bold mb-0'>
                                        {selectedCampus.name} Campus
                                    </p>
                                    <p className='mt-0 text-sm'>
                                        <small>Unit Head Reports / All</small>
                                    </p>
                                    <Row>
                                        {
                                            fetchingReports ? (
                                                <>
                                                    <Col lg={3}>
                                                        <Placeholder animation='wave'>
                                                            <div className='bg-light w-100 h-[180px]'></div>
                                                        </Placeholder>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <Placeholder animation='wave'>
                                                            <div className='bg-light w-100 h-[180px]'></div>
                                                        </Placeholder>
                                                    </Col>

                                                </>
                                            ) : (
                                                reports.length > 0 ? (
                                                    reports.map((report, index) => (
                                                        <Col lg={3} key={index}>
                                                            <UnitHeadReportCard handleClick={() => openReport(report)} data={report} />
                                                        </Col>
                                                    ))
                                                ) : (
                                                    <p className='text-sm text-secondary'>Nothing to show.</p>
                                                )
                                            )
                                        }
                                    </Row>
                                </Col>
                                <Col lg={3} className='order-0 order-lg-1'>
                                    <p className='text-sm fw-bold'>Unit Heads</p>
                                    <p className='mt-0 text-sm mb-0'></p>
                                    {
                                        fetchingUnitHeads ? (
                                            <>
                                                <Placeholder animation='wave'>
                                                    <Placeholder bg='light' xs={12} />
                                                </Placeholder>
                                                <Placeholder animation='wave'>
                                                    <Placeholder bg='light' xs={12} />
                                                </Placeholder>
                                                <Placeholder animation='wave'>
                                                    <Placeholder bg='light' xs={12} />
                                                </Placeholder>
                                            </>

                                        ) : (
                                            unitHeads.length > 0 ? (
                                                <div className=' max-h-[300px] overflow-y-auto'>
                                                    {
                                                        unitHeads.map((unitHead, index) => (
                                                            <div key={index} className='text-sm px-0 w-max mb-3'>
                                                                <div
                                                                    onClick={() => setSelectedUnitHead(unitHead)}
                                                                    className={`flex gap-2 items-center py-2 px-2 rounded-pill cursor-pointer ${unitHead.id == selectedUnitHead?.id ? 'bg-light-primary' : ''}`}
                                                                >
                                                                    {
                                                                        unitHead.image ? (
                                                                            <Image
                                                                                src={unitHead.image}
                                                                                width={30}
                                                                                height={30}
                                                                                roundedCircle
                                                                            />
                                                                        ) : (
                                                                            <TextProfilePic size='sm' text={`${unitHead.firstname[0]} ${unitHead.lastname[0]}`} bg='light' className="text-primary fw-bold" />
                                                                        )
                                                                    }
                                                                    <p className="my-0">
                                                                        {unitHead.firstname} {unitHead.lastname}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }

                                                </div>
                                            ) : (
                                                <p className='text-sm text-secondary'>Nothing to show.</p>
                                            )
                                        )
                                    }
                                </Col>
                            </Row>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </PanelLayout >
    )
}

export default ViewReports
