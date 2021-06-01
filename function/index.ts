import { APIGatewayEvent, Context } from 'aws-lambda';
import { generateClientAssertion, retrievePaymentToken } from './stitch/retrieve-client-token';
import { getSettings } from './domain/settings';
import { BadUserInputError, handleError } from './domain/errors';
import { createPaymentRequest } from './stitch/operations/payment-request-create';
import assert from 'assert';

// URL: /generate-payment?quantity=<quantity>&payerRef=payer%20reference&beneficiaryRef=beneficiary%20reference
export async function handler (
    event: APIGatewayEvent,
    _context: Context
) {
    try {
        const { amount, payerReference, beneficiaryReference } = parseQueryStringParameters(event.queryStringParameters);

        const { stitchClientId, stitchClientCertificate, bankAccount } = getSettings();

        const clientAssertion = await generateClientAssertion(stitchClientId, stitchClientCertificate);

        const token = await retrievePaymentToken(stitchClientId, clientAssertion);

        const { url, id } = await createPaymentRequest(token, amount, bankAccount, payerReference, beneficiaryReference);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'SUCCESS',
                url,
                id
            })
        }
    } catch (e) {
        return handleError(e);
    }
}

function parseQueryStringParameters(queryParams: { [name: string]: string | undefined } | null): { amount: number, payerReference: string, beneficiaryReference: string } {
    const validationErrors: string[] = [];

    if (!queryParams) {
        throw new BadUserInputError('Query parameters were not defined.');
    }

    const payerReference = queryParams.payerRef;
    const beneficiaryReference = queryParams.beneficiaryRef;
    const quantity = parseFloat(queryParams.quantity || '-1');

    if (!payerReference) {
        validationErrors.push('Quantity was not defined.');
    }
    if (isNaN(quantity) || quantity <= 0) {
        validationErrors.push('Quantity was not valid. Must be a number greater than 0.');
    }
    if (!beneficiaryReference) {
        validationErrors.push('Beneficiary reference was not defined.');
    }

    if (validationErrors.length > 0) {
        throw new BadUserInputError(`${JSON.stringify(validationErrors)}`);
    }

    assert(payerReference);
    assert(beneficiaryReference);

    return { amount: quantity, payerReference: payerReference, beneficiaryReference };
}