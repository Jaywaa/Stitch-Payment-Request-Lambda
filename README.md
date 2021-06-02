# Stitch Payment Request Lambda

A lambda that retrieves a token, and uses it to create a Stitch [PaymentInitiationRequest](https://stitch.money/docs/stitch-api/payment-requests) and returns the URL and ID

## ⚠️ Warning
This function offers no authorization. It accepts beneficiary information via the POST body, and it is strongly recommended you secure this function to avoid malicious generation of payment requests using your client information. See: [Lambda authorizers](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html)

## Code
If you're just here to see code examples for integrating with the Stitch API. The files you'll want are:
1. `function/stitch/retrieve-client-token.ts` -- generates a client assertion and fetches a token.
2. `function/stitch/payment-request-create.ts` -- builds the GraphQL query to generate a PaymentInitiationRequest
3. `function/stitch/fetch-graqhql.ts` -- simply executes the network request to the Stitch API

## Getting started
If you would like to implement and deploy the function, you'll need to follow the guide below.

### 1. Set up environment
Take a look at `function/settings.ts` to see how the environment variables are loaded.
In order to run the Lambda, the following environment variables will need to be present: 

* `STITCH_PRIVATE_KEY` -- the private key portion of the certificate issued to you by Stitch.
* `STITCH_CLIENT_ID` -- the client ID issued to you by Stitch.

This will need to be done locally, and on the environment the lambda will be running, see: [Configuring environment variables for AWS Lambdas](https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html).
If you would rather set these values using a different method, you will need to configure that behaviour in `function/settings.ts`.

### 2. Running locally
Install: `npm run install`

Build: `npm run build`

### 3. Invoking function
Curl example (replace the function URL, and beneficiary information):
```bash
curl --request POST \
  --url <FUNCTION-URL> \
  --header 'Content-Type: application/json' \
  --data '{
	"quantity": 1,
	"currency": "ZAR",
	"payerReference": "Test",
	"beneficiaryReference": "Test",
	"beneficiaryBank": "<BANK-ID>",
	"beneficiaryAccountNum": "<BENEFICIARY-ACCOUNT-NUMBER>",
	"beneficiaryName": "<BENEFICIARY-NAME>"
}'
```

### Community
Please direct any conversation to the [Stitch Slack community](stitch-community.slack.com)
