import AdminDashboard from '@/Components/AdminDashboard';
import ContentWrapper from '@/Components/ContentWrapper';
import NavbarComponent from '@/Components/Navbar';
import SuperAdminDashboard from '@/Components/SuperAdminDashboard';
import UnitHeadDashboard from '@/Components/UnitHeadDashboard';
import AppLayout from '@/Layouts/AppLayout';
import PanelLayout, { LayoutType } from '@/Layouts/PanelLayout';
import { useThemeState } from '@/States/States';
import { Link, Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Alert, Card, Col, Row } from 'react-bootstrap';


export default function Dashboard({ auth }) {
    return (
        <PanelLayout userAuth={auth} defaultActiveLink="dashboard">
            <div className='content-wrapper'>
                {
                    auth.role === 'unit_head' ? (
                        <UnitHeadDashboard />
                    ) : (
                        auth.role === 'admin' ? (
                            <AdminDashboard />
                        ) : (
                            <SuperAdminDashboard />
                        )
                    )
                }
            </div>
        </PanelLayout>
    );
}
