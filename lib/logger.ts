export const logger = {
    info: (message: string, meta?: any) => {
        console.log(JSON.stringify({ level: 'info', message, ...meta, timestamp: new Date().toISOString() }));
    },
    error: (message: string, error?: any) => {
        console.error(JSON.stringify({ level: 'error', message, error: typeof error === 'object' ? { message: error.message, stack: error.stack } : error, timestamp: new Date().toISOString() }));
    },
    debug: (message: string, meta?: any) => {
        // Only log debug in development if needed, or always if debugging
        console.log(JSON.stringify({ level: 'debug', message, ...meta, timestamp: new Date().toISOString() }));
    }
};
