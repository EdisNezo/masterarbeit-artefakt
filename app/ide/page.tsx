'use client';

import React, { useEffect } from 'react';
import IdeLayout from '@/components/ide/IdeLayout';
import { useIdeStore } from '@/lib/store';

export default function IdeScreenshotPage() {
    const setChatOpen = useIdeStore(state => state.setChatOpen);

    useEffect(() => {
        // Open the chat by default for screenshots
        setChatOpen(true);
    }, [setChatOpen]);

    return (
        <div className="w-full h-screen relative overflow-hidden bg-[#1e1e1e]">
            <IdeLayout>

            </IdeLayout>
        </div>
    );
}
