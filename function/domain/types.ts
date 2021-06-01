export type PaymentRequestInputs = {
    currency: string,
    quantity: number,
    payerReference: string,
    beneficiaryReference: string,
    beneficiaryAccountNum: string,
    beneficiaryBank: string,
    beneficiaryName: string
}

export type BeneficiaryBankAccount = {
    accountNumber: string,
    bank: string
}

export type StitchError = {
    message: string,
    locations: { line: number, column: number }[],
    path?: string[],
    extensions: { code: string }
}

export type PaymentInitiationResponse = {
    id: string
    url: string,
}