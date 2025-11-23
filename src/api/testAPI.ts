export async function testAPIConnection(): Promise<void> {
  const AGENT_ID = import.meta.env.VITE_WXO_AGENT_ID as string;
  const BEARER_TOKEN = import.meta.env.VITE_WXO_BEARER_TOKEN as string;

  console.log('Testing API connection...');
  
  // Test 1: Check if we can reach the base API endpoint
  try {
    console.log('Test 1: Testing base API connectivity...');
    const baseResponse = await fetch('/api/v1/orchestrate', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Accept': 'application/json',
      },
    });
    
    console.log('Base API response status:', baseResponse.status);
    const baseText = await baseResponse.text();
    console.log('Base API response:', baseText);
  } catch (error) {
    console.error('Base API test failed:', error);
  }

  // Test 2: Try to get agent information
  try {
    console.log('Test 2: Testing agent endpoint...');
    const agentResponse = await fetch(`/api/v1/orchestrate/${AGENT_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Accept': 'application/json',
      },
    });
    
    console.log('Agent API response status:', agentResponse.status);
    const agentText = await agentResponse.text();
    console.log('Agent API response:', agentText);
  } catch (error) {
    console.error('Agent API test failed:', error);
  }

  // Test 3: Try alternative chat endpoint
  try {
    console.log('Test 3: Testing alternative chat endpoint...');
    const altResponse = await fetch(`/api/v1/orchestrate/${AGENT_ID}/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello',
      }),
    });
    
    console.log('Alternative chat API response status:', altResponse.status);
    const altText = await altResponse.text();
    console.log('Alternative chat API response:', altText);
  } catch (error) {
    console.error('Alternative chat API test failed:', error);
  }
}