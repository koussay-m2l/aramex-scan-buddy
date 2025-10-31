import { useEffect, useCallback } from 'react';
import { SunmiKeyboardHandler } from '@kduma-autoid/capacitor-sunmi-keyboard-handler';
import { Capacitor } from '@capacitor/core';

export const useSunmiScanner = (onScan: (code: string) => void, isEnabled: boolean) => {
  const isSunmiDevice = Capacitor.getPlatform() === 'android';

  const handleKeyboardInput = useCallback((data: { 
    groupKey: string; 
    key: string; 
    value: string; 
    isWhiteChar: boolean;
  }) => {
    if (data.value && isEnabled && !data.isWhiteChar) {
      onScan(data.value);
    }
  }, [onScan, isEnabled]);

  useEffect(() => {
    if (!isSunmiDevice || !isEnabled) return;

    let listenerHandle: any;

    // Register the keyboard input listener
    const setupListener = async () => {
      listenerHandle = await SunmiKeyboardHandler.addListener('onKeyboardInput', handleKeyboardInput);
    };

    setupListener();

    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
    };
  }, [isSunmiDevice, isEnabled, handleKeyboardInput]);

  return { isSunmiDevice };
};
