import { openai } from '@ai-sdk/openai';
import { streamText, tool, convertToModelMessages, stepCountIs } from 'ai';
import { z } from 'zod';
import { systemPrompt } from '@/lib/prompt';
import { getQuestionsByCreator } from '@/lib/data';
import { findRelevantStrategies, findRelevantDiagnosticQuestion } from '@/lib/vector-store';

import { logger } from '@/lib/logger';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, codeContext, verbosityMode } = await req.json();
    logger.info('Received chat request', { messageCount: messages.length });

    let fullSystemPrompt = systemPrompt;
    if (codeContext?.fileName) {
        fullSystemPrompt += `\n\n[CURRENT IDE CONTEXT]\nActive File: ${codeContext.fileName}\n\`\`\`\n${codeContext.fileContent}\n\`\`\`\nTerminal Output:\n\`\`\`\n${codeContext.terminalOutput}\n\`\`\``;
    }

    if (verbosityMode === 'focus') {
        fullSystemPrompt += `\n\n[FOCUS MODE ACTIVE]\nThe user is under acute time pressure. OVERRIDE your default behavior:\n- Maximum 3 sentences per response.\n- Skip emotional validation and empathetic preamble entirely.\n- Go straight to actionable advice or the answer.\n- Use short, direct language.`;
    }

    const result = streamText({
        model: openai('gpt-5.4'),
        stopWhen: stepCountIs(5), // REQUIRED: Enables multi-turn tool usage in one request
        system: fullSystemPrompt,
        messages: await convertToModelMessages(messages),
        onFinish: (event) => {
            logger.info('Stream finished', {
                finishReason: event.finishReason,
                usage: event.usage
            });
        },
        onError: (error) => {
            logger.error('Stream error', error);
        },
        tools: {
            getDiagnosticQuestion: tool({
                description: 'Get a diagnostic question to assess a specific Technostress Creator, optionally matching the user\'s description',
                inputSchema: z.object({
                    creator: z.enum(['Techno-Overload', 'Techno-Invasion', 'Techno-Complexity', 'Techno-Insecurity', 'Techno-Uncertainty', 'General']),
                    userDescription: z.string().optional().describe('The user\'s description of their situation, used for semantic matching'),
                }),
                execute: async ({ creator, userDescription }: { creator: string, userDescription?: string }) => {
                    logger.info('Tool call: getDiagnosticQuestion', { creator, userDescription });
                    try {
                        if (userDescription) {
                            const { embed } = await import('ai');
                            const { embedding } = await embed({
                                model: openai.embedding('text-embedding-3-small'),
                                value: userDescription,
                            });
                            const question = await findRelevantDiagnosticQuestion(embedding, creator, 1);
                            if (question) {
                                const result = {
                                    question: question.Diagnostic_Question,
                                    creator: question.Technostress_Creator,
                                };
                                logger.info('Tool result: getDiagnosticQuestion (semantic)', result);
                                return result;
                            }
                        }
                        // Fallback: random question by creator
                        const questions = getQuestionsByCreator(creator);
                        const randomQ = questions[Math.floor(Math.random() * questions.length)];
                        const result = {
                            question: randomQ.Diagnostic_Question,
                            creator: randomQ.Technostress_Creator
                        };
                        logger.info('Tool result: getDiagnosticQuestion', result);
                        return result;
                    } catch (e) {
                        logger.error('Tool error: getDiagnosticQuestion', e);
                        // Graceful fallback to random selection
                        const questions = getQuestionsByCreator(creator);
                        const randomQ = questions[Math.floor(Math.random() * questions.length)];
                        return {
                            question: randomQ.Diagnostic_Question,
                            creator: randomQ.Technostress_Creator
                        };
                    }
                },
            }),
            startBreathingExercise: tool({
                description: 'Start a guided breathing exercise widget in the chat. Use this when suggesting a breathing or relaxation exercise to the user.',
                inputSchema: z.object({
                    pattern: z.enum(['box', '4-7-8', 'calm']).describe('The breathing pattern to use'),
                }),
                execute: async ({ pattern }) => {
                    const patterns = {
                        box: { inhale: 4, hold: 4, exhale: 4, holdAfter: 4 },
                        '4-7-8': { inhale: 4, hold: 7, exhale: 8, holdAfter: 0 },
                        calm: { inhale: 4, hold: 2, exhale: 6, holdAfter: 0 },
                    };
                    return { pattern: patterns[pattern] || patterns.box, name: pattern };
                },
            }),
            suggestReplies: tool({
                description: 'Generate 2-3 short suggested reply options for the user based on the current conversation context. Call this after every assistant response.',
                inputSchema: z.object({
                    replies: z.array(z.string().max(60)).min(2).max(3).describe('Short reply options the user can click'),
                }),
                execute: async ({ replies }) => {
                    return { replies };
                },
            }),
            suggestStrategies: tool({
                description: 'Find relevant coping strategies based on the user\'s problem description',
                inputSchema: z.object({
                    problemDescription: z.string().describe('The user\'s description of their stress or the identified Technostress Creator'),
                    rejectedStrategies: z.array(z.string()).optional().describe('List of strategy names that the user has already rejected'),
                }),
                execute: async ({ problemDescription, rejectedStrategies = [] }: { problemDescription: string, rejectedStrategies?: string[] }) => {
                    logger.info('Tool call: suggestStrategies', { problemDescription, rejectedStrategies });
                    const { embed } = await import('ai');
                    try {
                        const { embedding } = await embed({
                            model: openai.embedding('text-embedding-3-small'),
                            value: problemDescription,
                        });

                        const strategies = await findRelevantStrategies(embedding);

                        // Filter out rejected strategies
                        const filteredStrategies = strategies.filter(s => !rejectedStrategies.includes(s.strategy.name));

                        const result = {
                            found: filteredStrategies.length > 0,
                            strategies: filteredStrategies.map(s => ({
                                name: s.strategy.name,
                                description: s.strategy.short_description,
                                steps: s.strategy.application_explanation
                            }))
                        };
                        logger.info('Tool result: suggestStrategies', { count: filteredStrategies.length });
                        return result;
                    } catch (e) {
                        logger.error('Tool error: suggestStrategies', e);
                        return { found: false, error: "Could not search strategies." };
                    }
                },
            }),
        },
    });

    // Use the available response method as per the provided documentation.
    return result.toUIMessageStreamResponse();
}
