import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import fetch from 'node-fetch';

export async function retrieveClientToken(clientId: string, clientCertificatePem: string) {
    const clientAssertion = await generateClientAssertion(clientId, clientCertificatePem)

    const body = {
        grant_type: 'client_credentials',
        client_id: clientId,
        scope: 'client_paymentrequest',
        audience: 'https://secure.stitch.money/connect/token',
        client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
        client_assertion: clientAssertion
    };

    const bodyString = Object.entries(body).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');

    const response = await fetch('https://secure.stitch.money/connect/token', {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: bodyString,
    });

    const responseBody = await response.json();

    if (!response.ok) {
        throw new Error(`Failed to retrieve tokens. ${JSON.stringify(responseBody)}`)
    }

    if (!('access_token' in responseBody)) {
        throw new Error(`access_token was not found in response: ${JSON.stringify(responseBody)}`);
    }

    return responseBody.access_token;
}

async function generateClientAssertion(clientId: string, clientCertificatePem: string): Promise<string> {
    const issuer = clientId;
    const subject = clientId;
    const audience = 'https://secure.stitch.money/connect/token';
    const keyId = 'B1C03CC823141F35361452AA242EFE132B1D0C50';
    const jwtId = crypto.randomBytes(16).toString('hex');

    const options: SignOptions = {
        keyid: keyId,
        jwtid: jwtId,
        notBefore: "0",
        issuer,
        subject,
        audience,
        expiresIn: "30s",
        algorithm: "RS256"
    };

    return jwt.sign({}, clientCertificatePem, options);
}