import { Decoder, array, object, string, number, map, optional } from 'decoders';
import { PaymentInitiationResponse, StitchError } from '../domain/types';

export const stitchErrorDecoder: Decoder<StitchError[]> = array(object({
    message: string,
    extensions: object({ code: string }),
    locations: array(object({ line: number, column: number })),
    path: optional(array(string))
}));

export const stitchPaymentInitiationResponseDecoder: Decoder<PaymentInitiationResponse> = map(object({
    clientPaymentInitiationRequestCreate: object({
        paymentInitiationRequest: object({
            url: string,
            id: string
        })
    })
}), result => ({ ...result.clientPaymentInitiationRequestCreate.paymentInitiationRequest }));