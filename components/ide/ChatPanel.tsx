"use client";

import { useChat, UIMessage } from '@ai-sdk/react';
import { useIdeStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2, Lock, Zap, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from 'react';
import { BreathingExercise } from './BreathingExercise';

export function ChatPanel() {
    const { isChatOpen, setChatOpen, incrementChatInteraction, addChatMessage, clearChatMessages, files, activeFile, terminalOutput, verbosityMode, toggleVerbosityMode } = useIdeStore();
    const [input, setInput] = useState('');
    const [showBreathing, setShowBreathing] = useState<string | null>(null);
    const prevMessagesLengthRef = useRef(1); // 1 for the initial welcome message

    // Use Vercel AI SDK hook
    const { messages, status, sendMessage, setMessages } = useChat({
        messages: [
            {
                id: 'welcome',
                role: 'assistant',
                parts: [{ type: 'text', text: "Hi! I notice you've been working hard. How are you feeling right now?" }]
            }
        ] as UIMessage[]
    });

    const isLoading = status === 'submitted' || status === 'streaming';
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, status]);

    // Track new assistant messages added by the AI SDK
    useEffect(() => {
        if (messages.length > prevMessagesLengthRef.current) {
            // Check all new messages since last tracked
            for (let i = prevMessagesLengthRef.current; i < messages.length; i++) {
                const m = messages[i];
                const textContent = m.parts
                    ?.filter((p: any) => p.type === 'text')
                    .map((p: any) => p.text)
                    .join('') || '';
                if (m.role === 'assistant' && textContent) {
                    addChatMessage({
                        role: 'assistant',
                        content: textContent,
                        timestamp: new Date().toISOString()
                    });
                }
            }
            prevMessagesLengthRef.current = messages.length;
        }
    }, [messages, addChatMessage]);

    const handleInputSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userText = input.trim();

        // Track user interaction in the store
        incrementChatInteraction();
        addChatMessage({
            role: 'user',
            content: userText,
            timestamp: new Date().toISOString()
        });

        const fileContent = (files[activeFile] || '').split('\n').slice(0, 200).join('\n');
        const termLines = terminalOutput.slice(-20).join('\n');

        await sendMessage(
            { role: 'user', parts: [{ type: 'text', text: userText }] },
            { body: { codeContext: { fileName: activeFile, fileContent, terminalOutput: termLines }, verbosityMode } }
        );
        setInput('');
    };

    const handleReset = () => {
        setMessages([{
            id: 'welcome',
            role: 'assistant',
            parts: [{ type: 'text', text: "Hi! I notice you've been working hard. How are you feeling right now?" }]
        }] as UIMessage[]);
        clearChatMessages();
        prevMessagesLengthRef.current = 1;
    };

    return (
        <div className={cn("h-full min-h-0 w-[400px] flex flex-col border-l border-[#3e3e3e] bg-[#252526] text-gray-300 shadow-xl transition-all duration-300 ease-in-out", !isChatOpen && "hidden")}>
            <div className="px-4 py-3 border-b border-[#3e3e3e] bg-[#252526] flex items-center gap-2 shrink-0">
                <button
                    onClick={toggleVerbosityMode}
                    className={cn(
                        "p-1 rounded transition-colors",
                        verbosityMode === 'focus'
                            ? "text-yellow-400 bg-yellow-900/30"
                            : "text-[#858585] hover:text-yellow-400"
                    )}
                    title={verbosityMode === 'focus' ? "Focus Mode: ON — concise answers" : "Focus Mode: OFF — detailed answers"}
                >
                    <Zap className="h-4 w-4" />
                </button>
                <button
                    onClick={handleReset}
                    className="p-1 rounded text-[#858585] hover:text-white transition-colors"
                    title="New Conversation"
                >
                    <RotateCcw className="h-4 w-4" />
                </button>
                <Bot className="h-5 w-5 text-emerald-500" />
                <span className="text-white text-sm font-medium">Leo</span>
            </div>

            <ScrollArea className="flex-1 min-h-0 p-4">
                <div className="flex flex-col gap-4 text-sm pb-4">
                    {messages.map((m) => (
                        <div key={m.id} className={cn("flex gap-3", m.role === 'user' ? "flex-row-reverse" : "")}>
                            <div className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center shrink-0 border",
                                m.role === 'assistant' || m.role === 'system'
                                    ? "bg-emerald-900/50 border-emerald-800 text-emerald-400"
                                    : "bg-blue-900/50 border-blue-800 text-blue-400"
                            )}>
                                {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                            </div>
                            <div className={cn(
                                "p-3 rounded-lg max-w-[85%] whitespace-pre-wrap leading-relaxed",
                                m.role === 'assistant' || m.role === 'system'
                                    ? "bg-[#3e3e3e] rounded-tl-none text-gray-200"
                                    : "bg-blue-600/20 text-blue-100 rounded-tr-none"
                            )}>
                                {m.parts ? m.parts.map((part: any, i: number) => {
                                    if (part.type === 'text') return <span key={i}>{part.text}</span>;
                                    if (part.type === 'tool-invocation') {
                                        if (part.toolInvocation.toolName === 'suggestReplies') return null;
                                        if (part.toolInvocation.toolName === 'startBreathingExercise') {
                                            if (part.toolInvocation.state === 'result') {
                                                return <BreathingExercise key={i} pattern={part.toolInvocation.result?.pattern} />;
                                            }
                                            // Show loading state while tool is being called
                                            return (
                                                <div key={i} className="text-xs text-emerald-500/80 my-1">
                                                    Starting breathing exercise...
                                                </div>
                                            );
                                        }
                                        if (part.toolInvocation.state !== 'result') {
                                            return (
                                                <div key={i} className="bg-black/20 p-2 rounded text-xs px-2 my-1 font-mono text-emerald-500/80">
                                                    Thinking...
                                                </div>
                                            );
                                        }
                                        return null;
                                    }
                                    return null;
                                }) : <span>{/* Fallback or empty if no parts */}</span>}
                            </div>
                        </div>
                    ))}
                    {!isLoading && (() => {
                        const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
                        if (!lastAssistant) return null;

                        const elements: React.ReactNode[] = [];

                        // Breathing exercise fallback: detect if assistant mentions breathing but didn't call the tool
                        const textContent = lastAssistant.parts
                            ?.filter((p: any) => p.type === 'text')
                            .map((p: any) => p.text)
                            .join('') || '';
                        const hasBreathingTool = lastAssistant.parts?.some(
                            (p: any) => p.type === 'tool-invocation' && p.toolInvocation.toolName === 'startBreathingExercise'
                        );
                        const mentionsBreathing = /breath(e|ing)|atemübung|atmen/i.test(textContent);

                        if (mentionsBreathing && !hasBreathingTool) {
                            if (showBreathing === lastAssistant.id) {
                                elements.push(
                                    <div key="breathing-widget" className="ml-11">
                                        <BreathingExercise />
                                    </div>
                                );
                            } else {
                                elements.push(
                                    <div key="breathing-btn" className="ml-11">
                                        <button
                                            onClick={() => setShowBreathing(lastAssistant.id)}
                                            className="bg-emerald-900/40 hover:bg-emerald-800/50 border border-emerald-700 text-emerald-400 text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5"
                                        >
                                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            Start Breathing Exercise
                                        </button>
                                    </div>
                                );
                            }
                        }

                        // Reply chips — client-side generation based on assistant message content
                        const hasUserMessage = messages.some(m => m.role === 'user');
                        if (hasUserMessage) {
                            // Try LLM-generated chips first
                            const chipPart = lastAssistant.parts?.find(
                                (p: any) => p.type === 'tool-invocation' && p.toolInvocation.toolName === 'suggestReplies' && p.toolInvocation.state === 'result'
                            ) as any;
                            const llmReplies: string[] = chipPart?.toolInvocation?.result?.replies || [];

                            // Client-side fallback chips based on content
                            let replies = llmReplies;
                            if (replies.length === 0) {
                                const lc = textContent.toLowerCase();
                                if (/\?/.test(textContent) && /feel|doing|how are/.test(lc)) {
                                    replies = ["I'm feeling stressed", "I'm doing okay", "I could use some help"];
                                } else if (/\?/.test(textContent) && /would you|want to|like to|shall/.test(lc)) {
                                    replies = ["Yes, let's try that", "Maybe something else", "Not right now"];
                                } else if (/\?/.test(textContent)) {
                                    replies = ["Yes, that's right", "Not exactly", "Tell me more"];
                                } else if (/strateg|technique|exercise|try|suggest/.test(lc)) {
                                    replies = ["Let's try it", "Tell me more", "Something different"];
                                } else {
                                    replies = ["Tell me more", "That helps, thanks", "I have another issue"];
                                }
                            }

                            elements.push(
                                <div key="chips" className="flex flex-wrap gap-2 ml-11">
                                    {replies.map((reply, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setInput(reply);
                                                setTimeout(() => {
                                                    const form = document.querySelector('form');
                                                    form?.requestSubmit();
                                                }, 0);
                                            }}
                                            className="bg-[#3e3e3e] hover:bg-emerald-900/50 border border-[#555] hover:border-emerald-600 text-gray-300 text-xs px-3 py-1.5 rounded-full cursor-pointer transition-colors"
                                        >
                                            {reply}
                                        </button>
                                    ))}
                                </div>
                            );
                        }

                        return elements.length > 0 ? <>{elements}</> : null;
                    })()}
                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="h-8 w-8 rounded-full bg-emerald-900/50 flex items-center justify-center shrink-0 border border-emerald-800">
                                <Bot className="h-4 w-4 text-emerald-400" />
                            </div>
                            <div className="bg-[#3e3e3e] p-3 rounded-lg rounded-tl-none flex items-center">
                                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-[#3e3e3e] bg-[#252526] shrink-0">
                <form onSubmit={handleInputSubmit} className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="bg-[#3e3e3e] border-0 text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-emerald-500"
                    />
                    <Button type="submit" size="icon" className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0" disabled={isLoading}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
                <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-gray-500">
                    <Lock className="h-3 w-3" />
                    <span>Privacy: History is local only.</span>
                </div>
            </div>
        </div>
    );
}

