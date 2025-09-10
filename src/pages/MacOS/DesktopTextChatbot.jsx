import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { OpenAI } from 'openai';
import { MessageCircle, X } from 'lucide-react';

// Normalize/extract function calls from various chunk shapes
function extractFunctionCalls(chunk) {
  const out = [];
  if (!chunk) return out;
  // Preferred: chunk.toolCall.functionCalls (Live-like)
  if (chunk.toolCall && Array.isArray(chunk.toolCall.functionCalls)) {
    for (const fc of chunk.toolCall.functionCalls) out.push(fc);
  }
  // Some SDKs: chunk.functionCalls (array)
  if (Array.isArray(chunk.functionCalls)) {
    for (const fc of chunk.functionCalls) out.push(fc);
  }
  // Parts-based: candidates[0].content.parts with part.functionCall
  const parts = chunk?.candidates?.[0]?.content?.parts;
  if (Array.isArray(parts)) {
    for (const p of parts) {
      if (p?.functionCall) out.push(p.functionCall);
    }
  }
  return out;
}

// Simple, text-only chatbot for the MacOS Desktop page
// Anchored bottom-right, toggled by a floating button.
// Uses the same Gemini setup (API key, SDK) as geminiDesktopLive.js, but text-only.

const bubbleBase =
  'flex items-center justify-center rounded-full shadow-lg';

export default function DesktopTextChatbot({ embedded = false }) {
  const [open, setOpen] = useState(false);
  const [liveEnabled, setLiveEnabled] = useState(!!window.__geminiLive);
  const [messages, setMessages] = useState([
    { role: 'model', text: "Hi! I'm your desktop assistant. How can I help?" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);
  const modelFinalizeTimer = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const modelBufferRef = useRef('');

  const openai = useMemo(() => new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
    dangerouslyAllowBrowser: true,
    defaultHeaders: {
      'HTTP-Referer': window.location.origin,
      'X-Title': 'FreshOnboard Desktop',
    },
  }), []);

  // Define tools for opening shortcut windows
  const shortcutTools = useMemo(() => [
    {
      type: 'function',
      function: {
        name: 'open_shortcut',
        description: 'Open a desktop shortcut or application window by name',
        parameters: {
          type: 'object',
          properties: {
            shortcut_name: {
              type: 'string',
              description: 'The name of the shortcut or application to open',
              enum: [
                // Google Workspace Apps
                'Drive', 'Calendar', 'Sheets', 'Docs', 'Slides', 'Meet', 'Forms', 
                'My Business', 'Google Ads', 'Analytics', 'Gmail', 'Maps',
                // Social Media Apps
                'Instagram', 'TikTok', 'YouTube', 'Facebook', 'X', 'LinkedIn', 
                'Pinterest', 'Reddit',
                // Feature-based shortcuts
                'Bank', 'Store', 'Video', 'NFT', 'Podcast', 'Stripe', 'Tasks',
                'Firebase', 'App', 'Tools', 'Create', 'Build', 'Explore', 'Automate',
                'Learn', 'Context', 'Profile', 'Finder', 'Notepad', 'Calculator',
                'Contract Creator', 'Chart', 'Table', 'Explorer', 'Image Viewer'
              ]
            }
          },
          required: ['shortcut_name']
        }
      }
    }
  ], []);

  // Heuristic to detect when the user is referring to what's on their screen
  const refersToOnScreen = useCallback((text) => {
    if (!text) return false;
    const patterns = [
      /on (my|the) screen/i,
      /this screen/i,
      /as (shown|seen)/i,
      /what you see/i,
      /what (you|u) (can )?see/i,
      /here on (my|the) screen/i,
      /this tab/i,
      /current (page|view|screen)/i,
      /look at (this|the)/i,
      /see (above|below)/i,
    ];
    return patterns.some((p) => p.test(text));
  }, []);

  useEffect(() => {
    if (!open) return;
    // Scroll to bottom when messages update
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [open, messages]);

  // Listen for audio-mode transcriptions and model text to mirror in chat
  useEffect(() => {
    const handler = (e) => {
      const { role, text, complete } = e.detail || {};
      if (!text) return;
      // Avoid duplicating user messages (we already add them on send)
      if (role === 'user') return;
      // Debug log of last received payload
      try {
        // eslint-disable-next-line no-console
        console.debug('[DesktopTextChatbot] gemini-live-text', { length: text.length, complete: !!complete });
      } catch {}
      // Update streaming indicator
      setStreaming(!complete);
      // Buffer the growing assistant text for this turn
      const buffered = modelBufferRef.current || '';
      let next = buffered;
      if (!buffered) {
        next = text;
      } else if (text && text.startsWith(buffered)) {
        // Progressive cumulative transcript
        next = text;
      } else if (buffered && buffered.startsWith(text) && buffered.length > text.length) {
        // Sometimes a shorter partial arrives; keep the longer buffer
        next = buffered;
      } else if (!buffered.endsWith(text)) {
        // Heuristic glue for incremental tokens
        const first = text?.[0] || '';
        const last = buffered?.slice(-1) || '';
        const startsWithPunct = /^[,.;:!?)}\]\-]/.test(text);
        const startsWithSpace = first === ' ' || first === '\n' || first === '\t';
        const bufferedEndsSpace = buffered.endsWith(' ') || buffered.endsWith('\n') || buffered.endsWith('\t');
        const isAlphaNum = (c) => /[A-Za-z0-9]/.test(c);

        // Trim stray space before punctuation
        let base = buffered;
        if (startsWithPunct && base.endsWith(' ')) {
          base = base.replace(/\s+$/, '');
        }

        // Decide glue: no space between alphanum sequences (word continuation)
        let glue = ' ';
        if (startsWithSpace || bufferedEndsSpace) {
          glue = '';
        } else if ((isAlphaNum(last) && isAlphaNum(first)) || startsWithPunct) {
          glue = '';
        }

        next = base + glue + text;
      }
      modelBufferRef.current = next;

      if (!complete) {
        // Show a single temp message with the buffered text
        setMessages((prev) => {
          if (prev.length && prev[prev.length - 1].role === 'model-temp') {
            const copy = prev.slice(0, -1);
            return [...copy, { role: 'model-temp', text: next }];
          }
          return [...prev, { role: 'model-temp', text: next }];
        });
      } else {
        // Finalize the turn into a permanent model message
        setMessages((prev) => {
          if (prev.length && prev[prev.length - 1].role === 'model-temp') {
            const copy = prev.slice(0, -1);
            return [...copy, { role: 'model', text: modelBufferRef.current || next }];
          }
          return [...prev, { role: 'model', text: modelBufferRef.current || next }];
        });
        modelBufferRef.current = '';
        setStreaming(false);
      }
    };
    window.addEventListener('gemini-live-text', handler);
    return () => {
      window.removeEventListener('gemini-live-text', handler);
      setStreaming(false);
      if (modelFinalizeTimer.current) clearTimeout(modelFinalizeTimer.current);
      modelBufferRef.current = '';
    };
  }, []);

  // Listen for live enable/disable toggle
  useEffect(() => {
    const statusHandler = (e) => {
      const enabled = !!(e?.detail?.enabled);
      setLiveEnabled(enabled);
      if (!enabled) setOpen(false);
    };
    window.addEventListener('gemini-live-status', statusHandler);
    // initialize from current handle if present
    setLiveEnabled(!!window.__geminiLive);
    return () => window.removeEventListener('gemini-live-status', statusHandler);
  }, []);

  // Function to execute tool calls and open shortcut windows
  const executeToolCall = useCallback(async (toolCall) => {
    const { name, arguments: args } = toolCall.function;
    
    if (name === 'open_shortcut') {
      const { shortcut_name } = JSON.parse(args);
      // Dispatch event to open the shortcut window
      window.dispatchEvent(new CustomEvent('gemini-tool-call', {
        detail: {
          name: 'openAppWithAutomation',
          args: {
            fileId: `${shortcut_name.toLowerCase()}-shortcut`,
            automation: { type: 'openShortcut', name: shortcut_name }
          }
        }
      }));
      return `Opened ${shortcut_name} window`;
    }
    
    return `Tool ${name} executed successfully`;
  }, []);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    
    // Finalize any pending model-temp before adding a new user message
    if (modelFinalizeTimer.current) clearTimeout(modelFinalizeTimer.current);
    setMessages(prev => {
      if (!prev.length) return prev;
      const last = prev[prev.length - 1];
      if (last.role === 'model-temp') {
        const copy = prev.slice(0, -1);
        return [...copy, { role: 'model', text: last.text }];
      }
      return prev;
    });
    setMessages(prev => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setLoading(true);
    setStreaming(true);

    try {
      // If the user references on-screen content, trigger a screenshot capture+analysis to gather context
      if (refersToOnScreen(trimmed)) {
        try {
          window.dispatchEvent(new CustomEvent('gemini-tool-call', {
            detail: {
              name: 'analyzeImage',
              args: {
                selector: '#root',
                prompt: `Analyze the current app view to provide context for the user's request: "${trimmed}". Summarize key UI elements and any relevant state.`,
              },
            },
          }));
        } catch (_) {
          // Non-fatal: continue sending the message regardless
        }
      }

      // Convert messages to OpenAI format
      const openaiMessages = messages.map(msg => ({
        role: msg.role === 'model' ? 'assistant' : msg.role,
        content: msg.text
      })).concat([{ role: 'user', content: trimmed }]);

      // Call OpenRouter API with streaming and tool calling
      const stream = await openai.chat.completions.create({
        model: 'deepseek/deepseek-chat-v3.1:free',
        messages: openaiMessages,
        tools: shortcutTools,
        stream: true,
      });

      let assistantMessage = '';
      let toolCalls = [];

      for await (const chunk of stream) {
        const choice = chunk.choices[0];
        if (choice?.delta?.content) {
          assistantMessage += choice.delta.content;
          // Update streaming message
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.role === 'model-temp') {
              return [...prev.slice(0, -1), { role: 'model-temp', text: assistantMessage }];
            }
            return [...prev, { role: 'model-temp', text: assistantMessage }];
          });
        }

        if (choice?.delta?.tool_calls) {
          toolCalls.push(...choice.delta.tool_calls);
        }

        if (choice?.finish_reason === 'tool_calls') {
          // Execute tool calls
          for (const toolCall of toolCalls) {
            const result = await executeToolCall(toolCall);
            // Add tool result to messages
            setMessages(prev => [
              ...prev,
              { role: 'tool', text: `Executed tool: ${result}` }
            ]);
          }
        }
      }

      // Finalize the message
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === 'model-temp') {
          return [...prev.slice(0, -1), { role: 'model', text: assistantMessage }];
        }
        return [...prev, { role: 'model', text: assistantMessage }];
      });

    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'model', text: `Sorry, I ran into an error: ${err?.message || err}` },
      ]);
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  };

  const buttonPosition = embedded
    ? 'absolute bottom-4 right-4 z-[45]'
    : 'fixed bottom-6 right-6 z-[1000]';

  const panelPosition = embedded
    ? 'absolute bottom-20 right-4 z-[46]'
    : 'fixed bottom-24 right-6 z-[1001]';

  return (
    <>
      {/* Floating Button - always visible */}
      <button
        aria-label="Open Desktop Chatbot"
        className={`${buttonPosition} ${bubbleBase} h-14 w-14 bg-blue-600 text-white hover:bg-blue-700 transition`}
        onClick={() => setOpen(true)}
      >
        <MessageCircle size={22} />
      </button>

      {/* Panel */}
      {open && (
        <div className={`${panelPosition} w-[360px] max-h-[70vh] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl flex flex-col overflow-hidden`}>
          <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 dark:border-neutral-800">
            <div className="text-sm font-medium">Desktop Assistant</div>
            <button className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={() => setOpen(false)}>
              <X size={16} />
            </button>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-3 flex flex-wrap content-start gap-2">
            {messages.map((m, i) => {
              const isModel = m.role.startsWith('model');
              return (
                <div
                  key={i}
                  className={`max-w-[75%] inline-block break-words whitespace-pre-wrap leading-relaxed px-3 py-2 rounded-lg shadow-sm ${
                    isModel
                      ? 'self-start bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
                      : 'self-end ml-auto bg-blue-600 text-white'
                  }`}
                >
                  {m.text}
                </div>
              );
            })}
            {loading && <div className="text-xs text-neutral-500">Thinking…</div>}
            {streaming && <div className="text-xs text-neutral-500">Streaming…</div>}
          </div>

          <div className="p-3 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
                placeholder="Ask anything…"
                className="flex-1 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function buildContents(history, latestInput) {
  // Convert internal message format to Gemini Content[]
  // Each item is { role: 'user'|'model', parts: [{ text }] }
  const items = [];
  for (const m of history) {
    if (!m?.text) continue;
    const role = m.role === 'user' ? 'user' : 'model';
    items.push({ role, parts: [{ text: m.text }] });
  }
  if (latestInput) {
    items.push({ role: 'user', parts: [{ text: latestInput }] });
  }
  return items;
}
