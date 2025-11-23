import { useState, useEffect, useRef } from 'react';
import { callCopilot } from './api/callCopilot';
import { callOpenRouterAgent } from './api/openRouterAgent';
import './styles.css';

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
}

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentMode, setCurrentMode] = useState<'watson' | 'openrouter' | 'mock'>('watson');
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content:
        "Hi, I'm SWASTIK – your orchestration copilot. I can coordinate multiple specialized agents to help you.",
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmedInput,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setError(null);
    setLoading(true);

    try {
      let response: string;
      let finalMode = currentMode;
      
      // Automatic fallback system: Watson -> OpenRouter -> Mock
      try {
        if (currentMode === 'watson') {
          console.log('🔄 Trying Watson Orchestrate...');
          response = await callCopilot(trimmedInput);
          console.log('✅ Watson Orchestrate successful');
        } else if (currentMode === 'openrouter') {
          console.log('🔄 Trying OpenRouter...');
          response = await callOpenRouterAgent(trimmedInput);
          console.log('✅ OpenRouter successful');
        } else {
          throw new Error('Mock mode selected');
        }
      } catch (watsonError) {
        console.log('❌ Watson failed, trying OpenRouter...', watsonError);
        try {
          if (currentMode !== 'openrouter') {
            response = await callOpenRouterAgent(trimmedInput);
            console.log('✅ OpenRouter fallback successful');
            setCurrentMode('openrouter');
            finalMode = 'openrouter';
          } else {
            throw watsonError;
          }
        } catch (openRouterError) {
          console.log('❌ OpenRouter failed, using mock mode...', openRouterError);
          
          // Generate mock response in the required format
          response = `Issue summary: System connectivity issues - customer inquiry
Category: technical
Priority: medium
Urgent: No
Sentiment: neutral

Ticket

ID: N/A
Status: N/A
Action taken: N/A

Suggested reply to customer

Dear valued customer,

Thank you for contacting us. We're currently experiencing some technical difficulties with our systems, but we've received your inquiry and are working to resolve it promptly.

We'll have a response for you shortly. If this is urgent, please don't hesitate to call our support line.

Thank you for your patience and understanding.

Sincerely,
SWASTIK Support Team

*Note: System is in mock mode - APIs currently unavailable*`;
          setCurrentMode('mock');
          finalMode = 'mock';
        }
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setError(null); // Clear any previous errors on success
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>SWASTIK Orchestration Agent</h1>
        <p>Multi-agent support copilot on IBM watsonx Orchestrate</p>
      </header>

      <div className="chat-shell">
        <div className="chat-window" ref={chatWindowRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.role}`}>
              <div className="message-bubble">{msg.content}</div>
              <div className="message-timestamp">{msg.timestamp}</div>
            </div>
          ))}
        </div>

        <div className="input-area">
          <div className="input-shell">
            {error && <div className="error-banner">{error}</div>}

            {loading && (
              <div className="loading-indicator">
                <div className="spinner"></div>
                <span>SWASTIK is thinking…</span>
              </div>
            )}

            <div className="input-row">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                disabled={loading}
                rows={1}
              />
              <button onClick={handleSend} disabled={loading || !input.trim()}>
                Send to SWASTIK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
