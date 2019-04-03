import {
  Adapter,
  Config,
  Contact,
  PhoneNumber,
  PhoneNumberLabel,
  start
} from "@clinq/bridge";
import { Request } from "express";
import { parseEnvironment } from "./parse-environment";
import { stringify } from "querystring";
import axios from "axios";
import { OAuth2Response } from "./oauth2-response.model";

const TEAMLEADER_API_URL_BASE = "https://app.teamleader.eu";
const TEAMLEADER_API_URL_AUTHORIZE = "/oauth2/authorize";
const TEAMLEADER_API_URL_ACCESS_TOKEN = "/oauth2/access_token";
const TEAMLEADER_API_URL_ACCESS_CONTACTS = "/contacts.list";

const { clientId, clientSecret, redirectUrl } = parseEnvironment();

class MyAdapter implements Adapter {
  /**
   * TODO: Fetch contacts from the contacts provider using config.apiKey and config.apiUrl or throw on error
   */
  public async getContacts(config: Config): Promise<Contact[]> {
    const tokenUrl = `${TEAMLEADER_API_URL_BASE}${TEAMLEADER_API_URL_ACCESS_TOKEN}`;
    const contactsUrl = `${TEAMLEADER_API_URL_BASE}${TEAMLEADER_API_URL_ACCESS_CONTACTS}`;

    const response = await axios.post<OAuth2Response>(tokenUrl, {
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: config.apiKey,
      grant_type: "refresh_token"
    });
    console.log(response.data.access_token);
    const contactsResponse = await axios.get(contactsUrl, {
      headers: {
        Authorization: `Bearer ${response.data.access_token}`
      }
    });

    console.log(contactsResponse.data);
    return [];
  }

  public async getOAuth2RedirectUrl(): Promise<string> {
    const query = stringify({
      client_id: clientId,
      response_type: "code",
      redirect_uri: redirectUrl
    });
    return `${TEAMLEADER_API_URL_BASE}${TEAMLEADER_API_URL_AUTHORIZE}?${query}`;
  }

  public async handleOAuth2Callback(req: Request): Promise<Config> {
    const { code } = req.query;
    const tokenUrl = `${TEAMLEADER_API_URL_BASE}${TEAMLEADER_API_URL_ACCESS_TOKEN}`;

    const data = {
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: redirectUrl
    };

    const response = await axios.post<OAuth2Response>(tokenUrl, data);

    return { apiKey: response.data.refresh_token, apiUrl: "" };
  }
}

start(new MyAdapter());
