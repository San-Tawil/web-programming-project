
import React, { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    ChevronDown,
    Menu,
    PanelLeftClose,
    PanelLeftOpen,
    Settings,
    LogOut,
} from "lucide-react";

import ThemeSwitch from "./ThemeSwitch.jsx";
import DashboardAvatar from "./DashboardAvatar.jsx";
import { control } from "./DashboardUI.jsx";
import { useDashboardDemo } from "../context/DashboardDemoContext.jsx";

export default function DashboardNav({
    pageTitle,
    profile,
    base,
    collapsed = false,
    setCollapsed,
    setDrawerOpen,
    standalone = false,
}) {
    const avatarMenu = useRef(null);
    const navigate = useNavigate();
    const { selectAccount } = useDashboardDemo();

    function handleLogout() {
        selectAccount(null);
        navigate("/", { replace: true });
    }
    const { pathname, search, hash } = useLocation();

    // Close the profile menu when navigating to another page.
    useEffect(() => {
        if (avatarMenu.current) {
            avatarMenu.current.open = false;
        }
    }, [pathname, search, hash]);

    return (
        <header className="sticky top-0 z-20 flex min-h-14 items-center justify-between gap-2 border-b border-(--line) bg-(--panel) px-3 sm:px-6">
            {/* Left side */}
            <div className="flex min-w-0 items-center gap-2">
                {!standalone && (
                    <>
                        <button
                            type="button"
                            aria-label="Open dashboard navigation"
                            aria-haspopup="dialog"
                            onClick={() => setDrawerOpen(true)}
                            className={control + " lg:hidden"}
                        >
                            <Menu aria-hidden="true" size={19} />
                        </button>

                        <div className="hidden lg:block">
                            <button
                                type="button"
                                aria-label={
                                    collapsed ? "Expand sidebar" : "Collapse sidebar"
                                }
                                aria-expanded={!collapsed}
                                onClick={() => setCollapsed(value => !value)}
                                className={control}
                            >
                                {collapsed ? (
                                    <PanelLeftOpen aria-hidden="true" size={18} />
                                ) : (
                                    <PanelLeftClose aria-hidden="true" size={18} />
                                )}
                            </button>
                        </div>
                    </>
                )}

                <span className="min-w-0 truncate text-sm font-semibold">
                    {standalone ? "Opportunity Details" : pageTitle}
                </span>
            </div>

            {/* Right side */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">

                <ThemeSwitch />

                {/* Profile dropdown */}
                <details
                    ref={avatarMenu}
                    className="relative"
                    onBlur={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget)) {
                            event.currentTarget.open = false;
                        }
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Escape" && event.currentTarget.open) {
                            event.currentTarget.open = false;
                            event.currentTarget.querySelector("summary").focus();
                        }
                    }}
                >
                    <summary
                        aria-label={`Account menu for ${profile.name}`}
                        className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-lg px-2 hover:bg-(--nav-panel)"
                    >
                        <DashboardAvatar
                            profile={profile}
                            className="size-8 text-xs"
                        />

                        <span className="hidden max-w-36 truncate text-sm font-semibold sm:block">
                            {profile.name}
                        </span>

                        <ChevronDown
                            aria-hidden="true"
                            size={14}
                            className="hidden sm:block"
                        />
                    </summary>

                    <div className="absolute right-0 z-30 mt-2 w-56 rounded-xl border border-(--line) bg-(--panel) p-2 shadow-lg">
                        <p className="m-0 break-words px-3 py-2 text-sm font-semibold">
                            {profile.name}
                        </p>

                        <Link
                            to={`${base}/profile`}
                            onClick={() => {
                                avatarMenu.current.open = false;
                            }}
                            className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm hover:bg-(--nav-panel)"
                        >
                            <Settings aria-hidden="true" size={16} />
                            Profile settings
                        </Link>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-3 text-left text-sm text-red-600 hover:bg-red-50 focus-visible:outline-none dark:text-red-400 dark:hover:bg-red-950/30"
                        >
                            <LogOut aria-hidden="true" size={16} />
                            Log out
                        </button>
                    </div>
                </details>
            </div>
        </header>
    );
}
