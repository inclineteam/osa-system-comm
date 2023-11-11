import ElegantNav from '@/Components/ElegantNav';
import FormInput from '@/Components/FormInput';
import AuthLayout from '@/Layouts/AuthLayout'
import { Link, router, useForm } from '@inertiajs/react';
import { GoogleLogin, hasGrantedAllScopesGoogle, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Form, Image, Spinner, Row, Container, Col, Alert } from 'react-bootstrap'

const Register = () => {
    const navList = ['Basic Info', 'Password'];
    const [firstname, setFirstname] = useState('')
    const [middlename, setMiddlename] = useState('')
    const [lastname, setLastname] = useState('')
    const [phone, setPhone] = useState('')
    const [image, setImage] = useState('')
    const [email, setEmail] = useState('')
    const [googleAccount, setGoogleAccount] = useState(null)
    const [googleAccesstoken, setGoogleAccesstoken] = useState(null)
    const [activeNavKey, setActiveNavKey] = useState(0);
    const [basicInfoError, setBasicInfoError] = useState("")
    const [isChecking, setIsChecking] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
    const [formErrors, setFormErrors] = useState({
        email: [''],
        phone: [''],
    })
    const [passwordRules, setPasswordRules] = useState([
        {
            rule: 'Your password should be at least eight characters.',
            validate: (password) => password.length > 8,
            status: 0 // 0-null,1-unmet,2-met
        },
        {
            rule: 'Your password should have at least one capital letter.',
            validate: (password) => {
                let regex = new RegExp('[A-Z]');
                return regex.test(password);
            },
            status: 0 // 0-null,1-unmet,2-met
        },
        {
            rule: 'Your password should have at least one number.',
            validate: (password) => {
                let regex = new RegExp('[0-9]');
                return regex.test(password);
            },
            status: 0 // 0-null,1-unmet,2-met
        },
    ])

    const testPassword = (password) => {
        if (password === '' || password.length <= 0) {
            resetPasswordRule()
            return;
        }
        let rules = []
        for (let r of passwordRules) {
            let rule = { ...r };
            rule.status = rule.validate(password) ? 2 : 1;
            rules.push(rule);
        }

        setPasswordRules(rules);
    }

    const resetPasswordRule = () => {
        let newRules = passwordRules.map((rule, i) => ({ ...rule, status: 0 }));
        setPasswordRules([...newRules]);
    }

    const isPasswordValid = () => {
        for (let p of passwordRules) {
            if (p.status != 2) return false;
        }

        return data.password == data.password_confirmation;
    }

    const onSubmit = (e) => {
        e.preventDefault();
        router.visit(route('super_admin.register'), {
            data: {
                email,
                firstname,
                lastname,
                middlename,
                phone,
                access_token: googleAccesstoken,
                image
            },
            method: 'post'
        });
    }

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log('response: ', tokenResponse)
            // const userInfo = await axios.get(
            //     'https://www.googleapis.com/oauth2/v3/userinfo',
            //     {
            //         headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            //         baseURL:''
            //     },
            // );
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
            console.log('user info: ',userInfo);

            setGoogleAccesstoken(tokenResponse.access_token)
            setGoogleAccount(userInfo)
            setFirstname(userInfo.given_name)
            setLastname(userInfo.family_name)
            setImage(userInfo.picture)
            setEmail(userInfo.email)

            const hasAccess = hasGrantedAllScopesGoogle(
                tokenResponse,
                'https://www.googleapis.com/auth/documents',
            );

            console.log('has access: ', hasAccess)
        },
        onError: errorResponse => console.log(errorResponse),
        flow: 'implicit',
        prompt: 'consent'
    });

    const checkBasicInfo = () => {
        if (data.firstname === '' || data.middlename === '' || data.lastname === '' || data.email === '' || data.phone === '') {
            setBasicInfoError('You need to fill everything up.')
            return;
        }
        setBasicInfoError('');
        setIsChecking(true);
        axios.post('/users/check', {
            email: data.email,
            phone: data.phone,
        })
            .then(res => {
                console.log('res: ', res);
                setIsChecking(false);
                setFormErrors({ email: [''], phone: [''] })
                setActiveNavKey(data => data + 1)
            })
            .catch(err => {
                console.log('error: ', err);
                setFormErrors(data => ({ ...data, ...err.response.data.errors }))
                setIsChecking(false);
            })
    }

    return (
        <div className="bg-[#F3F4F6] min-h-screen">
            <Container>
                <Row className='pt-lg-5 pt-3 gy-4'>
                    <Col lg={2}>
                        <Image
                            src='/images/logo.png'
                            alt='OSA Logo'
                            className='img-fluid w-[110px] h-[110px] mx-auto mb-3'
                        />
                        {/* <div className=' text-center'>Create an account to manage system.</div> */}
                        <div variant='primary' className='text-center'>
                            <i className='bx bx-info-circle'></i><br />
                            <span className="text-">Create an account to manage system.</span>
                        </div>
                    </Col>
                    <Col>
                        <div className="card mb-5 border-0 shadow-md md:min-h-max min-h-full rounded-3">
                            <div className="card-header md:p-20 p-4 bg-white">
                                <div className="text-start">

                                    <p className='my-1 text-uppercase fw-bolder'>
                                        <span className=' text-primary'>Create an Account</span>
                                    </p>
                                    <p className='my-1 text-capitalize fw-bold'>
                                        <span className=' text-secondary'>Super Admin</span>
                                    </p>
                                </div>
                            </div>
                            <div className="card-body md:p-20 p-4">
                                {/* choose google account */}
                                <div className="mb-3">
                                    <p className="mt-1 mb-3 text-black-50 text-sm">Signup with google account to continue:</p>
                                    <div className="flex items-center gap-4">
                                        <Image
                                            src='/images/google.png'
                                            width={50}
                                            height={50}
                                        />
                                        <div>
                                            {
                                                googleAccount ? (
                                                    <>
                                                        <div className="flex items-center gap-3">
                                                            <div className="">
                                                                <p className="my-0 text-sm fw-bold">
                                                                    {googleAccount ? `Continue as ${googleAccount.given_name}` : ''}
                                                                </p>
                                                                <p className="my-0 text-sm">
                                                                    {googleAccount.email}
                                                                </p>
                                                            </div>
                                                            <Image
                                                                width={30}
                                                                height={30}
                                                                src={googleAccount.picture}
                                                                roundedCircle
                                                            />
                                                        </div>
                                                        <p onClick={googleLogin} className="my-0 text-sm text-primary cursor-pointer hover:underline">
                                                            <small>Change</small>
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p onClick={googleLogin} className="my-0 text-primary cursor-pointer hover:underline">
                                                        Select a Google Account.
                                                    </p>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <Form onSubmit={onSubmit}>
                                    <p className="form-text fw-bold mt-1 mb-2">
                                        {
                                            googleAccount ? '' : 'Please select a google account to continue'
                                        }
                                    </p>
                                    <div className="mb-3">
                                        <Form.Label>Firstname:</Form.Label>
                                        <Form.Control
                                            type='text'
                                            value={firstname}
                                            onChange={e => setFirstname(e.target.value)}
                                            disabled={!googleAccount}
                                            placeholder='Enter your firstname...'
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <Form.Label>Middlename:</Form.Label>
                                        <Form.Control
                                            type='text'
                                            value={middlename}
                                            onChange={e => setMiddlename(e.target.value)}
                                            disabled={!googleAccount}
                                            placeholder='Enter your middlename...'
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <Form.Label>Lastname:</Form.Label>
                                        <Form.Control
                                            type='text'
                                            value={lastname}
                                            onChange={e => setLastname(e.target.value)}
                                            disabled={!googleAccount}
                                            placeholder='Enter your lastname...'
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <Form.Label>Phone:</Form.Label>
                                        <Form.Control
                                            type='number'
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            disabled={!googleAccount}
                                            placeholder='Enter your phone...'
                                        />
                                    </div>

                                    <div className="text-end">
                                        <br />
                                        <Button variant='primary' type='submit'>Create account <i className='bx bx-right-arrow-alt'></i></Button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div >
    )
}

export default Register
