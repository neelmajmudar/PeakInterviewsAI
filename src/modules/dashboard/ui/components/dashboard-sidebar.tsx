"use client";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar";
import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { DashboardUserButton } from "@/modules/dashboard/ui/components/dashboard-user-button";

const firstSection = [
    {
        icon: VideoIcon,
        label: "Meetings",
        href: "/meetings",
    },
    {
        icon: BotIcon,
        label: "Agents",
        href: "/agents",
    },
];

const secondSection = [
    {
        icon: StarIcon,
        label: "Upgrade",
        href: "/upgrade",
    },
];

export const DashboardSidebar = () => {
    const pathname = usePathname(); // Get the current path


    return (
        <Sidebar>
            <SidebarHeader className="text-sidebar-accent-foreground">
                <Link href="/" className="flex items-center gap-2 px-2 pt-2">
                    <Image src="/logo.svg" height={42} width={42} alt="PeakInterviewer.AI" color="purple"/>
                    <p className="text-xl font-semibold text-white">
                        PeakInterviewer.AI
                    </p>
                </Link>
            </SidebarHeader>
            <div className="px-4 py-2">
                <Separator className="opacity-10 text-[var(--color-sidebar-border)]"/>
            </div>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {firstSection.map((item) => (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-2 px-2 py-2 rounded-md transition-colors duration-200", // Base styles with transition
                                                pathname === item.href
                                                    ? "bg-white text-gray-900" // Active styles: explicit white background, dark gray text
                                                    : "text-[var(--color-sidebar-foreground)] hover:bg-white hover:text-gray-900" // Inactive: default sidebar-foreground text, hover to white background and dark gray text
                                            )}
                                        >
                                            <item.icon className="size-5"/>
                                            <span className="text-sm font-medium tracking-tight">
                                                {item.label}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <div className="px-4 py-2">
                  <Separator className="opacity-10 text-[var(--color-sidebar-border)]"/>
                </div>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {secondSection.map((item) => (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-2 px-2 py-2 rounded-md transition-colors duration-200",
                                                pathname === item.href
                                                    ? "bg-white text-gray-900" // Active styles: explicit white background, dark gray text
                                                    : "text-[var(--color-sidebar-foreground)] hover:bg-white hover:text-gray-900" // Inactive: default sidebar-foreground text, hover to white background and dark gray text
                                            )}
                                        >
                                            <item.icon className="size-5"/>
                                            <span className="text-sm font-medium tracking-tight">
                                                {item.label}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4">
                <DashboardUserButton/>
                <p className="text-xs text-white">© 2025 PeakInterviewer.AI</p>
            </SidebarFooter>
        </Sidebar>
    );
};