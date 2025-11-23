// OpenRouter API integration for alternative agent functionality
export async function callOpenRouterAgent(message: string): Promise<string> {
  const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY as string;
  const OPENROUTER_MODEL = import.meta.env.VITE_OPENROUTER_MODEL as string || 'x-ai/grok-4.1-fast';

  if (!OPENROUTER_API_KEY) {
    throw new Error('Missing OpenRouter API Key. Please add VITE_OPENROUTER_API_KEY to your .env file');
  }

  // System prompt optimized for fast, structured responses
  const systemPrompt = `You are SWASTIK, a fast customer service orchestration agent. Analyze customer issues and respond in this EXACT format:

Issue summary: [brief summary]
Category: [billing/technical/account/product/other]  
Priority: [low/medium/high/critical]
Urgent: [Yes/No]
Sentiment: [positive/neutral/frustrated/angry]

Ticket

ID: N/A
Status: N/A  
Action taken: N/A

Suggested reply to customer

Dear valued customer,

[Write a professional, empathetic response that directly addresses their concern. Keep it concise and helpful.]

Thank you for your patience and understanding.

Sincerely,
SWASTIK Support Team

Keep responses professional, empathetic, and actionable. Always acknowledge the customer's concern and provide clear next steps.`;

  try {
    console.log('🤖 Calling OpenRouter Agent...');
    console.log('Model:', OPENROUTER_MODEL);
    
    // Create timeout promise (4 seconds)
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout after 4 seconds')), 4000);
    });
    
    // Race between API call and timeout
    const apiPromise = fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'SWASTIK Orchestration Agent'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.3,
        max_tokens: 800,
        stream: false
      })
    });
    
    const response = await Promise.race([apiPromise, timeoutPromise]);

    console.log('📡 OpenRouter Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API Error:', errorText);
      throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ OpenRouter Response:', data);

    const agentResponse = data.choices?.[0]?.message?.content;
    
    if (!agentResponse) {
      throw new Error('No response content received from OpenRouter API');
    }

    return agentResponse;
    
  } catch (error) {
    console.error('❌ OpenRouter Agent Error:', error);
    throw error;
  }
}

// Alternative models available through OpenRouter
export const AVAILABLE_MODELS = {
  'x-ai/grok-4.1-fast': 'Grok 4.1 Fast (Current)',
  'anthropic/claude-3.5-sonnet': 'Claude 3.5 Sonnet',
  'anthropic/claude-3-haiku': 'Claude 3 Haiku (Fast)',
  'openai/gpt-4o': 'GPT-4o',
  'openai/gpt-4o-mini': 'GPT-4o Mini',
  'google/gemini-pro-1.5': 'Gemini Pro 1.5',
  'meta-llama/llama-3.1-70b-instruct': 'Llama 3.1 70B',
  'microsoft/wizardlm-2-8x22b': 'WizardLM 2 8x22B',
  'qwen/qwen-2.5-72b-instruct': 'Qwen 2.5 72B'
};

// Test OpenRouter connectivity
export async function testOpenRouterConnection(): Promise<void> {
  const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY as string;
  
  console.log('🔍 Testing OpenRouter Connection...');
  
  if (!OPENROUTER_API_KEY) {
    console.error('❌ No OpenRouter API key found');
    return;
  }

  try {
    // Test the models endpoint
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      }
    });

    console.log('📊 Models endpoint status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ OpenRouter connection successful');
      console.log(`📋 Available models: ${data.data?.length || 0}`);
      
      // Show some popular models
      interface ModelInfo { id: string; name?: string; }
      const popularModels = data.data?.filter((model: ModelInfo) => 
        model.id.includes('claude') || 
        model.id.includes('gpt-4') || 
        model.id.includes('gemini')
      ).slice(0, 5);
      
      console.log('🎯 Popular models available:', popularModels?.map((m: ModelInfo) => m.id));
    } else {
      const errorText = await response.text();
      console.error('❌ OpenRouter connection failed:', errorText);
    }
  } catch (error) {
    console.error('❌ OpenRouter test error:', error);
  }
}