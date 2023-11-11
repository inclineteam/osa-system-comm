import React, { useEffect, useState } from 'react'
import { Nav } from 'react-bootstrap'
import SidebarComponent, { NavType } from './SidebarComponent'
import { Link, usePage } from '@inertiajs/react'
import axios from 'axios'
import FeedBackModal from './FeedBackModal'
import { useNavMenuLoadedState, useNavMenuState } from '@/States/States'
import NavDownloadable from './NavDownloadable'

const AdminSidebar = ({ isActive, activeLink, setShowFeedbackModal }) => {
    const url = window.location.href;
    const [classifications, setClassifications] = useState([])
    const { navList, setNavList } = useNavMenuState()
    const { isLoaded, setIsLoaded } = useNavMenuLoadedState()
    const { auth } = usePage().props;
    const menu = [
        {
            type: NavType.LINK,
            text: 'Dashboard',
            icon: <i className="fi fi-rr-apps"></i>,
            href: route('admin.dashboard'),
            urlPath: 'dashboard',
        },
        {
            type: NavType.DROPDOWN,
            text: 'Document Tracking',
            icon: <i className='fi fi-rs-search-alt'></i>,
            key: 'document-tracking',
            opened: false,
            active: false,
            navList: [
                {
                    type: NavType.LINK,
                    text: 'Submission Bin',
                    icon: <i className='fi fi-rr-box'></i>,
                    href: route('admin.submission_bins')
                },
                {
                    type: NavType.DROPDOWN,
                    text: 'Reports',
                    icon: <i className='fi fi-rr-document'></i>,
                    key: 'reports',
                    active: false,
                    opened: false,
                    navList: []
                }
            ]
        },
        {
            type: NavType.LINK,
            text: 'Announcements',
            icon: <i className="fi fi-rr-bullhorn"></i>,
            href: route('unit_head.announcements'),
            urlPath: 'announcements',
        },
        {
            type: NavType.BUTTON,
            text: 'Suggestion',
            icon: <i className="fi fi-rr-comment-alt"></i>,
            onClick: (e) => {
                e.preventDefault()
                setShowFeedbackModal(true)
            },
        },
        {
            type: NavType.DROPDOWN,
            text: 'Unit Heads',
            icon: <i className="fi fi-rr-users-alt"></i>,
            key: 'unit-heads',
            active: false,
            navList: [
                {
                    type: NavType.LINK,
                    text: 'Profile',
                    href: route('admin.unit_heads.profiles'),
                    urlPath: 'unit-heads/profile'
                },
                {
                    type: NavType.LINK,
                    text: 'Info and Account',
                    href: route('admin.unit_heads.records'),
                    urlPath: 'unit-heads/records'
                },
            ]
        },
        {
            type: NavType.DROPDOWN,
            text: (
                <span>
                    Downloadable <small>(ISO 9001_2015)</small>
                </span>
            ),
            icon: <i className='fi fi-rs-document'></i>,
            opened: false,
            navList: NavDownloadable(),
            key:'downloadable'
        },
    ];

    useEffect(() => {
        const fetchClassifications = () => {
            axios.get(route('api.classifications.all'))
                .then((res) => {
                    console.log(res)
                    setClassifications(res.data)
                    initMenu(res.data);
                    setIsLoaded(true)
                })
                .catch((error) => console.log('error getting classifications ', error))
        }
        if (!isLoaded) fetchClassifications()
    }, [])

    // load document tracking nav from classifications
    const initMenu = (data) => {
        let classifications = data.classifications;
        let campusMenu = [];
        let classificationMenu = []
        const campus = auth.user.campus;
        // classifications
        for (let classification of classifications) {
            // designations
            let designationMenu = [];
            for (let designation of classification.designations) {
                let designationNav = {
                    type: NavType.LINK,
                    text: designation.name,
                    key: designation.name,
                    urlPath: `submission_bin.reports.${campus.id}.${designation.id}`,
                    href: route('admin.reports.view.filtered', { campus_id: campus.id, designation_id: designation.id })
                }
                // append designation nav
                designationMenu.push(designationNav)
            }

            let classificationNav = {
                type: NavType.DROPDOWN,
                text: classification.name,
                key: classification.id,
                active: false,
                navList: designationMenu,
                icon: <i className='fi fi-rr-brackets-square'></i>
            }
            // append classification nav
            classificationMenu.push(classificationNav)
        }

        // nav menu
        var navMenu = {
            type: NavType.DROPDOWN,
            text: 'Document Tracking',
            icon: <i className='fi fi-rs-search-alt'></i>,
            key: 'document-tracking',
            active: false,
            opened: false,
            navList: [
                {
                    type: NavType.LINK,
                    text: 'Submission Bins',
                    icon: <i className='fi fi-rr-boxes'></i>,
                    href: route('admin.submission_bins'),
                    urlPath: 'submission-bins',
                },
                {
                    type: NavType.DROPDOWN,
                    text: 'Reports',
                    icon: <i className='fi fi-rr-document'></i>,
                    key: 'reports',
                    active: false,
                    opened: false,
                    navList: classificationMenu
                }
            ]
        }

        let temp = [...menu];
        temp[1] = navMenu;
        setNavList(temp)
        console.log('updated navbar')
    }


    return (
        <>
            <SidebarComponent isActive={isActive} activeLink={activeLink} />
        </>
    )
}

export default AdminSidebar
