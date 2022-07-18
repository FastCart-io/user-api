import { LoggerService, LogLevel } from "@nestjs/common";

/**
 * Logger class
 * Template for logging
 */
export class Logger implements LoggerService {

    log(message: any, ...optionalParams: any[]) {
        throw new Error("Method not implemented.");
    }

    error(message: any, ...optionalParams: any[]) {
        throw new Error("Method not implemented.");
    }

    warn(message: any, ...optionalParams: any[]) {
        throw new Error("Method not implemented.");
    }

    debug?(message: any, ...optionalParams: any[]) {
        throw new Error("Method not implemented.");
    }

    verbose?(message: any, ...optionalParams: any[]) {
        throw new Error("Method not implemented.");
    }

    setLogLevels?(levels: LogLevel[]) {
        throw new Error("Method not implemented.");
    }

}

export function getLevel(env: string): LogLevel[] {

    switch (env) {
        case 'development':
            return ['error', 'warn', 'log', 'verbose', 'debug'];
        case 'production':
            return ['log', 'warn', 'error'];
        case 'test':
            return ['error', 'warn', 'log', 'verbose', 'debug'];
        default:
            return ['error', 'warn', 'log', 'verbose', 'debug'];
    }
}