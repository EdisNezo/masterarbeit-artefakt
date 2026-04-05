import { Pinecone } from '@pinecone-database/pinecone';

let pineconeClient: Pinecone | null = null;

function getPineconeClient(): Pinecone {
    if (!pineconeClient) {
        if (!process.env.PINECONE_API_KEY) {
            throw new Error('PINECONE_API_KEY environment variable is not set');
        }
        pineconeClient = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });
    }
    return pineconeClient;
}

export function getPineconeIndex() {
    const client = getPineconeClient();
    const indexName = process.env.PINECONE_INDEX;
    if (!indexName) {
        throw new Error('PINECONE_INDEX environment variable is not set');
    }
    return client.index({ name: indexName });
}
