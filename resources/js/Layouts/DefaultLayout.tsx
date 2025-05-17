import { Link, usePage } from "@inertiajs/react";
import { AppSidebar } from "@/Components/SIdebar/AppSIdebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/Components/ui/sidebar";
import { PropsWithChildren, ReactNode, useState } from "react";

export default function DefaultLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const segments = location.pathname.split("/").filter(Boolean);

    const breadcrumbs = segments.map((segment, index) => {
        const url = "/" + segments.slice(0, index + 1).join("/");
        const isUuid =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
                segment,
            );

        return {
            label: isUuid
                ? "Detail"
                : segment.charAt(0).toUpperCase() + segment.slice(1),
            url: index < segments.length - 1 ? url : null,
        };
    });

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                {breadcrumbs.map(
                                    (crumb: any, index: number) => (
                                        <>
                                            <BreadcrumbItem key={index}>
                                                {crumb.url ? (
                                                    <BreadcrumbLink
                                                        className="text-sm text-muted-foreground hover:text-primary"
                                                        href={crumb.url}
                                                    >
                                                        {crumb.label}
                                                    </BreadcrumbLink>
                                                ) : (
                                                    <BreadcrumbPage className="font-bold text-primary">
                                                        {crumb.label}
                                                    </BreadcrumbPage>
                                                )}
                                            </BreadcrumbItem>

                                            {index < breadcrumbs.length - 1 && (
                                                <BreadcrumbSeparator
                                                    key={`sep-${index}`}
                                                />
                                            )}
                                        </>
                                    ),
                                )}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <main>{children}</main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
