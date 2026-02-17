/**
 * Assistive Technology Provider
 * React context provider for assistive technology features
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// TODO: Refactor - AssistiveTechnologyManager should be moved to ui/src/engine/ or ui/src/lib/
// For now, using a stub interface to unblock build
export interface AssistiveTechConfig {
  voiceControl?: { enabled: boolean };
  hapticFeedback?: { enabled: boolean };
  switchControl?: { enabled: boolean };
  screenReader?: { enabled: boolean };
}

export class AssistiveTechnologyManager {
  private config: AssistiveTechConfig;

  constructor(config?: AssistiveTechConfig) {
    this.config = config || {};
  }

  getConfig(): AssistiveTechConfig {
    return this.config;
  }

  updateConfig(updates: Partial<AssistiveTechConfig>): void {
    this.config = { ...this.config, ...updates };
  }
}

interface AssistiveTechContextType {
  manager: AssistiveTechnologyManager | null;
  config: AssistiveTechConfig | null;
  updateConfig: (config: Partial<AssistiveTechConfig>) => void;
  announce: (message: string, priority?: 'polite' | 'assertive' | 'off') => void;
  triggerHaptic: (pattern: 'success' | 'error' | 'warning' | 'info' | string) => void;
  startVoiceControl: () => void;
  stopVoiceControl: () => void;
  registerSwitchItems: (items: Array<{ id: string; label: string; action: () => void }>) => void;
  startSwitchControl: () => void;
  stopSwitchControl: () => void;
}

const AssistiveTechContext = createContext<AssistiveTechContextType | null>(null);

export const useAssistiveTech = () => {
  const context = useContext(AssistiveTechContext);
  if (!context) {
    throw new Error('useAssistiveTech must be used within AssistiveTechProvider');
  }
  return context;
};

interface AssistiveTechProviderProps {
  children: ReactNode;
  config?: Partial<AssistiveTechConfig>;
}

export const AssistiveTechProvider: React.FC<AssistiveTechProviderProps> = ({
  children,
  config: initialConfig,
}) => {
  const [manager, setManager] = useState<AssistiveTechnologyManager | null>(null);
  const [config, setConfig] = useState<AssistiveTechConfig | null>(null);

  useEffect(() => {
    const assistiveTech = new AssistiveTechnologyManager(initialConfig);

    assistiveTech.init().then(() => {
      setManager(assistiveTech);
      setConfig(assistiveTech.getConfig());
    });

    return () => {
      assistiveTech.dispose();
    };
  }, []);

  const updateConfig = (newConfig: Partial<AssistiveTechConfig>) => {
    if (manager) {
      manager.updateConfig(newConfig);
      setConfig(manager.getConfig());
    }
  };

  const announce = (message: string, priority: 'polite' | 'assertive' | 'off' = 'polite') => {
    manager?.announce(message, priority);
  };

  const triggerHaptic = (pattern: 'success' | 'error' | 'warning' | 'info' | string) => {
    manager?.triggerHaptic(pattern);
  };

  const startVoiceControl = () => {
    manager?.startVoiceRecognition();
  };

  const stopVoiceControl = () => {
    manager?.stopVoiceRecognition();
  };

  const registerSwitchItems = (items: Array<{ id: string; label: string; action: () => void }>) => {
    manager?.registerSwitchControlItems(items);
  };

  const startSwitchControl = () => {
    manager?.startSwitchControlScanning();
  };

  const stopSwitchControl = () => {
    manager?.stopSwitchControlScanning();
  };

  return (
    <AssistiveTechContext.Provider
      value={{
        manager,
        config,
        updateConfig,
        announce,
        triggerHaptic,
        startVoiceControl,
        stopVoiceControl,
        registerSwitchItems,
        startSwitchControl,
        stopSwitchControl,
      }}
    >
      {children}
    </AssistiveTechContext.Provider>
  );
};
