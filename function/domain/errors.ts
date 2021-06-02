export function handleBadRequest(message: string) {
    return {
        statusCode: 500,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: 'FAILED',
            error: message,
            stack: null
        })
    }
}

export function handleError(e: Error) {
    return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: 'FAILED',
            error: e.message,
            stack: e.stack
        })
    }
}