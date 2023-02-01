import KeyboardIcon from 'assets/icons/keyboard.svg';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Column } from '../atoms/Column';
import { InputLabel } from '../atoms/InputLabel';
import { MyIcon } from '../atoms/MyIcon';

import { Spacer } from '../atoms/Spacer';

const KeybindButton = styled.button`
  display: flex;
  align-items: center;

  padding: 9px;
  border: none;
  border-radius: 4px;
  background-color: #494d54;
  cursor: pointer;
  justify-content: space-between;

  &:hover {
    background-color: #494d5499;
  }
`;

const KeybindText = styled.p`
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #f8f8f8;
`;

type KeybindInputProps = {
  name: string;
  keybind: string;
  setKeybind(value: string): any;
  registerKeybind(): any;
  unregisterKeybind(): any;
};

export const KeybindInput: React.FC<KeybindInputProps> = ({
  name,
  keybind,
  setKeybind,
  registerKeybind,
  unregisterKeybind,
}: KeybindInputProps) => {
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
      unregisterKeybind();
    } else {
      clearKeys(keybind);
      registerKeybind();
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

  return (
    <Column
      style={{
        marginLeft: 27,
        marginRight: 27,
      }}
    >
      <InputLabel style={{ cursor: 'no-drop' }} onClick={deleteKeybind}>
        Keybind
      </InputLabel>
      <Spacer height={12} />
      <KeybindButton
        ref={buttonRef}
        disabled={name === ''}
        style={{ backgroundColor: buttonFocus ? '#494d5499' : '#494d54' }}
        onClick={() => toggleButtonFocus(buttonFocus)}
        onKeyDown={handleKeyDown}
      >
        <KeybindText>{keys.join('+')}</KeybindText>
        <MyIcon icon={KeyboardIcon} size={24} alt="input-keybind" />
      </KeybindButton>
    </Column>
  );
};
