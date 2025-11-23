// Minimal API test to understand the response structure
export async function testMinimalAPI(): Promise<void> {
  const AGENT_ID = import.meta.env.VITE_WXO_AGENT_ID as string;
  const BEARER_TOKEN = import.meta.env.VITE_WXO_BEARER_TOKEN as string;

  console.log('🧪 Testing minimal API call...');
  console.log('Agent ID:', AGENT_ID);
  console.log('Token (first 20 chars):', BEARER_TOKEN?.substring(0, 20) + '...');

  // Test the exact endpoint we've been using
  const url = `/api/v1/orchestrate/${AGENT_ID}/chat/completions`;
  
  try {
    console.log(`📡 Making request to: ${url}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'SWASTIK-Chat/1.0',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }]
      })
    });

    console.log(`📊 Response status: ${response.status} ${response.statusText}`);
    console.log('📋 Response headers:');
    response.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });

    const responseText = await response.text();
    console.log('📄 Raw response body:', responseText);

    if (responseText) {
      try {
        const jsonData = JSON.parse(responseText);
        console.log('📦 Parsed JSON:', jsonData);
      } catch {
        console.log('⚠️ Response is not valid JSON');
      }
    }

  } catch (error) {
    console.error('❌ Request failed:', error);
  }
}