// AWS Lambda doesn't allow environment variables > 4kb so checking in the public cert and injecting the private key
export const buildStitchCertificate = (privateKey: string) => `<hardcode the public key here>
${privateKey}
`