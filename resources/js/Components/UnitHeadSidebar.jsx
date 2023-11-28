import React from "react";
import SidebarComponent, { NavType } from "./SidebarComponent";
import { useNavMenuLoadedState, useNavMenuState } from "@/States/States";
import { useEffect } from "react";
import NavDownloadable from "./NavDownloadable";

const UnitHeadSidebar = ({ isActive, setShowFeedbackModal, activeLink }) => {
  const { setNavList } = useNavMenuState();
  const { setIsLoaded } = useNavMenuLoadedState();

  const navList = [
    {
      type: NavType.LINK,
      text: "Dashboard",
      icon: <i class="fi fi-rr-chart-line-up"></i>,
      href: route("dashboard"),
      urlPath: "dashboard",
    },
    {
      type: NavType.LINK,
      text: "Submit Report",
      icon: <i className="fi fi-rr-box"></i>,
      href: route("unit_head.reports"),
      urlPath: "reports",
    },
    {
      type: NavType.LINK,
      text: "Calendar",
      icon: <i class="fi fi-rr-calendar"></i>,
      href: route("unit_head.calendar"),
      urlPath: "calendar",
    },
    {
      type: NavType.LINK,
      text: "Announcements",
      icon: <i className="fi fi-rr-bullhorn"></i>,
      href: route("unit_head.announcements"),
      urlPath: "announcements",
    },
    {
      type: NavType.LINK,
      text: "Reminders",
      icon: <i className="fi fi-rr-note"></i>,
      href: route("admin.reminders"),
      urlPath: "reminders",
    },
    {
      type: NavType.BUTTON,
      text: "Suggestion",
      icon: <i className="fi fi-rr-comment"></i>,
      onClick: () => {
        setShowFeedbackModal(true);
      },
    },
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
  ];

  useEffect(() => {
    setNavList(navList);
    setIsLoaded(true);
  }, []);

  return <SidebarComponent isActive={isActive} activeLink={activeLink} />;
};

export default UnitHeadSidebar;
