"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./sidebar";
import Header from "./header";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const router = useRouter();

    return (
        <div className="flex h-screen text-foreground font-sans antialiased overflow-hidden bg-transparent">
            <Sidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                onNewSession={() => router.push("/")}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
