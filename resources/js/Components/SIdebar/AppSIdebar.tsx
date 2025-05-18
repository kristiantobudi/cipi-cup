"use client";

import * as React from "react";
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    ShoppingBag,
    SquareTerminal,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "../ui/sidebar";
import { TeamSwitcher } from "./TeamSwitcher";
import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";
import { NavProjects } from "./NavProjects";
import { route } from "ziggy-js";

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Cipi Cup",
            logo: GalleryVerticalEnd,
            plan: "Dashboard Penjualan",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
    navMain: [
        {
            title: "Dashboard",
            url: "#",
            icon: PieChart,
            isActive: true,
            items: [
                {
                    title: "Dashboard",
                    url: route("dashboard"),
                },
            ],
        },
        {
            title: "Inventory",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "Categories",
                    url: route("categories.index"),
                },
                {
                    title: "Product",
                    url: route("product.index"),
                },
                {
                    title: "Stock",
                    url: route("stock.index"),
                },
            ],
        },
        {
            title: "Sales",
            url: "#",
            icon: ShoppingBag,
            isActive: true,
            items: [
                {
                    title: "Purchases",
                    url: route("purchases.index"),
                },
                {
                    title: "Sales",
                    url: route("sales.index"),
                },
            ],
        },
        {
            title: "Documentation",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Introduction",
                    url: "#",
                },
                {
                    title: "Get Started",
                    url: "#",
                },
                {
                    title: "Tutorials",
                    url: "#",
                },
                {
                    title: "Changelog",
                    url: "#",
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter>
                {/* <NavUser user={data.user} /> */}
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
