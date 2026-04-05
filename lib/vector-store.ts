import { getPineconeIndex } from './pinecone';
import type { CopingStrategy, DiagnosticQuestion } from './data';

export async function findRelevantStrategies(queryEmbedding: number[], topK: number = 3): Promise<CopingStrategy[]> {
    const index = getPineconeIndex();

    const results = await index.query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true,
        namespace: 'strategies',
    });

    return (results.matches || []).map((match) => ({
        technostress_creator: match.metadata?.technostress_creator as string,
        strategy: {
            name: match.metadata?.strategy_name as string,
            short_description: match.metadata?.short_description as string,
            application_explanation: match.metadata?.application_explanation as string,
            type: match.metadata?.type as string,
        },
    }));
}

export async function findRelevantDiagnosticQuestion(
    queryEmbedding: number[],
    creator?: string,
    topK: number = 1
): Promise<DiagnosticQuestion | null> {
    const index = getPineconeIndex();

    const queryOptions: {
        vector: number[];
        topK: number;
        includeMetadata: boolean;
        namespace: string;
        filter?: Record<string, unknown>;
    } = {
        vector: queryEmbedding,
        topK,
        includeMetadata: true,
        namespace: 'diagnostic-questions',
    };

    if (creator && creator !== 'General') {
        queryOptions.filter = {
            technostress_creator: { $eq: creator },
        };
    }

    const results = await index.query(queryOptions);

    if (!results.matches?.length) return null;

    const best = results.matches[0];
    return {
        Technostress_Creator: best.metadata?.technostress_creator as string,
        Definition: best.metadata?.definition as string,
        Diagnostic_Question: best.metadata?.diagnostic_question as string,
        Example_User_Statement: best.metadata?.example_user_statement as string,
    };
}
