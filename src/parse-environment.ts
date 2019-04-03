export interface OAuth2Options {
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
}

const {
  TEAMLEADER_CLIENT_ID: clientId,
  TEAMLEADER_CLIENT_SECRET: clientSecret,
  TEAMLEADER_REDIRECT_URL: redirectUrl
} = process.env;

export function parseEnvironment(): OAuth2Options {
  if (!clientId) {
    throw new Error("Missing client ID in environment.");
  }

  if (!clientSecret) {
    throw new Error("Missing client secret in environment.");
  }

  if (!redirectUrl) {
    throw new Error("Missing redirect URI in environment.");
  }

  return {
    clientId,
    clientSecret,
    redirectUrl
  };
}
