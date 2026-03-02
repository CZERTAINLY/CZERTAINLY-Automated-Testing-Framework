import { test } from '@playwright/test';

export class Logger {
    private context: string;

    constructor(context: string) {
        this.context = context;
    }


    private log(level: 'INFO' | 'ERROR' | 'WARN' | 'DEBUG', message: string, ...args: any[]) {
        const timestamp = new Date().toISOString();
        const formattedMessage = `[${timestamp}] [${level}] [${this.context}] ${message}`;

        switch (level) {
            case 'ERROR':
                console.error(formattedMessage, ...args);
                break;
            case 'WARN':
                console.warn(formattedMessage, ...args);
                break;
            case 'DEBUG':
                // Can be enabled only if the environment variable DEBUG=true is set
                if (process.env.DEBUG) {
                    console.log(formattedMessage, ...args);
                }
                break;
            default:
                console.log(formattedMessage, ...args);
                break;
        }
    }

    info(message: string, ...args: any[]) {
        this.log('INFO', message, ...args);
    }

    error(message: string, ...args: any[]) {
        this.log('ERROR', message, ...args);
    }

    warn(message: string, ...args: any[]) {
        this.log('WARN', message, ...args);
    }

    debug(message: string, ...args: any[]) {
        this.log('DEBUG', message, ...args);
    }
}
