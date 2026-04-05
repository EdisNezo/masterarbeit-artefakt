import items from '@/assets/technostress-items.json';
import strategies from '@/assets/technostress-strategies.json';

export interface DiagnosticQuestion {
    Technostress_Creator: string;
    Definition: string;
    Diagnostic_Question: string;
    Example_User_Statement: string;
}

export interface CopingStrategy {
    technostress_creator: string;
    strategy: {
        name: string;
        short_description: string;
        application_explanation: string;
        type: string;
    };
}

// Re-export data
export const diagnosticQuestions: DiagnosticQuestion[] = items as DiagnosticQuestion[];
export const copingStrategies: CopingStrategy[] = strategies as CopingStrategy[];

/**
 * Get questions filtered by Creator (optional)
 */
export function getQuestionsByCreator(creator?: string): DiagnosticQuestion[] {
    if (!creator) return diagnosticQuestions;
    return diagnosticQuestions.filter(q => q.Technostress_Creator.toLowerCase() === creator.toLowerCase());
}

/**
 * Get strategies filtered by Creator (optional)
 */
export function getStrategiesByCreator(creator?: string): CopingStrategy[] {
    if (!creator) return copingStrategies;
    return copingStrategies.filter(s => s.technostress_creator.toLowerCase() === creator.toLowerCase());
}
