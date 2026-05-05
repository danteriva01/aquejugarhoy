import { RelyingParty } from 'openid';

const STEAM_OPENID_URL = 'https://steamcommunity.com/openid/login';

export function getSteamAuthUrl(returnUrl: string, realm: string) {
  const params = new URLSearchParams({
    'openid.ns': 'http://specs.openid.net/auth/2.0',
    'openid.mode': 'checkid_setup',
    'openid.return_to': returnUrl,
    'openid.realm': realm,
    'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
    'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
  });

  return `${STEAM_OPENID_URL}?${params.toString()}`;
}

export async function verifySteamAuth(reqUrl: string) {
  const urlObj = new URL(reqUrl);
  const params = Object.fromEntries(urlObj.searchParams.entries());

  const relyingParty = new RelyingParty(
    reqUrl.split('?')[0], // return_to
    urlObj.origin, // realm
    true, // stateless
    false, // strict
    [] // extensions
  );

  return new Promise((resolve, reject) => {
    relyingParty.verifyAssertion(reqUrl, (error, result) => {
      if (error) return reject(error);
      if (!result?.authenticated) return reject(new Error('Authentication failed'));

      // Extract steamID from claimed_id
      // claimed_id example: https://steamcommunity.com/openid/id/76561198050013067
      const steamId = result.claimedIdentifier?.split('/').pop();
      if (!steamId) return reject(new Error('Could not extract SteamID'));

      resolve(steamId);
    });
  });
}

export async function getSteamPlayerSummary(steamId: string, apiKey: string) {
  const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.response.players[0];
}
