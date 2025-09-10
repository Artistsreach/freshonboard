import React, { useMemo, useState, useEffect } from 'react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { supabase } from '../lib/supabaseClient';

// A mobile-responsive onboarding form that floats over the desktop without blocking interaction.
// The outer wrapper uses pointer-events: none to keep the desktop interactive;
// the card itself uses pointer-events: auto so the form is usable.
export default function WorkspaceOnboardingForm({ onSubmit, embedded = false }) {
  const { updateBusinessName, updateWorkspaceData } = useWorkspace();
  const [form, setForm] = useState({
    businessName: '',
    email: '',
    phone: '',
    employees: '',
    industry: '',
    socials: [],
    googleApps: [],
    features: [],
    dataSources: [],
    otherDataSource: '',
    selectedTheme: 'macOS'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const socialOptions = useMemo(() => [
    'Instagram', 'TikTok', 'YouTube', 'Facebook', 'X (Twitter)', 'LinkedIn', 'Pinterest', 'Reddit'
  ], []);

  const socialIcons = useMemo(() => ({
    'Instagram': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/2048px-Instagram_logo_2016.svg.png',
    'TikTok': 'https://cdn.pixabay.com/photo/2021/06/15/12/28/tiktok-6338432_1280.png',
    'YouTube': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/1024px-YouTube_full-color_icon_%282017%29.svg.png',
    'Facebook': 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg',
    'X (Twitter)': 'https://img.favpng.com/21/11/17/x-logo-modern-x-symbol-in-monochrome-design-0WMJWmF0_t.jpg',
    'LinkedIn': 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
    'Pinterest': 'https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png',
    'Reddit': 'https://www.iconpacks.net/icons/2/free-reddit-logo-icon-2436-thumb.png'
  }), []);

  const googleWorkspaceOptions = useMemo(() => [
    'Gmail', 'Drive', 'Docs', 'Sheets', 'Slides', 'Calendar', 'Meet', 'Forms', 'Google My Business', 'Google Ads', 'Google Analytics', 'Google Maps'
  ], []);

  const googleIcons = useMemo(() => ({
    'Gmail': 'https://static.vecteezy.com/system/resources/previews/022/484/508/non_2x/google-mail-gmail-icon-logo-symbol-free-png.png',
    'Drive': 'https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png',
    'Docs': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Google_Docs_2020_Logo.svg/250px-Google_Docs_2020_Logo.svg.png',
    'Sheets': 'https://cdn-icons-png.flaticon.com/512/5968/5968557.png',
    'Slides': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Google_Slides_logo_%282014-2020%29.svg/1489px-Google_Slides_logo_%282014-2020%29.svg.png',
    'Calendar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Calendar_icon_%282020%29.svg/2048px-Google_Calendar_icon_%282020%29.svg.png',
        'Meet': 'https://cdn.prod.website-files.com/6804774958514b6a49cf7b87/687c2721c4366c6c8996cb65_google-meet-icon-sm.png',
    'Forms': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Google_Forms_2020_Logo.svg/1489px-Google_Forms_2020_Logo.svg.png',
    'Google My Business': 'https://cdn.worldvectorlogo.com/logos/google-my-business-logo.svg',
    'Google Ads': 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Google_Ads_icon.svg',
    'Google Analytics': 'https://brandeps.com/logo-download/G/Google-Analytics-logo-01.png',
    'Google Maps': 'https://cdn-icons-png.flaticon.com/512/355/355980.png',
  }), []);

  const dataSourceOptions = useMemo(() => [
    'CRM (Salesforce, HubSpot, etc.)',
    'Email Marketing Platform (Mailchimp, Klaviyo)',
    'E-commerce Platform (Shopify, WooCommerce, BigCommerce)',
    'Social Media Analytics (Facebook, Instagram, Twitter, LinkedIn)',
    'Google Analytics (GA4, Universal Analytics)',
    'Internal Databases (SQL, NoSQL, Data Warehouse)',
    'Customer Support Software (Zendesk, Intercom, Freshdesk)',
    'Payment Processors (Stripe, PayPal, Square)',
    'Marketing Automation Tools (HubSpot, Marketo, Pardot)',
    'Spreadsheets (Excel, Google Sheets, Airtable)',
    'CDP (Customer Data Platform)',
    'ERP System (SAP, NetSuite, Oracle)',
    'Product Analytics (Mixpanel, Amplitude)',
    'Web Analytics (Adobe Analytics, Matomo)',
    'Call Tracking Software',
    'SMS/MMS Platforms',
    'Advertising Platforms (Google Ads, Facebook Ads)',
    'Marketing Attribution Tools',
    'Survey Tools (SurveyMonkey, Typeform)',
    'Webinar Platforms (Zoom, GoToWebinar)'
  ], []);

  const industryOptions = useMemo(() => [
    'E-commerce',
    'SaaS',
    'Technology',
    'Media',
    'Finance',
    'Banking',
    'Insurance',
    'Healthcare',
    'Biotech & Pharma',
    'Education',
    'Gaming',
    'Agency',
    'Marketing & Advertising',
    'Professional Services',
    'Legal',
    'Real Estate',
    'Construction',
    'Manufacturing',
    'Consumer Goods',
    'Automotive',
    'Transportation & Logistics',
    'Energy & Utilities',
    'Environmental Services',
    'Hospitality',
    'Food & Beverage',
    'Retail',
    'Beauty & Personal Care',
    'Telecommunications',
    'Agriculture',
    'Travel & Tourism',
    'Nonprofit',
    'Government & Public Sector',
    'Sports & Fitness',
    'Cybersecurity',
    'Other'
  ], []);

  const employeeOptions = useMemo(() => [
    'Solo', '2-10', '11-50', '51-200', '201-1000', '1000+'
  ], []);

  const featureOptions = useMemo(() => [
    '3D Maps',
    'AI Fraud Detection',
    'AI Image Editor',
    'AI Video Assistant',
    'App Builder',
    'Automated Report Generation',
    'Bank',
    'Calculator',
    'Charts & Graphs',
    'Chatbot Builder',
    'Collaboration',
    'Company Knowledge Base',
    'Contract Generator',
    'Customer Journey Mapping Tool',
    'Customer Persona Graphs',
    'Data Aggregation',
    'Deep Research (Firecrawl)',
    'Document Analyzer',
    'Document Generator',
    'Email Automation',
    'Explorer (Research)',
    'Firebase Management',
    'Full Database Search',
    'Generate Video',
    'Image Generator',
    'Image to Video',
    'Image Viewer',
    'Interactive HTMLs',
    'Inventory Management',
    'Invoice Generator',
    'Lead Manager',
    'Lead Scoring',
    'Music Generator',
    'NFT Creator',
    'Notepad',
    'PDF to Form',
    'Personalized Marketing Suite',
    'Podcast Generator',
    'Presentation Maker',
    'Realtime Voice Control',
    'Resume Screener',
    'Screen Recording',
    'Social Media Analytics',
    'Social Media Automation',
    'Speech to Speech',
    'Spreadsheet Analyzer',
    'Store Builder',
    'Stripe',
    'Summarize Video',
    'Supply Chain Optimization',
    'Table Editor',
    'Task Automation',
    'Text to Speech',
    'Transcription',    
    'Video',
    'Video Editor',
    'Video Player',
    'Whiteboard Tools',
    'YouTube Player'
  ], []);

  const toggleMulti = (key, value) => {
    setForm(prev => {
      const arr = prev[key] || [];
      const exists = arr.includes(value);
      const newForm = { ...prev, [key]: exists ? arr.filter(v => v !== value) : [...arr, value] };
      // Update workspace context with the new data
      updateWorkspaceData(newForm);
      return newForm;
    });
  };

  const renderGoogleAppOption = (app) => (
    <div className="flex items-center">
      <img 
        src={googleIcons[app]} 
        alt={app}
        className="w-5 h-5 mr-2 object-contain"
        style={{ 
          borderRadius: app === 'Google Analytics' ? '4px' : 'none',
          filter: form.googleApps.includes(app) ? 'brightness(0) invert(1)' : 'none'
        }}
      />
      <span>{app}</span>
    </div>
  );

  useEffect(() => {
    if (form.businessName) {
      updateBusinessName(form.businessName);
      document.title = `${form.businessName} | FreshFront`;
    } else {
      document.title = 'FreshFront';
    }
  }, [form.businessName, updateBusinessName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Save to Supabase
      const { data, error } = await supabase
        .from('onboarding_responses')
        .insert([
          { 
            business_name: form.businessName,
            email: form.email,
            phone: form.phone,
            industry: form.industry,
            social_platforms: form.socials,
            data_sources: form.dataSources,
            selected_features: form.features,
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) throw error;

      // Save to localStorage for client-side persistence
      try {
        localStorage.setItem('ff_onboarding_v1', JSON.stringify(form));
      } catch (_) {}

      // Update workspace data in context
      updateWorkspaceData({
        businessName: form.businessName,
        industry: form.industry
      });

      // Call the original onSubmit if provided
      if (onSubmit) onSubmit(form);

      // Redirect to booking link after successful save
      window.location.href = 'https://calendar.app.google/yAWSSjCtha5KoQHr6';

      return data;
    } catch (error) {
      console.error('Error saving form data:', error);
      setSubmitError(error.message || 'Failed to save form data');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const FormInner = (
    <form onSubmit={handleSubmit} className="p-4 sm:p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg sm:text-xl font-semibold">Workspace Setup</h2>
          <button
            type="button"
            className="text-xs opacity-70 hover:opacity-100 underline"
            onClick={() => {
              try { localStorage.removeItem('ff_onboarding_v1'); } catch (_) {}
              setForm({ 
                businessName: '', 
                email: '',
                phone: '',
                employees: '', 
                industry: '', 
                socials: [], 
                googleApps: [], 
                features: [],
                dataSources: [],
                otherDataSource: ''
              });
            }}
          >
            Reset
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4">
          {/* Theme Selection */}
          <div>
            <label className="block text-sm mb-2">Choose your desktop theme</label>
            <div className="-mx-1">
              <div className="flex gap-2 overflow-x-auto no-scrollbar px-1 py-1">
                {[
                  { id: 'macOS', name: 'macOS', colors: ['#f5f5f7', '#1d1d1f'], icon: '🍎' },
                  { id: 'windows11', name: 'Windows 11', colors: ['#0078d4', '#ffffff'], icon: '💻' },
                  { id: 'ubuntu', name: 'Ubuntu', colors: ['#e95420', '#2c001e'], icon: '🐧' },
                  { id: 'cyberpunk', name: 'Cyberpunk', colors: ['#ff0080', '#ffffff'], icon: '⚡' },
                  { id: 'ocean', name: 'Ocean', colors: ['#006994', '#87ceeb'], icon: '🌊' },
                  { id: 'forest', name: 'Forest', colors: ['#228b22', '#90ee90'], icon: '🌲' },
                  { id: 'sunset', name: 'Sunset', colors: ['#ff6347', '#ffd700'], icon: '🌅' }
                ].map((theme) => {
                  const active = form.selectedTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => {
                        setForm(prev => ({ ...prev, selectedTheme: theme.id }));
                        // Dispatch theme change event to Desktop
                        window.dispatchEvent(new CustomEvent('desktop-theme-change', { 
                          detail: { themeId: theme.id, theme } 
                        }));
                      }}
                      className={`shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm transition ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/70 dark:bg-black/50 border-black/10 dark:border-white/10'}`}
                      title={theme.name}
                      aria-pressed={active}
                    >
                      <span className="text-lg">{theme.icon}</span>
                      <span>{theme.name}</span>
                      <div className="flex gap-1 ml-1">
                        <div 
                          className="w-3 h-3 rounded-full border border-white/30" 
                          style={{ backgroundColor: theme.colors[0] }}
                        />
                        <div 
                          className="w-3 h-3 rounded-full border border-white/30" 
                          style={{ backgroundColor: theme.colors[1] }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Google Workspace first: horizontal scrollable emojis */}
          <div>
            <label className="block text-sm mb-2">Select your Google Workspace apps</label>
            <div className="-mx-1">
              <div className="flex gap-2 overflow-x-auto no-scrollbar px-1 py-1">
                {googleWorkspaceOptions.map((opt) => {
                  const active = form.googleApps.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleMulti('googleApps', opt)}
                      className={`shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm transition ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/70 dark:bg-black/50 border-black/10 dark:border-white/10'}`}
                      title={opt}
                      aria-pressed={active}
                    >
                      {renderGoogleAppOption(opt)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">What is your business name?</label>
            <input
              type="text"
              className="w-full rounded-md border border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/60 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Acme Co."
              value={form.businessName}
              onChange={(e) => {
                const newValue = e.target.value;
                setForm(prev => ({ ...prev, businessName: newValue }));
              }}
            />
          </div>

          {/* Contact details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Business email</label>
              <input
                type="email"
                className="w-full rounded-md border border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/60 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Phone number</label>
              <input
                type="tel"
                className="w-full rounded-md border border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/60 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(555) 123-4567"
                value={form.phone}
                onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">What is your industry?</label>
            <select
              value={form.industry}
              onChange={(e) => setForm(prev => ({ ...prev, industry: e.target.value }))}
              className="w-full p-2 border rounded bg-white dark:bg-gray-800"
            >
              <option value="">Select</option>
              {industryOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Social platforms section */}
          <div>
            <label className="block text-sm mb-2">Choose your social media platforms</label>
            <div className="-mx-1">
              <div className="flex gap-2 overflow-x-auto no-scrollbar px-1 py-1">
                {socialOptions.map((opt) => {
                  const active = form.socials.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleMulti('socials', opt)}
                      className={`shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm transition ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/70 dark:bg-black/50 border-black/10 dark:border-white/10'}`}
                      title={opt}
                      aria-pressed={active}
                    >
                      <img 
                        src={socialIcons[opt]} 
                        alt={opt}
                        className="w-5 h-5 object-contain"
                        style={{ 
                          filter: active ? 'brightness(0) invert(1)' : 'none',
                          borderRadius: opt === 'X (Twitter)' ? '18px' : 'none'
                        }}
                      />
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Data sources section */}
          <div>
            <label className="block text-sm mb-2">What are your main sources of data?</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
              {dataSourceOptions.map(source => (
                <label key={source} className="flex items-center gap-2 text-sm bg-black/5 dark:bg-white/5 rounded-md px-3 py-2">
                  <input
                    type="checkbox"
                    checked={form.dataSources?.includes(source) || false}
                    onChange={() => {
                      const currentSources = form.dataSources || [];
                      const newSources = currentSources.includes(source)
                        ? currentSources.filter(s => s !== source)
                        : [...currentSources, source];
                      setForm(prev => ({ ...prev, dataSources: newSources }));
                    }}
                  />
                  <span>{source}</span>
                </label>
              ))}
            </div>
            <div className="mt-2">
              <input
                type="text"
                value={form.otherDataSource || ''}
                onChange={(e) => setForm(prev => ({ ...prev, otherDataSource: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && form.otherDataSource) {
                    const newSource = form.otherDataSource.trim();
                    if (newSource && !dataSourceOptions.includes(newSource)) {
                      const newSources = [...(form.dataSources || []), newSource];
                      setForm(prev => ({
                        ...prev,
                        dataSources: newSources,
                        otherDataSource: ''
                      }));
                    }
                  }
                }}
                className="w-full p-2 text-sm border rounded bg-white/80 dark:bg-black/60"
                placeholder="Other (press Enter to add)"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm">Pick your features</label>
              <button 
                type="button" 
                onClick={() => {
                  setForm(prev => ({
                    ...prev,
                    features: [...new Set([...prev.features, ...featureOptions])]
                  }));
                }}
                className="text-xs text-blue-500 hover:text-blue-400"
              >
                Select All
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {featureOptions.map(opt => (
                <label key={opt} className="flex items-center gap-2 text-sm bg-black/5 dark:bg-white/5 rounded-md px-2 py-2">
                  <input
                    type="checkbox"
                    checked={form.features.includes(opt)}
                    onChange={() => toggleMulti('features', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSubmitting ? 'Saving...' : 'Save & Continue'}
            </button>
            {submitError && (
              <p className="text-sm text-red-500 text-center">
                {submitError}
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );

  if (embedded) {
    return (
      <div className="w-full">
        {FormInner}
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center p-3 sm:p-4">
      <div className="pointer-events-auto w-full max-w-lg sm:max-w-2xl bg-white/90 dark:bg-black/70 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-xl shadow-xl overflow-x-hidden overflow-y-auto max-h-[85vh]">
        {FormInner}
      </div>
    </div>
  );
}
