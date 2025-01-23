import * as winston from 'winston';
import colors from '@colors/colors';

import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

// Define the custom format with explicit casting
const myFormat = winston.format.printf(({ level, message, timestamp }: { level: string; message: unknown; timestamp?: string }) => {
    // Cast message to a string
    const colorizedMessage = (() => {
        const msg = String(message); // Ensure message is treated as a string
        switch (level) {
            case 'error':
                return colors.red(msg);
            case 'warn':
                return colors.yellow(msg);
            case 'info':
                return colors.green(msg);
            case 'debug':
                return colors.cyan(msg);
            default:
                return msg;
        }
    })();

    return `${timestamp} ${level}: ${colorizedMessage}`;
});

// Create a logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        myFormat
    ),
    transports: [
        new winston.transports.Console()
    ]
});

export default logger;