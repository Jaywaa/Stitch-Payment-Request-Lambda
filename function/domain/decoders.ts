import { PaymentRequestInputs } from './types';
import { Decoder, number, object, string } from 'decoders';

export const requestBodyDecoder: Decoder<PaymentRequestInputs> = object({
    currency: string,
    quantity: number,
    payerReference: string,
    beneficiaryReference: string,
    beneficiaryAccountNum: string,
    beneficiaryBank: string,
    beneficiaryName: string
});
