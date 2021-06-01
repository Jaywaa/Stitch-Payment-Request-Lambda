import assert from 'assert';

export class BadUserInputError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export function handleError(e: Error) {
    let statusCode: number;
    let body = {
        type: 'FAILED',
        error: e.message,
        stack: e.stack
    };

    switch (e.constructor) {
        case BadUserInputError: {
            statusCode = 400;
            break;
        }
        case assert.AssertionError:
        default: {
            statusCode = 500;
        }
    }

    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }
}