import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import strategies from '../assets/technostress-strategies.json';
import diagnosticItems from '../assets/technostress-items.json';

dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
});

function normalizeCreator(creator: string): string {
    return creator
        .split(' / ')
        .map(part =>
            part.split('-').map((word, i) =>
                i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join('-')
        )
        .join(' / ');
}

function slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function embedText(text: string): Promise<number[]> {
    const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        dimensions: 512,
    });
    return response.data[0].embedding;
}

async function seedStrategies() {
    console.log('\n--- Seeding strategies namespace ---');
    const index = pinecone.index({ name: process.env.PINECONE_INDEX! });

    const records = [];
    for (const item of strategies) {
        const textToEmbed = `${item.strategy.name}. ${item.strategy.short_description}. ${item.strategy.application_explanation}`;

        try {
            const embedding = await embedText(textToEmbed);
            records.push({
                id: `strategy-${slugify(item.strategy.name)}`,
                values: embedding,
                metadata: {
                    strategy_name: item.strategy.name,
                    short_description: item.strategy.short_description,
                    application_explanation: item.strategy.application_explanation,
                    type: item.strategy.type,
                    technostress_creator: normalizeCreator(item.technostress_creator),
                    text: textToEmbed,
                },
            });
            console.log(`  Embedded: ${item.strategy.name}`);
        } catch (error) {
            console.error(`  Error embedding ${item.strategy.name}:`, error);
        }
    }

    // Upsert in batches of 100
    for (let i = 0; i < records.length; i += 100) {
        const batch = records.slice(i, i + 100);
        await index.upsert({ records: batch, namespace: 'strategies' });
        console.log(`  Upserted batch ${Math.floor(i / 100) + 1} (${batch.length} vectors)`);
    }
    console.log(`Strategies done: ${records.length} vectors upserted.`);
}

async function seedDiagnosticQuestions() {
    console.log('\n--- Seeding diagnostic-questions namespace ---');
    const index = pinecone.index({ name: process.env.PINECONE_INDEX! });

    const records = [];
    for (let i = 0; i < diagnosticItems.length; i++) {
        const item = diagnosticItems[i];
        const textToEmbed = `${item.Diagnostic_Question}. ${item.Definition}`;

        try {
            const embedding = await embedText(textToEmbed);
            records.push({
                id: `diagnostic-${i}`,
                values: embedding,
                metadata: {
                    technostress_creator: normalizeCreator(item.Technostress_Creator),
                    definition: item.Definition,
                    diagnostic_question: item.Diagnostic_Question ?? '',
                    example_user_statement: item.Example_User_Statement ?? '',
                },
            });

            if ((i + 1) % 50 === 0) {
                console.log(`  Embedded ${i + 1}/${diagnosticItems.length} questions...`);
            }
        } catch (error) {
            console.error(`  Error embedding diagnostic item ${i}:`, error);
        }
    }

    // Upsert in batches of 100
    for (let i = 0; i < records.length; i += 100) {
        const batch = records.slice(i, i + 100);
        await index.upsert({ records: batch, namespace: 'diagnostic-questions' });
        console.log(`  Upserted batch ${Math.floor(i / 100) + 1} (${batch.length} vectors)`);
    }
    console.log(`Diagnostic questions done: ${records.length} vectors upserted.`);
}

async function main() {
    console.log('Starting Pinecone seed...');
    console.log(`Index: ${process.env.PINECONE_INDEX}`);

    await seedStrategies();
    await seedDiagnosticQuestions();

    console.log('\nAll done!');
}

main();
