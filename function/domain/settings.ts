import assert from 'assert';
import { buildStitchCertificate } from '../stitch/stitch-public-certificate';

type Settings = {
    stitchClientId: string
    stitchClientCertificate: string,
    bankAccount: { accountNumber: string, bank: string }
}

export function getSettings(): Settings {
    // Importing private key from environment variables, but could read this from disk too, or inject from CI pipeline
    // Keep it secret and don't check this into your repository.
    let { STITCH_PRIVATE_KEY } = process.env;
    const { STITCH_CLIENT_ID, BANK_ACCOUNT_JSON } = process.env;

    assert(STITCH_CLIENT_ID, 'Expected STITCH_CLIENT_ID to be defined in order to generate a client assertion.');
    assert(STITCH_PRIVATE_KEY, 'Expected STITCH_PRIVATE_KEY to be defined in order to generate a client assertion.');
    assert(BANK_ACCOUNT_JSON, 'Expected BANK_ACCOUNT_JSON to be defined in order to generate a payment request.');

    const { accountNumber, bank } = JSON.parse(BANK_ACCOUNT_JSON);
    STITCH_PRIVATE_KEY = STITCH_PRIVATE_KEY.split('\\n').join('\n');

    return {
        stitchClientId: STITCH_CLIENT_ID,
        stitchClientCertificate: buildStitchCertificate(STITCH_PRIVATE_KEY),
        bankAccount: { accountNumber, bank }
    }
}