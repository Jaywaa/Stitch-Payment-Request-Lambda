import { fetchGraphQL } from './fetch-graphql';
import { BeneficiaryBankAccount } from '../../domain/types';
import { stitchErrorDecoder, stitchPaymentInitiationResponseDecoder } from '../decoders';
import { guard } from 'function/stitch/decoders';

export async function createPaymentRequest(token: string, amount: number, bankAccount: BeneficiaryBankAccount, payerReference: string, beneficiaryReference: string) {
    const { errors, data } = await fetchGraphQL(
        token,
        operation,
        "CreatePaymentRequest",
        {"amount": { quantity: `${amount}`, currency: 'ZAR' }, "accountNumber": bankAccount.accountNumber, "bank": bankAccount.bank, "payerReference": payerReference, "beneficiaryReference": beneficiaryReference}
    );

    if (errors) {
        const errorsResult = guard(stitchErrorDecoder)(errors);
        console.error('errors:', errorsResult);

        throw new Error(JSON.stringify(errorsResult));
    }

    return guard(stitchPaymentInitiationResponseDecoder)(data);
}

const operation = `mutation CreatePaymentRequest($amount: MoneyInput!, $accountNumber: String!, $bank: BankBeneficiaryBankId!, $payerReference: String!, $beneficiaryReference: String!) {
    clientPaymentInitiationRequestCreate(input: {amount: $amount, beneficiary: {bankAccount: {name: "James", bankId: $bank, accountNumber: $accountNumber}}, payerReference: $payerReference, beneficiaryReference: $beneficiaryReference}) {
      paymentInitiationRequest {
        id
        url
      }
    }
  }
`;