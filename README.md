# Stitch Payment Request Lambda

A lambda that retrieves a token, and uses it to create a Stitch [PaymentInitiationRequest](https://stitch.money/docs/stitch-api/payment-requests) and returns the URL and ID

## Getting started

### 1. Set up environment
Take a look at `function/settings.ts` to see how the environment variables are loaded.
In order to run the Lambda, the following environment variables will need to be present: 

* `STITCH_PRIVATE_KEY` -- the private key portion of the certificate issued to you by Stitch.
* `STITCH_CLIENT_ID` -- the client ID issued to you by Stitch.

This will need to be done locally, and on the environment the lambda will be running, see: [Configuring environment variables for AWS Lambdas](https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html).
If you would rather set these values using a different method, you will need to configure that behaviour in `function/settings.ts`.

### 2. Running locally
Install: `npm run install`

Run: `npm run start`
