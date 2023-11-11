import AppLayout from '@/Layouts/AppLayout'
import { Alert, Container, Form, Image, Spinner } from 'react-bootstrap'
import React from 'react'
import { Link, router } from '@inertiajs/react'
import CustomSelectDropdown from '@/Components/SignInDropdownButton'
import { useState } from 'react'
import GoogleSignInButton from '@/Components/GoogleSignInButton'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import ModalComponent from '@/Components/ModalComponent'
import { ToastContainer, toast } from 'react-toastify'

const Welcome = () => {
    const [userType, setUserType] = useState(null);
    const [showProgressModal, setShowProgressModal] = useState(false)
    const [signinError, setSigninError] = useState('')

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log('tokenResponse: ', tokenResponse)
            setShowProgressModal(true)
            setSigninError('')
            try {
                const userInfo = await new Promise(resolve => {
                    const xhr = new XMLHttpRequest();

                    xhr.open('GET', `https://www.googleapis.com/oauth2/v3/userinfo`);
                    xhr.setRequestHeader('Authorization', `Bearer ${tokenResponse.access_token}`)
                    xhr.onload = function () {
                        if (this.status >= 200 && this.status < 300)
                            resolve(JSON.parse(this.responseText));
                        else resolve({ err: '404' });
                    };
                    xhr.send();
                });

                axios.post('/users/check', {
                    type: userType.value,
                    email: userInfo.email,
                }).then((res) => {
                    console.log('res: ', res)
                    setTimeout(() => setShowProgressModal(false), 1200)
                    if (res.data.success) {
                        router.visit(route('users.login'), {
                            method: 'post',
                            data: {
                                type: userType.value,
                                email: userInfo.email,
                                access_token: tokenResponse.access_token,
                                image: userInfo.picture
                            }
                        })
                        setSigninError('')
                    } else {
                        setTimeout(() => setSigninError("Sorry that account is not registered in our system."), 1200)
                    }
                })
                    .catch((err) => {
                        console.log(err)
                        setShowProgressModal(false)
                        setSigninError(err.message)
                    })
            } catch (error) {
                setTimeout(() => {
                    setShowProgressModal(false)
                    setSigninError("Something went wrong, please try again later!");
                }, 1000)
            }

        },
        onError: errorResponse => {
            console.log(errorResponse)
            setShowProgressModal(false)
            setSigninError(errorResponse.error_description)
        },
    });


    return (
        <AppLayout>
            <ToastContainer hideProgressBar autoClose={1500} theme="dark" position="bottom-right" />
            <ModalComponent backdrop="static" centered handleClose={() => setShowProgressModal(false)} show={showProgressModal} size='sm'>
                <div className="text-center">
                    <p className='my-0 fw-bold'>You are signing in as {userType?.value == 'super_admin' ? 'Super Admin' : (userType?.value == 'admin' ? 'Admin' : 'Unit Head')}</p>
                    <div className='mt-2 text-secondary text-sm mb-0 flex items-center justify-center gap-2'>
                        <span>Please wait</span>
                        <Spinner variant='secondary' size='sm' />
                    </div>
                </div>
            </ModalComponent>
            <Container>
                <div className="mt-4">
                    <div className="col-md-6 mx-auto">
                        <div className="text-center">
                            <Image
                                src='/images/logo.png'
                                fluid
                                width={174}
                                height={174}
                                className='mx-auto'
                            />
                            <p className="fs-3 fw-bold mt-3 mb-1">Laguna State Polytechnic University</p>
                            <p className='mb-5'>Sign in to system</p>

                            <CustomSelectDropdown
                                className="col-xl-7 col-lg-10   mx-auto"
                                placeholder='Select one...'
                                handleSelect={item => {
                                    setSigninError("")
                                    setUserType(item)
                                }}
                                menu={[
                                    { value: 'unit_head', text: 'Sign in as Unit Head' },
                                    { value: 'admin', text: 'Sign in as Campus Admin' },
                                    { value: 'super_admin', text: 'Sign in as Super Admin' },
                                ]}
                            />
                            <GoogleSignInButton
                                onClick={() => {
                                    if (userType) {
                                        googleLogin()
                                    } else {
                                        // toast.warning('You need to select a user type first!');
                                        setSigninError('You need to select a user type first!')
                                    }
                                }}
                                className="col-xl-7 col-lg-10 mt-4 mx-auto mb-5"
                            />

                            <div className="text-center">
                                {/* <p className='my-0 text-danger fw-bold'>{signinError}</p> */}
                                {
                                    signinError && (
                                        <Alert variant='danger' className='col-xl-7 col-lg-10 mx-auto text-sm shadow'>
                                            <div className="flex items-center gap-2 justify-center">
                                                <span className='fw-bold'>{signinError}</span>
                                            </div>
                                        </Alert>
                                    )
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </Container>
        </AppLayout>
    )
}

export default Welcome
