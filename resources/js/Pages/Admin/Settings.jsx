import ApplicationLogo from '@/Components/ApplicationLogo';
import CardComponent from '@/Components/CardComponent';
import ContentWrapper from '@/Components/ContentWrapper';
import PanelLayout from '@/Layouts/PanelLayout'
import { Head, useForm } from '@inertiajs/react';
import React from 'react'
import { useState } from 'react'
import { Button, Card, Form, Image } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import { toast } from 'react-toastify';

const Settings = ({ settings }) => {
    const [files, setFiles] = useState([]);
    const [logo, setLogo] = useState(settings?.logo);
    const [isUploading, setIsUploading] = useState(false)
    const { data, setData, patch } = useForm({
        logo: settings.logo,
        policy: settings.policy ?? ''
    })

    const onLogoSelect = (e) => {
        if (e.target.files.length > 0) {
            let file = e.target.files[0];
            let formData = new FormData();
            formData.append('image', file);
            setIsUploading(true);
            axios.post(
                '/image-upload',
                formData,
                {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                }
            )
                .then((res) => {
                    setData('logo', res.data.imageUrl)
                    setIsUploading(false)

                })
                .catch((err) => {
                    console.error('error uploading image: ', err);
                    setIsUploading(false)
                })
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        patch(route('settings.update', { id: settings.id }))
    }

    return (
        <PanelLayout
            headerTitle={(
                <div className='flex items-center gap-2'>
                    <i className='fi fi-rr-settings'></i>
                    <span>Settings</span>
                </div>
            )}
            defaultActiveLink={"settings"}
        >
            <Head title='Settings' />
            <div className='content-wrapper'>
                <Card className='border-0 shadow-sm'>
                    <Card.Body className='p-lg-4 p-3'>
                        <Form onSubmit={onSubmit}>
                            <Image
                                src={data.logo}
                                width={110}
                                fluid
                                className='mb-3'
                            />
                            <Form.Label className=' text-dark fw-semibold'>
                                {isUploading ? "Uploading image..." : "App Logo:"}
                            </Form.Label>
                            <div className="flex mb-4">
                                <Form.Control
                                    disabled={isUploading}
                                    onChange={onLogoSelect}
                                    type='file'
                                />
                                <Button
                                    type='button'
                                    variant='secondary'
                                    onClick={() => {
                                        setLogo(settings?.logo)
                                    }}
                                >
                                    Reset
                                </Button>
                            </div>
                            <div className="mb-3">
                                <Form.Label className='fw-bold'>Privacy Policy</Form.Label>
                                {/* <textarea
                                    value={data.policy}
                                    onChange={e => setData('policy',e.target.value)}
                                    className='form-control'
                                    rows={10}
                                >
                                </textarea> */}
                                <ReactQuill theme="snow" value={data.policy} onChange={(value) => setData('policy',value)} />
                            </div>

                            <hr />
                            <div className=" mt-3">
                                <Button className="rounded-1" variant='primary' type='submit'>
                                    Save Changes
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </div>

        </PanelLayout>
    )
}

export default Settings
