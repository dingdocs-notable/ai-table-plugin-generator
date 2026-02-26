import express, { Request, Response } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';

// Load environment variables from .env.server
dotenv.config({ path: 'local_server/.env.server' });

const app = express();
const PORT = 3001;

app.use(express.json());

// Store for caching access tokens and jsapi tickets
const tokenCache: {
  accessToken: string | null;
  accessTokenExpiry: number;
  jsapiTicket: string | null;
  jsapiTicketExpiry: number;
} = {
  accessToken: null,
  accessTokenExpiry: 0,
  jsapiTicket: null,
  jsapiTicketExpiry: 0,
};

// Type definitions
type AccessTokenResponse = {
  accessToken: string;
  expireIn: number;
};

type JsapiTicketResponse = {
  jsapiTicket: string;
  expireIn: number;
};

/**
 * Get access token from DingTalk API
 */
async function getAccessToken(): Promise<{ accessToken: string; expiresIn: number }> {
  // Check if we have a cached token that's still valid
  if (tokenCache.accessToken && Date.now() < tokenCache.accessTokenExpiry) {
    console.log('Using cached access token');
    return { accessToken: tokenCache.accessToken, expiresIn: 7200 };
  }

  const appKey = process.env.DINGTALK_APPKEY || '';
  const appSecret = process.env.DINGTALK_APPSECRET || '';

  if (!appKey || !appSecret) {
    throw new Error('DINGTALK_APPKEY and DINGTALK_APPSECRET must be set in environment variables');
  }

  // Request access token from DingTalk API
  const response = await axios.post('https://api.dingtalk.com/v1.0/oauth2/accessToken', {
    appKey,
    appSecret,
  });

  const data: AccessTokenResponse = response.data;

  // Cache the token with expiry time (current time + expireIn - 300 seconds for safety)
  tokenCache.accessToken = data.accessToken;
  tokenCache.accessTokenExpiry = Date.now() + (data.expireIn - 300) * 1000;

  console.log('Got new access token from DingTalk API');
  return { accessToken: data.accessToken, expiresIn: data.expireIn };
}

/**
 * Get jsapi ticket from DingTalk API
 */
async function getJsapiTicket(accessToken: string): Promise<{ jsapiTicket: string; expiresIn: number }> {
  // Check if we have a cached ticket that's still valid
  if (tokenCache.jsapiTicket && Date.now() < tokenCache.jsapiTicketExpiry) {
    console.log('Using cached jsapi ticket');
    return { jsapiTicket: tokenCache.jsapiTicket, expiresIn: 7200 };
  }

  // Request jsapi ticket from DingTalk API
  const response = await axios.post(
    'https://api.dingtalk.com/v1.0/oauth2/jsapiTickets',
    {},
    {
      headers: {
        'x-acs-dingtalk-access-token': accessToken,
      },
    }
  );

  const data: JsapiTicketResponse = response.data;

  // Cache the ticket with expiry time (current time + expireIn - 300 seconds for safety)
  tokenCache.jsapiTicket = data.jsapiTicket;
  tokenCache.jsapiTicketExpiry = Date.now() + (data.expireIn - 300) * 1000;

  console.log('Got new jsapi ticket from DingTalk API');
  return { jsapiTicket: data.jsapiTicket, expiresIn: data.expireIn };
}

/**
 * Calculate signature for dd.config
 */
function calculateSignature(jsapiTicket: string, nonceStr: string, timeStamp: number, url: string): string {
  try {
    // Create the string to sign using SHA-1 (as per DingTalk's expected algorithm)
    const plain = `jsapi_ticket=${jsapiTicket}&noncestr=${nonceStr}&timestamp=${timeStamp}&url=${decodeUrl(url)}`;
    const sha1 = crypto.createHash('sha1');
    sha1.update(plain, 'utf8');
    return sha1.digest('hex');
  } catch (error) {
    console.error('Error in calculateSignature function:', error);
    throw error;
  }
}

/**
 * Because iOS passes URL that is encoded, but Android passes the original URL.
 * So we need to decode the parameters as a regular URL decode
 */
function decodeUrl(urlString: string): string {
  try {
    const parsedUrl = new URL(urlString);
    let urlBuffer = `${parsedUrl.protocol}//`;
    if (parsedUrl.host) {
      urlBuffer += parsedUrl.host;
    }
    if (parsedUrl.pathname) {
      urlBuffer += parsedUrl.pathname;
    }
    if (parsedUrl.search) {
      urlBuffer += `?${decodeURIComponent(parsedUrl.search.substring(1))}`;
    }
    return urlBuffer;
  } catch (error) {
    console.error('Error in decodeUrl function:', error);
    throw error;
  }
}

// Endpoint to get DingTalk access token
app.get('/api/accessToken', async (req: Request, res: Response) => {
  try {
    const { accessToken } = await getAccessToken();
    res.json({
      accessToken,
      expiresAt: new Date(tokenCache.accessTokenExpiry).toISOString(),
      expiryIn: Math.floor((tokenCache.accessTokenExpiry - Date.now()) / 1000)
    });
  } catch (error) {
    console.error('Error getting access token:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: Date.now()
    });
  }
});

// Endpoint to get DingTalk jsapi ticket
app.get('/api/jsapiTicket', async (req: Request, res: Response) => {
  try {
    const { accessToken } = await getAccessToken();
    const { jsapiTicket } = await getJsapiTicket(accessToken);
    res.json({
      jsapiTicket,
      expiresAt: new Date(tokenCache.jsapiTicketExpiry).toISOString(),
      expiryIn: Math.floor((tokenCache.jsapiTicketExpiry - Date.now()) / 1000)
    });
  } catch (error) {
    console.error('Error getting jsapi ticket:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: Date.now()
    });
  }
});

// Endpoint to get permission config for DingTalk
app.get('/api/configPermission', async (req: Request, res: Response) => {
  try {
    const url = req.query.url as string;

    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    // Get agentId and corpId from environment variables
    const agentId = process.env.DINGTALK_AGENT_ID || '';
    const corpId = process.env.DINGTALK_CORP_ID || '';

    if (!agentId || !corpId) {
      return res.status(400).json({ error: 'DINGTALK_AGENT_ID and DINGTALK_CORP_ID must be set in environment variables' });
    }

    const { accessToken } = await getAccessToken();
    const { jsapiTicket } = await getJsapiTicket(accessToken);

    // Generate timestamp and nonce string
    const timeStamp = Date.now();
    const nonceStr = Math.random().toString(36).substr(2, 15);

    // Calculate signature
    const signature = calculateSignature(jsapiTicket, nonceStr, timeStamp, url);

    res.json({
      agentId,
      corpId,
      timeStamp,
      nonceStr,
      signature,
      jsApiList: ['DingdocsScript.base.readWriteAll'],
      url
    });
  } catch (error) {
    console.error('Error getting config permission:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: Date.now()
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`DingTalk API server is running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log(`  GET  http://localhost:${PORT}/api/accessToken - Get access token`);
  console.log(`  GET  http://localhost:${PORT}/api/jsapiTicket - Get JSAPI ticket`);
  console.log(`  GET  http://localhost:${PORT}/api/configPermission?url=<url> - Get config permission`);
  console.log('');
  console.log('Make sure to set the following environment variables:');
  console.log('  DINGTALK_APPKEY - Your DingTalk app key');
  console.log('  DINGTALK_APPSECRET - Your DingTalk app secret');
  console.log('  DINGTALK_AGENT_ID - Your DingTalk agent ID');
  console.log('  DINGTALK_CORP_ID - Your DingTalk corp ID');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  process.exit(0);
});