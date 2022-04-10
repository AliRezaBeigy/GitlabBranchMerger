import React, {
  useState,
  useEffect,
  createContext,
  PropsWithChildren,
} from 'react';
import Tab = chrome.tabs.Tab;

export const TabContext = createContext<{
  currentTab?: Tab;
}>({
  currentTab: undefined,
});

const TabProvider: React.FC<PropsWithChildren<any>> = ({children}) => {
  const [CurrentTab, setCurrentTab] = useState<Tab>();

  useEffect(() => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const currentTab = tabs.length > 0 ? tabs[0] : undefined;
      if (!currentTab) return;

      if (currentTab.title?.endsWith('GitLab')) {
        setCurrentTab(currentTab);
      }
    });
  }, []);

  return (
    <TabContext.Provider
      value={{
        currentTab: CurrentTab,
      }}>
      {children}
    </TabContext.Provider>
  );
};
export default TabProvider;
