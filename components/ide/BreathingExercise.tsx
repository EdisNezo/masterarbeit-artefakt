"use client";

import { useState, useEffect, useRef } from 'react';

interface BreathingPattern {
    inhale: number;
    hold: number;
    exhale: number;
    holdAfter: number;
}

const PHASES = ['Breathe in...', 'Hold...', 'Breathe out...', 'Hold...'] as const;

export function BreathingExercise({ pattern = { inhale: 4, hold: 4, exhale: 4, holdAfter: 4 } }: { pattern?: BreathingPattern }) {
    const [active, setActive] = useState(true);
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [countdown, setCountdown] = useState(pattern.inhale);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const phaseDurations = [pattern.inhale, pattern.hold, pattern.exhale, pattern.holdAfter];

    useEffect(() => {
        if (!active) return;

        intervalRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    setPhaseIndex(pi => {
                        let next = (pi + 1) % 4;
                        // Skip phases with 0 duration
                        while (phaseDurations[next] === 0) {
                            next = (next + 1) % 4;
                        }
                        return next;
                    });
                    return -1; // Will be corrected in the phaseIndex effect
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [active]);

    // Reset countdown when phase changes
    useEffect(() => {
        setCountdown(phaseDurations[phaseIndex]);
    }, [phaseIndex]);

    // Scale: inhale=1.4, hold=1.4, exhale=1.0, holdAfter=1.0
    const scale = phaseIndex <= 1 ? 1.4 : 1.0;

    if (!active) return null;

    return (
        <div className="bg-[#1e1e1e] rounded-lg p-4 max-w-[280px] mx-auto my-2 flex flex-col items-center gap-3">
            <div
                className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center transition-transform duration-1000 ease-in-out"
                style={{ transform: `scale(${scale})` }}
            >
                <span className="text-emerald-400 text-lg font-bold">{countdown}</span>
            </div>
            <p className="text-emerald-400 text-sm font-medium">{PHASES[phaseIndex]}</p>
            <button
                onClick={() => setActive(false)}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
                Stop
            </button>
        </div>
    );
}
