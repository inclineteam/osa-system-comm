import PageLoader from "@/Components/PageLoader";
import PolicyModal from "@/Components/PolicyModal";
import {
  useLoaderState,
  useNavState,
  usePolicyState,
  useThemeState,
  useUserAuthState,
  useWindowState,
} from "@/States/States";
import { Link, router, usePage, useRemember } from "@inertiajs/react";
import React, { Suspense, useEffect, useState } from "react";

const AppLayout = ({ children, auth }) => {
  const { theme, setTheme } = useThemeState();
  const { userAuth, setUserAuth } = useUserAuthState();
  const { showLoader, setShowLoader } = useLoaderState();
  const [showPageLoader, setShowPageLoader] = useState(true);
  const { auth: authPageProps } = usePage().props;
  const { isMobile, setIsMobile } = useWindowState();
  const { isNavActive, setNavActive } = useNavState();
  const handleResize = () => setIsMobile(window.innerWidth <= 900);
  router.on("start", () => {
    if (isMobile) {
      setNavActive(true);
    }
  });
  useEffect(() => {
    setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", () => handleResize);
    return () => window.removeEventListener("resize", () => handleResize);
  }, []);

  useEffect(() => {
    setUserAuth(authPageProps);
    setTimeout(() => {
      setShowLoader(false);
    }, 1000);
  }, []);

  useEffect(() => {
    document.querySelector("html").setAttribute("data-bs-theme", theme);
  }, [theme]);

  return (
    <div className="app relative" data-bs-theme={theme}>
      {!userAuth.user || userAuth.role === "unit_head" ? null : (
        <Link
          href={route("admin.user_objectives")}
          className="bottom-10 shadow-sm hover:bg-indigo-500 left-10 fixed z-[999] bg-indigo-600 text-white px-4 py-2.5 font-semibold rounded-md"
        >
          Targets
        </Link>
      )}

      <PageLoader show={showLoader} />
      {children}
    </div>
  );
};

export default AppLayout;
