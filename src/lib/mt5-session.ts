import MT5Bridge from '@/lib/mt5-bridge';

export interface MT5SessionInfo {
  connected: boolean;
  sessionId: string | null;
  accountLogin: number | null;
  accountServer: string | null;
}

export async function getMT5Session(): Promise<MT5SessionInfo> {
  const bridge = new MT5Bridge();
  const response = await fetch(`${bridge['apiBaseUrl']}/session`);

  if (!response.ok) {
    return { connected: false, sessionId: null, accountLogin: null, accountServer: null };
  }

  const data = await response.json();
  return {
    connected: data.connected,
    sessionId: data.session_id || null,
    accountLogin: data.account_login || null,
    accountServer: data.account_server || null,
  };
}
