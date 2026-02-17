/**
 * Tools for Life Provider
 * React context provider for Tools for Life features
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  ToolsForLifeManager,
  ToolConfig,
} from '../../../SUPER-CENTAUR/src/engine/tools/ToolsForLifeManager';

interface ToolsForLifeContextType {
  manager: ToolsForLifeManager | null;
  config: ToolConfig | null;
  updateConfig: (config: Partial<ToolConfig>) => void;
  executeTool: (id: string) => Promise<void>;
  getMakerTools: () => any[];
  getLifeTools: () => any[];
  getChangeTools: () => any[];
  getToolStats: () => any;
  searchTools: (query: string) => any[];
}

const ToolsForLifeContext = createContext<ToolsForLifeContextType | null>(null);

export const useToolsForLife = () => {
  const context = useContext(ToolsForLifeContext);
  if (!context) {
    throw new Error('useToolsForLife must be used within ToolsForLifeProvider');
  }
  return context;
};

interface ToolsForLifeProviderProps {
  children: ReactNode;
  config?: Partial<ToolConfig>;
}

export const ToolsForLifeProvider: React.FC<ToolsForLifeProviderProps> = ({
  children,
  config: initialConfig,
}) => {
  const [manager, setManager] = useState<ToolsForLifeManager | null>(null);
  const [config, setConfig] = useState<ToolConfig | null>(null);

  useEffect(() => {
    const toolsManager = new ToolsForLifeManager(initialConfig);

    toolsManager.init().then(() => {
      setManager(toolsManager);
      setConfig(toolsManager.getConfig());
    });

    return () => {
      toolsManager.dispose();
    };
  }, []);

  const updateConfig = (newConfig: Partial<ToolConfig>) => {
    if (manager) {
      manager.updateConfig(newConfig);
      setConfig(manager.getConfig());
    }
  };

  const executeTool = async (id: string) => {
    if (manager) {
      await manager.executeTool(id);
    }
  };

  const getMakerTools = () => {
    return manager?.getMakerTools() || [];
  };

  const getLifeTools = () => {
    return manager?.getLifeTools() || [];
  };

  const getChangeTools = () => {
    return manager?.getChangeTools() || [];
  };

  const getToolStats = () => {
    return (
      manager?.getToolStats() || {
        totalUsage: 0,
        makerUsage: 0,
        lifeUsage: 0,
        changeUsage: 0,
        mostUsed: [],
      }
    );
  };

  const searchTools = (query: string) => {
    return manager?.searchTools(query) || [];
  };

  return (
    <ToolsForLifeContext.Provider
      value={{
        manager,
        config,
        updateConfig,
        executeTool,
        getMakerTools,
        getLifeTools,
        getChangeTools,
        getToolStats,
        searchTools,
      }}
    >
      {children}
    </ToolsForLifeContext.Provider>
  );
};
