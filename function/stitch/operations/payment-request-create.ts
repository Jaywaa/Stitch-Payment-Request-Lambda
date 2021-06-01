import { fetchGraphQL } from './fetch-graphql';
import { PaymentRequestInputs } from '../../domain/types';
import { stitchErrorDecoder, stitchPaymentInitiationResponseDecoder } from '../decoders';
import { guard } from 'decoders';

export async function createPaymentRequest(token: string, inputs: PaymentRequestInputs) {
    const { errors, data } = await fetchGraphQL(
        token,
        operation,
        'CreatePaymentRequest',
        {'amount': { quantity: `${inputs.quantity}`, currency: inputs.currency }, 'accountNumber': inputs.beneficiaryAccountNum, 'bank': inputs.beneficiaryBank, 'payerReference': inputs.payerReference, 'beneficiaryReference': inputs.beneficiaryReference, 'beneficiaryName': inputs.beneficiaryName }
    );

    if (errors) {
        const errorsResult = guard(stitchErrorDecoder)(errors);
        console.error('errors:', errorsResult);

        throw new Error(JSON.stringify(errorsResult));
    }

    return guard(stitchPaymentInitiationResponseDecoder)(data);
}

const operation = `mutation CreatePaymentRequest($amount: MoneyInput!, $accountNumber: String!, $beneficiaryName: String!, $bank: BankBeneficiaryBankId!, $payerReference: String!, $beneficiaryReference: String!) {
    clientPaymentInitiationRequestCreate(input: {amount: $amount, beneficiary: {bankAccount: {name: $beneficiaryName, bankId: $bank, accountNumber: $accountNumber}}, payerReference: $payerReference, beneficiaryReference: $beneficiaryReference}) {
      paymentInitiationRequest {
        id
        url
      }
    }
  }
`;