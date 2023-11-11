import PanelLayout from '@/Layouts/PanelLayout'
import { Link } from '@inertiajs/react';
import React from 'react'
import { Button } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

const Feedbacks = ({ feedbacks = [] }) => {

    const columns = [
        {
            name: 'Type',
            selector: row => row.type
        },
        {
            name: 'Reaction',
            selector: row => row.reaction
        },
        {
            name: 'Comment',
            selector: row => row.comment
        },
        {
            name: 'User',
            selector: row => row.user.firstname + " " + row.user.lastname
        },
        // {
        //     name: 'Action',
        //     cell: row => (
        //         <div className='flex gap-2'>
        //             <Button
        //                 as={Link}
        //                 variant='light-danger'
        //                 size='sm'
        //                 href=''
        //             >
        //                 <i className='fi fi-rr-trash'></i>
        //             </Button>
        //         </div>
        //     )
        // }
    ];

    return (
        <PanelLayout
            headerTitle="Feedbacks"
        >
            <div className="content-wrapper">
                <DataTable
                    columns={columns}
                    pagination
                    data={feedbacks}
                />
            </div>
        </PanelLayout>
    )
}

export default Feedbacks
