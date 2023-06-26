import { useState, useEffect, useRef } from 'react';

export const useKeybind = (name: string, keybind: string, setKeybind: (value: string) => void) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [keys, setKeys] = useState<string[]>([]);
  const [buttonFocus, setButtonFocus] = useState<boolean>(false);

  const addKey = (value: string) => {
    const newKeys = [...keys, value];
    setKeys(newKeys);
    setKeybind(newKeys.join('+'));
  };

  const clearKeys = (value?: string) => {
    setKeys(value === undefined ? [] : value.split('+'));
    setKeybind(value ?? '');
  };

  const deleteKeybind = () => {
    clearKeys();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!buttonFocus) return;

    const keyLength = keys.length;

    if (event.key === 'Escape') {
      clearKeys(keybind);
      return;
    }

    if (keyLength < 3) {
      if (keys.includes(event.key)) return;
      addKey(event.key);
    } else {
      setKeys([event.key]);
      setKeybind(event.key);
    }
  };

  const toggleButtonFocus = (focused: boolean) => {
    if (!focused) {
      clearKeys();
    } else {
      clearKeys(keybind);
    }

    setButtonFocus(!focused);
  };

  useEffect(() => {
    if (name === '') return;
    toggleButtonFocus(true);
    setKeys(keybind.split('+'));
  }, [name]);

  useEffect(() => {
    setKeys(keybind.split('+'));
  }, [keybind]);

  return {
    keys,
    buttonRef,
    buttonFocus,
    toggleButtonFocus,
    deleteKeybind,
    handleKeyDown
  };
};
