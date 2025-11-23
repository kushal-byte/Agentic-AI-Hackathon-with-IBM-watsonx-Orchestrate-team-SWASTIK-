// Alternative API approach using IBM Cloud IAM token
export async function getIBMAccessToken(): Promise<string> {
  const IBM_API_KEY = import.meta.env.VITE_IBM_API_KEY as string;
  
  if (!IBM_API_KEY) {
    throw new Error('Missing IBM_API_KEY');
  }

  const response = await fetch('/iam/identity/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: new URLSearchParams({
      'grant_type': 'urn:ibm:params:oauth:grant-type:apikey',
      'apikey': IBM_API_KEY,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get IAM token: ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

export async function callCopilotWithIAM(message: string): Promise<string> {
  const AGENT_ID = import.meta.env.VITE_WXO_AGENT_ID as string;

  if (!AGENT_ID) {
    throw new Error('Missing AGENT_ID');
  }

  try {
    const accessToken = await getIBMAccessToken();
    console.log('Got fresh IBM access token');

    const url = `/api/v1/orchestrate/${AGENT_ID}/chat/completions`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        stream: false,
        messages: [{ role: 'user', content: message }],
      }),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? data.choices?.[0]?.content ?? JSON.stringify(data);
    
  } catch (error) {
    console.error('IAM token approach failed:', error);
    throw error;
  }
}