import React, { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import SidebarComponent, { NavType } from "./SidebarComponent";
import { Link } from "@inertiajs/react";
import axios from "axios";
import { useNavMenuLoadedState, useNavMenuState } from "@/States/States";
import Downloadables from "@/constants/downloadables.json";
import Viewables from "@/constants/viewables.json";
import FileIcon from "./FileIcon";
import NavDownloadable from "./NavDownloadable";
import NavViewable from "./NavViewable";
// import listReactFiles from 'list-react-files'

const SuperAdminSidebar = ({ isActive, activeLink, setShowFeedbackModal }) => {
  const url = window.location.href;
  const [classifications, setClassifications] = useState([]);
  const { navList, setNavList } = useNavMenuState();
  const { isLoaded, setIsLoaded } = useNavMenuLoadedState();
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const menu = [
    {
      type: NavType.DROPDOWN,
      text: "PLAN",
      icon: <i class="fi fi-rr-document-signed"></i>,
      key: "plan",
      opened: false,
      navList: [
        ...NavViewable(setShowFileModal, setSelectedFile),
        {
          type: NavType.DROPDOWN,
          text: (
            <span>
              Downloadable <small>(ISO 9001_2015)</small>
            </span>
          ),
          icon: <i className="fi fi-rs-document"></i>,
          opened: false,
          navList: NavDownloadable(),
          key: "downloadable",
        },
        {
          type: NavType.LINK,
          text: "Calendar",
          icon: <i className="fi fi-rr-calendar"></i>,
          href: route("calendar"),
          urlPath: "calendar",
        },
        {
          type: NavType.LINK,
          text: "Announcements",
          icon: <i className="fi fi-rr-bullhorn"></i>,
          href: route("admin.announcements"),
          urlPath: "announcements",
        },
        {
          type: NavType.LINK,
          text: "Reminders",
          icon: <i className="fi fi-rr-note"></i>,
          href: route("admin.reminders"),
          urlPath: "reminders",
        },
      ],
    },
    {
      type: NavType.DROPDOWN,
      text: "DO",
      icon: <i class="fi fi-rr-calendar-lines-pen"></i>,
      key: "do",
      opened: false,
      navList: [
        {
          type: NavType.LINK,
          text: "Unit Heads Profiles",
          href: route("admin.unit_heads.profiles"),
          urlPath: "unit_heads_profiles",
        },
        {
          type: NavType.LINK,
          text: "Add Campus Admin",
          href: route("admin.admins.create"),
          urlPath: "add_campus_admin",
        },
        {
          type: NavType.LINK,
          text: "Add Unit Head",
          href: route("admin.unit_heads.create"),
          urlPath: "add_unit_head",
        },
        {
          type: NavType.LINK,
          text: "Create Submission Bin",
          href: route("admin.create_submission_bin"),
          urlPath: "create_submission_bin",
        },
      ],
    },
    {
      type: NavType.DROPDOWN,
      text: "CHECK",
      icon: <i class="fi fi-rr-memo-circle-check"></i>,
      key: "check",
      opened: false,
      navList: [
        {
          type: NavType.DROPDOWN,
          text: "Monitoring",
          key: "monitoring",
          opened: false,
          navList: [
            {
              type: NavType.LINK,
              text: "User Events History",
              href: route("admin.user_events_history"),
              urlPath: "user_events_history",
            },
            // TODO: change to notification history link
            {
              type: NavType.LINK,
              text: "Notification history",
              href: route("admin.notifications_history"),
              urlPath: "notification_history",
            },
            {
              type: NavType.BUTTON,
              text: "Feedback",
              onClick: (e) => {
                setShowFeedbackModal(true);
              },
            },
          ],
        },
        {
          type: NavType.DROPDOWN,
          text: "Retrieval",
          key: "retrieval",
          opened: false,
          navList: [
            // TODO: change to its correct url
            {
              type: NavType.LINK,
              text: "Unit heads reports checklist",
              href: route("admin.feedbacks"),
              urlPath: "reports_checklist",
            },
            // TODO: change to its correct url
            {
              type: NavType.LINK,
              text: "Generated reports annually",
              href: route("admin.generated-reports"),
              urlPath: "generated_reports_annually",
            },
          ],
        },
      ],
    },
    {
      type: NavType.LINK,
      text: "Settings",
      icon: <i className="fi fi-rr-settings"></i>,
      href: route("admin.settings"),
      urlPath: "settings",
    },
  ];

  useEffect(() => {
    const fetchClassifications = () => {
      axios
        .get(route("api.classifications.all"))
        .then((res) => {
          console.log(res);
          setClassifications(res.data);
          initMenu(res.data);
          setIsLoaded(true);
        })
        .catch((error) => console.log("error getting classifications ", error));
    };
    if (!isLoaded) fetchClassifications();
  }, []);

  // load document tracking nav from classifications
  const initMenu = (data) => {
    let classifications = data.classifications;
    let campusMenu = [];
    for (let campus of data.campuses) {
      let classificationMenu = [];
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
            href: route("admin.reports.view.filtered", {
              campus_id: campus.id,
              designation_id: designation.id,
            }),
          };
          // append designation nav
          designationMenu.push(designationNav);
        }

        let classificationNav = {
          type: NavType.DROPDOWN,
          text: classification.name,
          key: classification.id,
          active: false,
          navList: designationMenu,
          icon: <i className="fi fi-rr-brackets-square"></i>,
        };
        // append classification nav
        classificationMenu.push(classificationNav);
      }

      // campus nav
      let campusNav = {
        type: NavType.DROPDOWN,
        text: campus.name,
        key: "reports",
        active: false,
        navList: classificationMenu,
        icon: <i className="fi fi-rr-school"></i>,
      };
      campusMenu.push(campusNav);
    }

    let temp = [...menu];
    setNavList(temp);
    console.log("updated navbar");
  };

  return <SidebarComponent isActive={isActive} activeLink={activeLink} />;
};

export default SuperAdminSidebar;
