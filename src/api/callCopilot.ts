export async function callCopilot(message: string): Promise<string> {
  const AGENT_ID = import.meta.env.VITE_WXO_AGENT_ID as string;
  const BEARER_TOKEN = import.meta.env.VITE_WXO_BEARER_TOKEN as string;

  if (!AGENT_ID || !BEARER_TOKEN) {
    throw new Error(
      'Missing configuration: VITE_WXO_AGENT_ID or VITE_WXO_BEARER_TOKEN'
    );
  }

  // Try different endpoint patterns that IBM Watson Orchestrate might use
  const possibleEndpoints = [
    `/api/v1/orchestrate/${AGENT_ID}/chat/completions`,
    `/api/v1/agents/${AGENT_ID}/chat/completions`,
    `/api/v1/orchestrate/${AGENT_ID}/invoke`,
    `/api/v1/agents/${AGENT_ID}/invoke`,
    `/api/v1/orchestrate/${AGENT_ID}/chat`,
    `/api/v1/agents/${AGENT_ID}/chat`
  ];

  let lastError = null;
  
  for (const url of possibleEndpoints) {

    console.log(`Trying endpoint: ${url}`);
    
    try {
      // Create timeout promise (4 seconds)
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Watson API timeout after 4 seconds')), 4000);
      });
      
      // Try different payload formats
      const payloads = [
        // OpenAI-style format
        {
          stream: false,
          messages: [{ role: 'user', content: message }],
        },
        // Simple message format
        {
          message: message,
        },
        // IBM Watson style format
        {
          input: {
            text: message,
          },
        },
        // Orchestrate specific format
        {
          query: message,
        }
      ];

      for (const payload of payloads) {
        console.log(`Trying payload format:`, payload);
        
        const apiCall = fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${BEARER_TOKEN}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        
        const response = await Promise.race([apiCall, timeoutPromise]);

        console.log(`Response status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Success! Response data:', data);
          
          // Try to extract response from different possible structures
          return data.choices?.[0]?.message?.content ?? 
                 data.choices?.[0]?.content ?? 
                 data.output?.text ?? 
                 data.response ?? 
                 data.result ?? 
                 JSON.stringify(data);
        } else {
          const errorText = await response.text();
          console.warn(`Payload failed (${response.status}):`, errorText);
        }
      }
      
    } catch (error) {
      console.warn(`Endpoint ${url} failed:`, error);
      lastError = error;
    }
  }
  
  // If all attempts failed
  throw new Error(`All API endpoints failed. Last error: ${lastError?.message || 'Unknown error'}`);
}
