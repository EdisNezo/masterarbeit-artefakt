"use client";

import { useIdeStore } from "@/lib/store";
import { Files, Search, GitGraph, Heart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Sidebar() {
    const { isChatOpen, toggleChat, files, activeFile, setActiveFile } = useIdeStore();

    const icons = [
        { icon: Files, label: "Explorer", active: true },
        { icon: Search, label: "Search" },
        { icon: GitGraph, label: "Source Control" },
    ];

    return (
        <div className="flex bg-[#252526] border-r border-[#1e1e1e]">
            {/* Activity Bar */}
            <div className="w-12 bg-[#333333] flex flex-col items-center py-2 text-[#858585]">
                {icons.map((item, i) => (
                    <Button
                        key={i}
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "h-12 w-12 rounded-none hover:bg-[#2a2d2e] hover:text-white mb-1",
                            item.active && "border-l-2 border-white text-white bg-[#2a2d2e]"
                        )}
                    >
                        <item.icon className="h-6 w-6" />
                    </Button>
                ))}

                <div className="mt-auto flex flex-col items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleChat}
                        className={cn(
                            "h-12 w-12 rounded-none hover:bg-[#2a2d2e] transition-colors",
                            isChatOpen ? "text-pink-500 bg-[#2a2d2e]" : "text-[#858585] hover:text-pink-400"
                        )}
                        title="Mental Health Companion (Ctrl+Shift+L)"
                    >
                        <Heart className={cn("h-6 w-6", isChatOpen && "fill-current")} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-none hover:bg-[#2a2d2e] hover:text-white">
                        <Settings className="h-6 w-6" />
                    </Button>
                </div>
            </div>

            {/* Side Bar (Explorer) */}
            <div className="w-60 flex flex-col">
                <div className="h-9 px-4 flex items-center text-xs font-medium text-gray-400 uppercase tracking-wider bg-[#252526]">
                    Explorer
                </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="px-2 py-1 space-y-0.5">
                        <div className="px-2 py-1 text-xs font-bold text-blue-400 uppercase">
                            technostress_experiment
                        </div>
                        {Object.keys(files).map((fileName) => (
                            <button
                                key={fileName}
                                onClick={() => setActiveFile(fileName)}
                                className={cn(
                                    "w-full text-left px-2 py-1 text-sm text-gray-300 hover:bg-[#2a2d2e] cursor-pointer rounded-sm flex items-center gap-2",
                                    activeFile === fileName && "bg-[#37373d] text-white"
                                )}
                            >
                                <span className="text-[#e8b056]">py</span>
                                {fileName}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
