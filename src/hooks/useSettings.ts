import { useEffect, useState, useCallback } from 'react';
import { ServerAPI } from 'decky-frontend-lib';

export type Settings = {
  autoscan: boolean;
  customSites: string;
};

export const useSettings = (serverApi: ServerAPI) => {
  const [settings, setSettings] = useState<Settings>({
    autoscan: false,
    customSites: ''
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const savedSettings = (
          await serverApi.callPluginMethod('get_setting', {
            key: 'settings',
            default: settings
          })
        ).result as Settings;
        setSettings(savedSettings);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };
    getData();
  }, [serverApi, settings]);

  const updateSettings = useCallback(
    async (key: keyof Settings, value: Settings[keyof Settings]) => {
      setSettings((oldSettings) => {
        const newSettings = { ...oldSettings, [key]: value };
        serverApi.callPluginMethod('set_setting', {
          key: 'settings',
          value: newSettings
        });
        return newSettings;
      });
    },
    [serverApi]
  );

  const setAutoScan = useCallback(
    (value: Settings['autoscan']) => {
      updateSettings('autoscan', value);
    },
    [updateSettings]
  );

  const setCustomSites = useCallback(
    (value: Settings['customSites']) => {
      updateSettings('customSites', value);
    },
    [updateSettings]
  );

  return { settings, setAutoScan, setCustomSites };
};