import React, { useEffect, useState } from 'react'
import { Nav } from 'react-bootstrap'
import SidebarComponent, { NavType } from './SidebarComponent'
import { Link } from '@inertiajs/react'
import axios from 'axios'
import { useNavMenuLoadedState, useNavMenuState } from '@/States/States'
import Downloadables from '@/constants/downloadables.json';
import FileIcon from './FileIcon'
// import listReactFiles from 'list-react-files'

const SuperAdminSidebar = ({ isActive, activeLink, setShowFeedbackModal }) => {
    const url = window.location.href;
    const [classifications, setClassifications] = useState([])
    const { navList, setNavList } = useNavMenuState()
    const { isLoaded, setIsLoaded } = useNavMenuLoadedState()
    const downloadableNav = [];

    const folders = Object.keys(Downloadables);

    for (let folder of folders) {
        var navLinks = [];
        for (let downloadable of Downloadables[folder]) {
            if (typeof downloadable == 'string') {
                let navLink = {
                    type: NavType.DOWNLOADABLE,
                    text: (
                        <small>{downloadable}</small>
                    ),
                    icon: (
                        <FileIcon size='xs' file={{ name: `${downloadable}`, uri: `/downloadables/${folder.toUpperCase()}/${downloadable}` }} />
                    ),
                    downloadable: `/downloadables/${folder.toUpperCase()}/${downloadable}`
                }
                navLinks.push(navLink)
            } else {
                // if object
                let subFolders = Object.keys(downloadable);
                var subNavLinks = [];
                for (let subFolder of subFolders) {
                    for (let subDownloadable of downloadable[subFolder]) {
                        let subNavLink = {
                            type: NavType.DOWNLOADABLE,
                            text: (
                                <small>{subDownloadable}</small>
                            ),
                            icon: (
                                <FileIcon size='xs' file={{ name: `${subDownloadable}`, uri: `/downloadables/${folder.toUpperCase()}/${subFolder}/${subDownloadable}` }} />
                            ),
                            downloadable: `/downloadables/${folder.toUpperCase()}/${subFolder}/${subDownloadable}`
                        }
                        subNavLinks.push(subNavLink);
                    }
                    let navLink = {
                        type: NavType.DROPDOWN,
                        text: (
                            <small>{subFolder}</small>
                        ),
                        icon: <i className='fi fi-rr-folder'></i>,
                        navList: subNavLinks
                    }
                    navLinks.push(navLink)
                }
            }
        }
        let navDropdown = {
            type: NavType.DROPDOWN,
            text: folder,
            icon: <i className='fi fi-rr-folder'></i>,
            opened: false,
            navList: navLinks
        }
        downloadableNav.push(navDropdown)
    }


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
            navList: [
                {
                    type: NavType.LINK,
                    text: 'Submission Bins',
                    icon: <i className='fi fi-rr-boxes'></i>,
                    href: route('admin.submission_bins'),
                    urlPath: 'submission-bins'
                },
                {
                    type: NavType.DROPDOWN,
                    text: 'Reports',
                    icon: <i className='fi fi-rr-document'></i>,
                    key: 'reports',
                    opened: false,
                    navList: []
                },
            ]
        },
        {
            type: NavType.LINK,
            text: 'Announcements',
            icon: <i className="fi fi-rr-bullhorn"></i>,
            href: route('admin.announcements'),
            urlPath: 'announcements',
        },
        {
            type: NavType.LINK,
            text: 'Reminders',
            icon: <i className="fi fi-rr-note"></i>,
            href: route('admin.reminders'),
            urlPath: 'reminders',
        },
        {
            type: NavType.LINK,
            text: 'Feedbacks',
            icon: <i className="fi fi-rr-comment-alt"></i>,
            href: route("admin.feedbacks"),
            urlPath: 'feedback'
        },
        {
            type: NavType.LINK,
            text: 'Campus Admins',
            icon: <i className="fi fi-rr-user"></i>,
            href: route('admin.admins'),
            urlPath: 'admins'
        },
        {
            type: NavType.DROPDOWN,
            text: 'Unit Heads',
            icon: <i className="fi fi-rr-users-alt"></i>,
            key: 'unit-heads',
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
        // {
        //     type: NavType.LINK,
        //     text: 'Unit Heads',
        //     icon: <i className='fi fi-rr-user'></i>,
        //     href: route('admin.unit_heads.records'),
        //     urlPath: 'unit-heads/records'
        // },
        {
            type: NavType.LINK,
            text: 'Calendar',
            icon: <i className="fi fi-rr-calendar"></i>,
            href: route('calendar'),
            urlPath: 'calendar'
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
            navList: downloadableNav,
            key:'downloadable'
        },
        {
            type: NavType.LINK,
            text: 'Settings',
            icon: <i className="fi fi-rr-settings"></i>,
            href: route('admin.settings'),
            urlPath: 'settings'
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
        for (let campus of data.campuses) {
            let classificationMenu = []
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

            // campus nav
            let campusNav = {
                type: NavType.DROPDOWN,
                text: campus.name,
                key: 'reports',
                active: false,
                navList: classificationMenu,
                icon: <i className='fi fi-rr-school'></i>
            }
            campusMenu.push(campusNav)
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
                    navList: campusMenu
                }
            ]
        }

        let temp = [...menu];
        temp[1] = navMenu;
        setNavList(temp)
        console.log('updated navbar')
    }


    return (
        <SidebarComponent isActive={isActive} activeLink={activeLink} />
    )
}

export default SuperAdminSidebar
