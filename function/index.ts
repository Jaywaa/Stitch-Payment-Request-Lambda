import { APIGatewayEvent, Context } from 'aws-lambda';
import { retrieveClientToken } from './stitch/retrieve-client-token';
import { getSettings } from './domain/settings';
import { createPaymentRequest } from './stitch/operations/payment-request-create';
import { guard } from 'decoders';
import { requestBodyDecoder } from './domain/decoders';

// For an example request body, see PaymentRequestInputs in function/domain/types.ts
// [POST]
export async function handler (
    event: APIGatewayEvent,
    _context: Context
) {
    try {
        const paymentRequestInputs = guard(requestBodyDecoder)(event.body);

        const { stitchClientId, stitchClientCertificate } = getSettings();

        // Generate a Stitch Client Token using the client Id and certificate (in PEM format)
        const token = await retrieveClientToken(stitchClientId, stitchClientCertificate);

        // Execute mutation on the Stitch API to generate a PaymentInitiationRequest
        const { url, id } = await createPaymentRequest(token, paymentRequestInputs);

        return {
            statusCode: 201,
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
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'FAILED',
                error: e.message,
                stack: e.stack
            })
        }
    }
}