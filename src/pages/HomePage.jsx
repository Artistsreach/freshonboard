import React from 'react';
import Desktop from './MacOS/Desktop';
import { ThemeProvider } from '../contexts/ThemeContext';
import FloatingSwitch from '../components/FloatingSwitch';
import DesktopTextChatbot from './MacOS/DesktopTextChatbot';
import WorkspaceOnboardingForm from '../components/WorkspaceOnboardingForm';

export default function MacOSPage() {
  return (
    <ThemeProvider>
      <div className="w-full max-w-6xl mx-auto p-3 sm:p-4">
        <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
          <div className="relative h-[420px] sm:h-[520px] md:h-[620px] overflow-hidden">
            <Desktop />
            <DesktopTextChatbot embedded />
          </div>
          <div className="border-t border-black/10 dark:border-white/10">
            <WorkspaceOnboardingForm embedded onSubmit={(data) => {
              try { console.log('Onboarding saved', data); } catch (_) {}
            }} />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
