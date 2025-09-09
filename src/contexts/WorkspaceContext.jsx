import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkspaceContext = createContext();

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};

export const WorkspaceProvider = ({ children }) => {
  const [businessName, setBusinessName] = useState('FreshFront');
  const [workspaceData, setWorkspaceData] = useState({
    features: [],
    googleApps: [],
    socials: [],
    employees: '',
    industry: ''
  });

  // Load workspace data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ff_onboarding_v1');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.businessName && data.businessName.trim()) {
          setBusinessName(data.businessName.trim());
        }
        setWorkspaceData({
          features: data.features || [],
          googleApps: data.googleApps || [],
          socials: data.socials || [],
          employees: data.employees || '',
          industry: data.industry || ''
        });
      }
    } catch (error) {
      console.warn('Failed to load workspace data from localStorage:', error);
    }
  }, []);

  const updateBusinessName = (name) => {
    const trimmedName = name?.trim() || '';
    setBusinessName(trimmedName || 'FreshFront');
  };

  const getSelectedFeatures = () => workspaceData.features;
  const getSelectedGoogleApps = () => workspaceData.googleApps;
  const getSelectedSocials = () => workspaceData.socials;

  const updateWorkspaceData = (newData) => {
    setWorkspaceData(prev => ({ ...prev, ...newData }));
  };

  const value = {
    businessName,
    updateBusinessName,
    getSelectedFeatures,
    getSelectedGoogleApps,
    getSelectedSocials,
    updateWorkspaceData,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};
