import React, { useState, useEffect } from 'react';
import { Search, Plus, Archive, Trash2, Star, Reply, Forward, MoreHorizontal, Paperclip, Send } from 'lucide-react';
import OpenAI from 'openai';

const GmailWindow = ({ onClose, onMinimize, onMaximize, isMaximized, initialCompose }) => {
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isComposing, setIsComposing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // Compose state
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  // AI drafting state
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  // OpenRouter client (DeepSeek)
  const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
    dangerouslyAllowBrowser: true,
    defaultHeaders: {
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Freshboard Desktop Gmail',
    },
  });

  // Prefill compose if initialCompose provided
  useEffect(() => {
    if (initialCompose && (initialCompose.to || initialCompose.subject || initialCompose.body)) {
      setComposeTo(initialCompose.to || '');
      setComposeSubject(initialCompose.subject || '');
      setComposeBody(initialCompose.body || '');
      setIsComposing(true);
    }
  }, [initialCompose]);

  // Mock email data
  const [emails] = useState([
    {
      id: 1,
      from: 'Apple',
      fromEmail: 'no-reply@apple.com',
      subject: 'Your Apple ID security update',
      preview: 'We wanted to let you know that your Apple ID was recently used to sign in to iCloud on a new device.',
      time: '10:30 AM',
      isRead: false,
      isStarred: true,
      folder: 'inbox',
      body: 'Dear Customer,\n\nWe wanted to let you know that your Apple ID was recently used to sign in to iCloud on a new device.\n\nIf this was you, you can safely ignore this email.\n\nBest regards,\nApple Security Team'
    },
    {
      id: 2,
      from: 'GitHub',
      fromEmail: 'notifications@github.com',
      subject: '[GitHub] New pull request in your repository',
      preview: 'A new pull request has been opened in your repository freshonboard by contributor.',
      time: '9:15 AM',
      isRead: true,
      isStarred: false,
      folder: 'inbox',
      body: 'Hello,\n\nA new pull request has been opened in your repository freshonboard.\n\nPull Request: Add new desktop tools\nAuthor: contributor\n\nPlease review when you have a chance.\n\nBest,\nGitHub Team'
    },
    {
      id: 3,
      from: 'OpenRouter',
      fromEmail: 'team@openrouter.ai',
      subject: 'Welcome to OpenRouter API',
      preview: 'Thank you for signing up! Here\'s everything you need to get started with our API.',
      time: 'Yesterday',
      isRead: true,
      isStarred: false,
      folder: 'inbox',
      body: 'Welcome to OpenRouter!\n\nThank you for signing up for our API service. You now have access to multiple AI models through a single interface.\n\nGetting Started:\n1. Check out our documentation\n2. Try our tool calling features\n3. Explore prompt caching\n\nHappy coding!\nThe OpenRouter Team'
    },
    {
      id: 4,
      from: 'Me',
      fromEmail: 'user@example.com',
      subject: 'Project update draft',
      preview: 'Draft email about the latest project developments...',
      time: '2 days ago',
      isRead: true,
      isStarred: false,
      folder: 'drafts',
      body: 'Hi team,\n\nI wanted to update everyone on our progress...\n\n[This is a draft email]'
    }
  ]);

  const folders = [
    { id: 'inbox', name: 'Inbox', count: emails.filter(e => e.folder === 'inbox' && !e.isRead).length },
    { id: 'starred', name: 'Starred', count: emails.filter(e => e.isStarred).length },
    { id: 'sent', name: 'Sent', count: 0 },
    { id: 'drafts', name: 'Drafts', count: emails.filter(e => e.folder === 'drafts').length },
    { id: 'trash', name: 'Trash', count: 0 }
  ];

  const filteredEmails = emails.filter(email => {
    const matchesFolder = selectedFolder === 'starred' ? email.isStarred : email.folder === selectedFolder;
    const matchesSearch = searchQuery === '' || 
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const handleGenerateEmail = async () => {
    setAiError('');
    if (!aiPrompt && !composeSubject) {
      setAiError('Enter a prompt or subject to generate an email.');
      return;
    }
    try {
      setAiLoading(true);
      const sys = `You are an assistant that drafts high quality, concise, well-formatted emails. Use short paragraphs and a friendly, professional tone. Output plain text suitable for an email body. Do not include signatures unless requested.`;
      const userMsg = `Draft an email${composeSubject ? ` with subject: "${composeSubject}"` : ''}.
Context/prompt: ${aiPrompt || '(no extra context)'}
Audience: ${composeTo || 'general'}
`;
      const completion = await openai.chat.completions.create({
        model: 'deepseek/deepseek-chat-v3.1:free',
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: userMsg },
        ],
        temperature: 0.7,
      });
      const content = completion.choices?.[0]?.message?.content || '';
      if (content) {
        // Replace body with generated content (append if body already has text)
        setComposeBody(prev => (prev && prev.trim().length > 0) ? `${prev}\n\n${content}` : content);
      }
      setShowAIGenerator(false);
    } catch (err) {
      console.error('AI generation failed:', err);
      setAiError('Failed to generate email. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const ComposeWindow = () => (
    <div
      className="absolute inset-0 bg-white z-50 flex flex-col"
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onKeyDownCapture={(e) => e.stopPropagation()}
      onWheel={(e) => { e.stopPropagation(); }}
      onTouchStart={(e) => { e.stopPropagation(); }}
      onTouchMove={(e) => { e.preventDefault(); e.stopPropagation(); }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">New Message</h3>
        <button
          onClick={() => setIsComposing(false)}
          className="text-gray-500 hover:text-gray-700 text-xl font-light"
        >
          ×
        </button>
      </div>
      <div className="flex-1 flex flex-col p-4 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700 w-12">To:</label>
            <input
              type="email"
              value={composeTo}
              onChange={(e) => setComposeTo(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="recipient@example.com"
            />
          </div>
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700 w-12">Subject:</label>
            <input
              type="text"
              value={composeSubject}
              onChange={(e) => setComposeSubject(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Subject"
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAIGenerator(v => !v)}
                className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Generate with AI
              </button>
              {aiLoading && (
                <span className="text-xs text-gray-500">Generating…</span>
              )}
            </div>
            {aiError && <span className="text-xs text-red-600">{aiError}</span>}
          </div>
          {showAIGenerator && (
            <div className="mb-2 p-3 border border-purple-200 rounded-md bg-purple-50">
              <label className="block text-xs font-medium text-purple-900 mb-1">Describe the email you want to write</label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                rows={3}
                className="w-full p-2 text-sm border border-purple-200 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Follow up with a friendly tone about our meeting yesterday and next steps"
              />
              <div className="flex items-center justify-end mt-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShowAIGenerator(false)}
                  className="px-3 py-1.5 text-sm text-purple-700 hover:bg-purple-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGenerateEmail}
                  disabled={aiLoading}
                  className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-60"
                >
                  {aiLoading ? 'Generating…' : 'Generate'}
                </button>
              </div>
            </div>
          )}
          <textarea
            value={composeBody}
            onChange={(e) => setComposeBody(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Compose your message..."
          />
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <Paperclip size={18} />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              Save Draft
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Send size={16} />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const EmailDetail = ({ email }) => (
    <div className="flex-1 flex flex-col bg-white">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{email.subject}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="font-medium">{email.from}</span>
              <span>&lt;{email.fromEmail}&gt;</span>
              <span>{email.time}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <Archive size={18} />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <Trash2 size={18} />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 p-6">
        <div className="prose max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-gray-900 leading-relaxed">
            {email.body}
          </pre>
        </div>
      </div>
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Reply size={16} />
            <span>Reply</span>
          </button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center space-x-2">
            <Forward size={16} />
            <span>Forward</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {isComposing && <ComposeWindow />}
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-900">Mail</h1>
          </div>
          <button
            onClick={() => setIsComposing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Compose</span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search mail"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-40 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-40 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4">
            <nav className="space-y-1">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => {
                    setSelectedFolder(folder.id);
                    setSelectedEmail(null);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedFolder === folder.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="font-medium">{folder.name}</span>
                  {folder.count > 0 && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedFolder === folder.id
                        ? 'bg-blue-200 text-blue-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {folder.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Email List */}
        <div className="w-48 bg-white border-r border-gray-200 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {filteredEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedEmail?.id === email.id ? 'bg-blue-50 border-blue-200' : ''
                } ${!email.isRead ? 'bg-blue-25' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <button className={`p-1 rounded ${email.isStarred ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'}`}>
                      <Star size={16} fill={email.isStarred ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-xs truncate ${!email.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {email.from}
                      </p>
                      <p className="text-xs text-gray-500 flex-shrink-0">{email.time}</p>
                    </div>
                    <p className={`text-xs mb-1 truncate ${!email.isRead ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                      {email.subject}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-1 truncate">{email.preview}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Detail */}
        {selectedEmail ? (
          <EmailDetail email={selectedEmail} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No email selected</h3>
              <p className="text-gray-500">Choose an email from the list to view its contents</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GmailWindow;
