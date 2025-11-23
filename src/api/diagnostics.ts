// Comprehensive API diagnostic tool
export async function diagnoseAPIIssues(): Promise<void> {
  const AGENT_ID = import.meta.env.VITE_WXO_AGENT_ID as string;
  const BEARER_TOKEN = import.meta.env.VITE_WXO_BEARER_TOKEN as string;
  const IBM_API_KEY = import.meta.env.VITE_IBM_API_KEY as string;

  console.log('=== API DIAGNOSTIC REPORT ===');
  console.log('Agent ID:', AGENT_ID);
  console.log('Bearer Token length:', BEARER_TOKEN?.length);
  console.log('IBM API Key length:', IBM_API_KEY?.length);

  // Test 1: Check if the base domain is accessible
  console.log('\n--- Test 1: Base Domain Accessibility ---');
  try {
    const response = await fetch('/api/', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    console.log('Base domain response:', response.status, response.statusText);
    const text = await response.text();
    console.log('Base domain content:', text.substring(0, 500));
  } catch (error) {
    console.error('Base domain test failed:', error);
  }

  // Test 2: Try to get API documentation or health check
  console.log('\n--- Test 2: API Health/Documentation ---');
  const healthEndpoints = [
    '/api/health',
    '/api/v1',
    '/api/version',
    '/api/status',
    '/api/docs',
    '/api/swagger',
    '/api/'
  ];

  for (const endpoint of healthEndpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      console.log(`${endpoint}: ${response.status} ${response.statusText}`);
      if (response.status < 500) {
        const text = await response.text();
        console.log(`Content: ${text.substring(0, 200)}`);
      }
    } catch (error) {
      console.log(`${endpoint}: Failed - ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Test 3: Test authentication with different headers
  console.log('\n--- Test 3: Authentication Methods ---');
  const authTests: Array<{ name: string; headers: Record<string, string> }> = [
    { name: 'Bearer Token', headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` } },
    { name: 'API Key Header', headers: { 'X-API-Key': IBM_API_KEY } },
    { name: 'IBM API Key', headers: { 'apikey': IBM_API_KEY } },
    { name: 'Basic Auth', headers: { 'Authorization': `Basic ${btoa(`apikey:${IBM_API_KEY}`)}` } }
  ];

  for (const test of authTests) {
    try {
      const response = await fetch('/api/v1/orchestrate', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          ...test.headers
        }
      });
      console.log(`${test.name}: ${response.status} ${response.statusText}`);
      if (response.status !== 404) {
        const text = await response.text();
        console.log(`Response: ${text.substring(0, 200)}`);
      }
    } catch (error) {
      console.log(`${test.name}: Failed - ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Test 4: Check if the agent ID endpoint exists
  console.log('\n--- Test 4: Agent-Specific Endpoints ---');
  const agentEndpoints = [
    `/api/v1/orchestrate/${AGENT_ID}`,
    `/api/v1/agents/${AGENT_ID}`,
    `/api/v1/bots/${AGENT_ID}`,
    `/api/v1/assistants/${AGENT_ID}`,
    `/api/orchestrate/agents/${AGENT_ID}`,
    `/api/agents/${AGENT_ID}`
  ];

  for (const endpoint of agentEndpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${BEARER_TOKEN}`,
          'Accept': 'application/json'
        }
      });
      console.log(`${endpoint}: ${response.status} ${response.statusText}`);
      if (response.status < 500 && response.status !== 404) {
        const text = await response.text();
        console.log(`Response: ${text.substring(0, 200)}`);
      }
    } catch (error) {
      console.log(`${endpoint}: Failed - ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Test 5: Try different HTTP methods
  console.log('\n--- Test 5: HTTP Methods ---');
  const methods = ['GET', 'POST', 'PUT', 'OPTIONS'];
  const testEndpoint = `/api/v1/orchestrate/${AGENT_ID}`;

  for (const method of methods) {
    try {
      const response = await fetch(testEndpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${BEARER_TOKEN}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        ...(method === 'POST' || method === 'PUT' ? { body: JSON.stringify({ test: true }) } : {})
      });
      console.log(`${method} ${testEndpoint}: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.log(`${method} ${testEndpoint}: Failed - ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  console.log('\n=== END DIAGNOSTIC REPORT ===');
}