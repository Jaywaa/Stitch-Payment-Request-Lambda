import fetch from 'node-fetch';

export async function fetchGraphQL(token: string, operation: string, operationName: string, variables: any) {
    console.time('[GENERATE_PAYMENT/FETCH_GRAPHQL]');
    const response = await fetch(
        "https://api.stitch.money/graphql",
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                query: operation,
                variables: variables,
                operationName: operationName
            })
        }
    );

    console.timeEnd('[GENERATE_PAYMENT/FETCH_GRAPHQL]');

    const contentType = response.headers.get('Content-Type');
    if (contentType !== 'application/json') {
        throw new Error(`[fetchGraphQL] Expected JSON response but received ${contentType}. Response: ${await response.text()}`);
    }

    return response.json();
}
