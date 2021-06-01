import assert from 'assert';
import { buildStitchCertificate } from '../stitch/stitch-public-certificate';

type Settings = {
    stitchClientId: string
    stitchClientCertificate: string
}

export function getSettings(): Settings {
    // Importing private key from environment variables, but could read this from disk too.
    // Keep it secret. It should not be checked into your repository.
    let { STITCH_PRIVATE_KEY } = process.env;
    const { STITCH_CLIENT_ID } = process.env;

    assert(STITCH_CLIENT_ID, 'Expected STITCH_CLIENT_ID to be defined in order to generate a client assertion.');
    assert(STITCH_PRIVATE_KEY, 'Expected STITCH_PRIVATE_KEY to be defined in order to generate a client assertion.');

    // have used '\\n' characters as line breaks in the environment variable
    STITCH_PRIVATE_KEY = STITCH_PRIVATE_KEY.split('\\n').join('\n');

    return {
        stitchClientId: STITCH_CLIENT_ID,
        stitchClientCertificate: buildStitchCertificate(STITCH_PRIVATE_KEY),
    }
}