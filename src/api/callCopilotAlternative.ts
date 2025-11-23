// Alternative IBM Watson API approaches
export async function callCopilotAlternative(message: string): Promise<string> {
  const AGENT_ID = import.meta.env.VITE_WXO_AGENT_ID as string;
  const BEARER_TOKEN = import.meta.env.VITE_WXO_BEARER_TOKEN as string;
  const IBM_API_KEY = import.meta.env.VITE_IBM_API_KEY as string;

  if (!AGENT_ID || (!BEARER_TOKEN && !IBM_API_KEY)) {
    throw new Error('Missing required configuration');
  }

  // Try different IBM Watson API patterns
  const apiAttempts = [
    {
      name: 'watsonx.ai Chat Completions',
      url: `/api/v1/chat/completions`,
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: {
        model: AGENT_ID,
        messages: [{ role: 'user', content: message }],
        max_tokens: 1000
      }
    },
    {
      name: 'Watson Assistant v2',
      url: `/api/v2/assistants/${AGENT_ID}/sessions/temp/message`,
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: {
        input: {
          message_type: 'text',
          text: message
        }
      }
    },
    {
      name: 'watsonx Orchestrate Invoke',
      url: `/api/v1/orchestrate/invoke`,
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Agent-ID': AGENT_ID
      },
      body: {
        input: message,
        parameters: {}
      }
    },
    {
      name: 'Watson Discovery Query',
      url: `/api/v1/environments/default/collections/default/query`,
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: {
        natural_language_query: message,
        count: 1
      }
    },
    {
      name: 'IBM Cloud Functions',
      url: `/api/v1/web/orchestrate/chat`,
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: {
        agent_id: AGENT_ID,
        message: message
      }
    }
  ];

  for (const attempt of apiAttempts) {
    console.log(`\n🔄 Trying: ${attempt.name}`);
    console.log(`URL: ${attempt.url}`);
    console.log(`Body:`, attempt.body);

    try {
      const response = await fetch(attempt.url, {
        method: 'POST',
        headers: attempt.headers,
        body: JSON.stringify(attempt.body)
      });

      console.log(`📊 Response: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Success with ${attempt.name}:`, data);
        
        // Extract response based on different API patterns
        const extractedResponse = 
          data.choices?.[0]?.message?.content ||
          data.choices?.[0]?.content ||
          data.output?.generic?.[0]?.text ||
          data.output?.text ||
          data.result?.output?.text ||
          data.response ||
          data.answer ||
          data.text ||
          JSON.stringify(data);

        if (extractedResponse && extractedResponse !== '{}') {
          return extractedResponse;
        }
      } else {
        const errorText = await response.text();
        console.log(`❌ ${attempt.name} failed: ${errorText}`);
      }
    } catch (error) {
      console.log(`🚫 ${attempt.name} error:`, error);
    }
  }

  // If all attempts failed, try with API Key authentication
  if (IBM_API_KEY) {
    console.log('\n🔑 Trying with API Key authentication...');
    
    try {
      // Get fresh IAM token
      const iamResponse = await fetch('/iam/identity/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: new URLSearchParams({
          'grant_type': 'urn:ibm:params:oauth:grant-type:apikey',
          'apikey': IBM_API_KEY
        })
      });

      if (iamResponse.ok) {
        const iamData = await iamResponse.json();
        const freshToken = iamData.access_token;
        
        console.log('🎫 Got fresh IAM token, retrying with watsonx.ai...');
        
        const response = await fetch('/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${freshToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            model: AGENT_ID,
            messages: [{ role: 'user', content: message }],
            max_tokens: 1000
          })
        });

        if (response.ok) {
          const data = await response.json();
          return data.choices?.[0]?.message?.content || data.choices?.[0]?.content || JSON.stringify(data);
        }
      }
    } catch (error) {
      console.log('IAM token attempt failed:', error);
    }
  }

  throw new Error('All API attempts failed. The service might be using a different endpoint structure or authentication method.');
}