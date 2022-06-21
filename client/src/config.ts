const apiId = 'rf1so6tuy7'
const websocketId = 'g22xysisq3'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`
export const websocketEndpoint = `wss://${websocketId}.execute-api.us-east-2.amazonaws.com/dev`

export const authConfig = {
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-sxa20nr3.us.auth0.com',            // Auth0 domain
  clientId: 'lblWRgNbayOnlwykaNWp4V5YRlL0Mn5e',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
