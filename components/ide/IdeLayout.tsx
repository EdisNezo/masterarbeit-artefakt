"use client";

import React, { useEffect } from "react";
import { useIdeStore } from "@/lib/store";

import { Sidebar } from "./Sidebar";
import { Terminal } from "./Terminal";
import { CodeEditor } from "./Editor";
import { ChatPanel } from "./ChatPanel";

export default function IdeLayout({ children }: { children?: React.ReactNode }) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'L') {
                e.preventDefault();
                useIdeStore.getState().toggleChat();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);
    return (
        <div className="flex h-screen w-full bg-[#1e1e1e] overflow-hidden text-white font-sans">
            <Sidebar />
            <div className="flex-1 flex min-w-0 min-h-0 overflow-hidden">
                <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
                    <div className="flex-1 flex overflow-hidden min-h-0">
                        <CodeEditor />
                    </div>
                    <Terminal />
                </div>
                <ChatPanel />
            </div>
        </div>
    );
}
